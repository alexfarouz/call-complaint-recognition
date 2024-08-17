import os
import json
from google.cloud import speech
from google.oauth2 import service_account

# Load environment variables from .env.local
from dotenv import load_dotenv
load_dotenv(dotenv_path='../.env.local')

# Retrieve and parse the credentials JSON from the environment variable
credentials_json = os.getenv("GOOGLE_APPLICATION_CREDENTIALS_JSON")

# Parse the JSON string
credentials_info = json.loads(credentials_json)

# Use the parsed credentials
credentials = service_account.Credentials.from_service_account_info(credentials_info)
speech_client = speech.SpeechClient(credentials=credentials)

def convert_audio_to_text(audio_file):
    try:
        # Prepare the audio data
        audio = speech.RecognitionAudio(content=audio_file)

        # Configure the recognition settings
        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,  # Adjust if needed
            language_code="en-US",
        )

        # Call the API to recognize the speech
        response = speech_client.recognize(config=config, audio=audio)

        # Extract the transcript
        if response.results:
            transcript = response.results[0].alternatives[0].transcript
            print(f"Transcript: {transcript}")
            return transcript
        else:
            print("No speech recognized.")
            return None

    except Exception as e:
        print(f"Error during speech recognition: {str(e)}")
        return None
