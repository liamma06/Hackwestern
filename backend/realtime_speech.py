import asyncio
import websockets
import json
import os
from dotenv import load_dotenv
import pyaudio
import base64
from elevenlabs.client import ElevenLabs
import threading
import queue


load_dotenv()

# Audio configuration
CHUNK = 1024
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 16000

# Queue for audio playback
audio_queue = queue.Queue()

class RealtimeSpeechToSpeech:
    def __init__(self):
        self.elevenlabs_client = ElevenLabs(api_key=os.getenv("ELEVEN_LAB_KEY"))
        self.audio = pyaudio.PyAudio()
        self.is_running = False
        
    async def start(self):
        """Start real-time speech-to-speech"""
        print("🎤 Starting real-time speech-to-speech...")
        print("Speak into your microphone. Press Ctrl+C to stop.\n")
        
        # Connect to ElevenLabs transcription WebSocket
        elevenlabs_url = (
            "wss://api.elevenlabs.io/v1/speech-to-text/realtime"
            f"?model_id=eleven_multilingual_v2"
            f"&include_timestamps=false"
            f"&audio_format=pcm_16000"
            f"&commit_strategy=vad"
            f"&vad_silence_threshold_secs=0.5"
        )
        
        headers = {"xi-api-key": os.getenv("ELEVEN_LAB_KEY")}
        
        async with websockets.connect(elevenlabs_url, additional_headers=headers) as ws:
            self.is_running = True
            
            # Start audio playback thread
            playback_thread = threading.Thread(target=self.play_audio, daemon=True)
            playback_thread.start()
            
            # Task to capture and send microphone audio
            async def send_audio():
                stream = self.audio.open(
                    format=FORMAT,
                    channels=CHANNELS,
                    rate=RATE,
                    input=True,
                    frames_per_buffer=CHUNK
                )
                
                print("✓ Microphone ready")
                
                try:
                    while self.is_running:
                        # Read audio from microphone
                        data = stream.read(CHUNK, exception_on_overflow=False)
                        
                        # Convert to base64
                        audio_base64 = base64.b64encode(data).decode('utf-8')
                        
                        # Send to ElevenLabs
                        message = {
                            "message_type": "input_audio_chunk",
                            "audio_base_64": audio_base64,
                            "commit": False,
                            "sample_rate": RATE
                        }
                        await ws.send(json.dumps(message))
                        await asyncio.sleep(0.01)
                        
                except Exception as e:
                    print(f"Error sending audio: {e}")
                finally:
                    stream.stop_stream()
                    stream.close()
            
            # Task to receive transcriptions and convert to speech
            async def receive_and_speak():
                try:
                    async for message in ws:
                        data = json.loads(message)
                        msg_type = data.get('message_type')
                        
                        if msg_type == 'session_started':
                            print(f"✓ Session started: {data['session_id']}\n")
                        
                        elif msg_type == 'partial_transcript':
                            text = data['text']
                            if text.strip():
                                print(f"📝 Hearing: {text}")
                        
                        elif msg_type == 'committed_transcript':
                            text = data['text']
                            if text.strip():
                                print(f"\n✅ Transcribed: {text}")
                                # Convert to speech
                                await self.text_to_speech(text)
                        
                        elif 'error' in msg_type:
                            print(f"❌ ERROR: {data.get('error')}")
                            
                except Exception as e:
                    print(f"Error receiving: {e}")
            
            # Run both tasks
            try:
                await asyncio.gather(
                    send_audio(),
                    receive_and_speak()
                )
            except KeyboardInterrupt:
                print("\n\n🛑 Stopping...")
                self.is_running = False
    
    async def text_to_speech(self, text):
        """Convert text to speech using ElevenLabs"""
        try:
            print(f"🔊 Speaking: {text}")
            
            # Generate audio
            audio_stream = self.elevenlabs_client.text_to_speech.convert(
                text=text,
                voice_id="JBFqnCBsd6RMkjVDRZzb",  # George voice
                model_id="eleven_multilingual_v2",
                output_format="pcm_16000",
            )
            
            # Queue audio chunks for playback
            for chunk in audio_stream:
                audio_queue.put(chunk)
            
            # Signal end of this audio
            audio_queue.put(None)
            
        except Exception as e:
            print(f"Error in TTS: {e}")
    
    def play_audio(self):
        """Play audio from queue in separate thread"""
        stream = self.audio.open(
            format=FORMAT,
            channels=CHANNELS,
            rate=RATE,
            output=True
        )
        
        print("✓ Speaker ready")
        
        try:
            while self.is_running:
                try:
                    chunk = audio_queue.get(timeout=0.1)
                    if chunk is None:  # End of audio signal
                        print("🔇 Finished speaking\n")
                        continue
                    stream.write(chunk)
                except queue.Empty:
                    continue
        except Exception as e:
            print(f"Error playing audio: {e}")
        finally:
            stream.stop_stream()
            stream.close()
    
    def cleanup(self):
        """Cleanup audio resources"""
        self.is_running = False
        self.audio.terminate()

async def main():
    system = RealtimeSpeechToSpeech()
    try:
        await system.start()
    finally:
        system.cleanup()

if __name__ == "__main__":
    asyncio.run(main())