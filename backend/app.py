from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import os
from speech_to_text import convert_audio_to_text  # Import the speech-to-text function
from rag import classify_and_summarize_call

logging.basicConfig(level=logging.DEBUG)
app = Flask(__name__)

# Allow CORS requests from your frontend domain
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

@app.route('/api/send-call', methods=['POST'])
def process_call_endpoint():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400

    audio_file = request.files['audio'] # Get audio file
    audio_bytes = audio_file.read()  # Convert file into bytes

    try:
        transcript = convert_audio_to_text(audio_bytes) # Convert bytes into transcript via Google Cloud Speech to Text
        print(f"Transcript: {transcript}")

        response = classify_and_summarize_call(transcript) # Pass the transcript to the OpenAI API for classification
        print(response)
        return jsonify(response), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
