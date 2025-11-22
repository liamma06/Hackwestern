import pyaudio
import wave
import os
import time
import threading
import queue
from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs

load_dotenv()

# Audio settings
CHUNK = 1024
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 16000
RECORD_SECONDS = 5  # Length of each chunk

client = ElevenLabs(api_key=os.getenv("ELEVEN_LAB_KEY"))
audio_queue = queue.Queue()

def play_response(audio_stream):
    """Plays the PCM audio stream from ElevenLabs"""
    p = pyaudio.PyAudio()
    stream = p.open(format=pyaudio.paInt16, channels=1, rate=24000, output=True)
    
    for chunk in audio_stream:
        if chunk:
            stream.write(chunk)
            
    stream.stop_stream()
    stream.close()
    p.terminate()

def process_audio_queue():
    """Worker thread to process recorded chunks"""
    while True:
        filename = audio_queue.get()
        if filename is None:
            break
            
        print(f"\n📤 Processing {filename}...")
        try:
            with open(filename, "rb") as audio_file:
                audio_stream = client.speech_to_speech.convert(
                    voice_id="JBFqnCBsd6RMkjVDRZzb",
                    audio=audio_file,
                    model_id="eleven_multilingual_sts_v2",
                    output_format="pcm_24000"
                )
                print(f"🔊 Playing response for {filename}...")
                play_response(audio_stream)
        except Exception as e:
            print(f"ElevenLabs Error: {e}")
        finally:
            audio_queue.task_done()

def record_chunks():
    p = pyaudio.PyAudio()
    
    # Create directory for recordings if it doesn't exist
    if not os.path.exists("recordings"):
        os.makedirs("recordings")
        
    # Start processing thread
    processing_thread = threading.Thread(target=process_audio_queue, daemon=True)
    processing_thread.start()
        
    print(f"🎤 Starting continuous recording. Saving {RECORD_SECONDS}s chunks...")
    print("Press Ctrl+C to stop.")
    
    chunk_index = 0
    
    try:
        # Open stream once to avoid gaps
        stream = p.open(format=FORMAT,
                        channels=CHANNELS,
                        rate=RATE,
                        input=True,
                        frames_per_buffer=CHUNK)

        while True:
            print(f"\n[Chunk {chunk_index}] Recording...")
            frames = []
            
            # Record for RECORD_SECONDS
            for _ in range(0, int(RATE / CHUNK * RECORD_SECONDS)):
                try:
                    data = stream.read(CHUNK, exception_on_overflow=False)
                    frames.append(data)
                except Exception as e:
                    print(f"Error reading audio: {e}")
                    break
            
            # Save to file
            filename = f"recordings/chunk_{chunk_index}.wav"
            wf = wave.open(filename, 'wb')
            wf.setnchannels(CHANNELS)
            wf.setsampwidth(p.get_sample_size(FORMAT))
            wf.setframerate(RATE)
            wf.writeframes(b''.join(frames))
            wf.close()
            
            print(f"💾 Saved: {filename}")
            
            # Add to queue for background processing
            audio_queue.put(filename)
            
            chunk_index += 1
            
    except KeyboardInterrupt:
        print("\n🛑 Recording stopped.")
    finally:
        if 'stream' in locals():
            stream.stop_stream()
            stream.close()
        p.terminate()

if __name__ == "__main__":
    record_chunks()
