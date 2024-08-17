import os
import json
import subprocess
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


def convert_audio_to_text(audio_bytes):
    try:

        # Prepare the audio data for Google API
        audio = speech.RecognitionAudio(content=audio_bytes)
        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.WEBM_OPUS,
            language_code="en-US",
            sample_rate_hertz=48000,  # Ensure the sample rate matches the conversion
        )

        # Send the audio data to the Google API
        response = speech_client.recognize(config=config, audio=audio)

        # Log detailed response for further analysis
        print(f"Raw response: {response}")
        for result in response.results:
            print(f"Transcript: {result.alternatives[0].transcript}")

        if response.results:
            transcript = response.results[0].alternatives[0].transcript
            print(f"Transcript: {transcript}")
            return transcript
        else:
            print("No speech recognized.")
            return None

    except Exception as e:
        print(f"Error during speech recognition: {str(e)}")
        #print(f"File Path: {audio_file_path}")  # Print the file path if an error occurs
        return None
