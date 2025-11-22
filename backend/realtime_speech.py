import os
from dotenv import load_dotenv
from io import BytesIO
import pyaudio
from elevenlabs.client import ElevenLabs

load_dotenv()

API_KEY = os.getenv("ELEVENLABS_API_KEY")


if __name__ == "__main__":
    main()
