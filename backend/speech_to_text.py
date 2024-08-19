import os
import json
from google.cloud import speech
from google.oauth2 import service_account
from dotenv import load_dotenv
from pathlib import Path
env_path = Path('.') / '.env.local'
print(env_path.resolve())
load_dotenv(dotenv_path=env_path)
print("Loaded environment variables:")
print(os.environ)

credentials_json = os.getenv("GOOGLE_APPLICATION_CREDENTIALS_JSON")
#os.environ['GOOGLE_APPLICATION_CREDENTIALS_JSON'] = credentials_json

#print(credentials_json)

if not credentials_json:
    raise ValueError("GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable is not set or is empty")

credentials_info = json.loads(credentials_json)
credentials = service_account.Credentials.from_service_account_info(credentials_info)

speech_client = speech.SpeechClient(credentials=credentials) # Use the parsed credentials


def convert_audio_to_text(audio_bytes):
    try:
        
        audio = speech.RecognitionAudio(content=audio_bytes) # Prepare the audio data for Google API
        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.WEBM_OPUS,
            language_code="en-US", # Potentially add other languages
            sample_rate_hertz=48000,
        )

        response = speech_client.recognize(config=config, audio=audio) # Send the audio data to the Google API

        # Log detailed response for further analysis
        '''print(f"Raw response: {response}")
        for result in response.results:
            print(f"Transcript: {result.alternatives[0].transcript}")
        '''
        
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
