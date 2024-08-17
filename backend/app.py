from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import os
from speech_to_text import convert_audio_to_text  # Import the speech-to-text function

# Set up basic configuration for logging
logging.basicConfig(level=logging.DEBUG)
app = Flask(__name__)

# Allow CORS requests from your frontend domain
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

@app.route('/api/send-call', methods=['POST'])
def process_call_endpoint():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400

    audio_file = request.files['audio']
    print(audio_file)
    audio_bytes = audio_file.read()

    try:
        # Convert audio file to text using the speech-to-text API
        transcript = convert_audio_to_text(audio_bytes)
        print(f"Transcript: {transcript}")

        # For now, return only the transcript to the frontend
        return jsonify({'transcript': transcript}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
