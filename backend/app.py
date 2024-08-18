from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import os
import mysql.connector  # Import MySQL connector
from speech_to_text import convert_audio_to_text
from interpret_call import classify_and_summarize_call
from dotenv import load_dotenv

#logging.basicConfig(level=logging.DEBUG)
load_dotenv(dotenv_path='.env.local')
app = Flask(__name__)

# Allow CORS requests from your frontend domain
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# MySQL Database connection settings
db_config = {
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'host': os.getenv('DB_HOST'),
    'database': os.getenv('DB_NAME')
}

# Function to store complaint data in MySQL
def store_complaint_in_db(complaint_text):
    try:
        # Connect to the database
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        # SQL query to insert data
        add_complaint = ("INSERT INTO complaints (complaint_text) VALUES (%s)")

        # Pass the complaint_text as a single-item tuple
        cursor.execute(add_complaint, (complaint_text,))

        # Commit the transaction
        connection.commit()

        # Close the cursor and connection
        cursor.close()
        connection.close()
    except mysql.connector.Error as err:
        logging.error(f"Error: {err}")
        raise


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
        store_complaint_in_db(transcript)  # Store the complaint in the MySQL database
        return jsonify(response), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/send-text', methods=['POST'])
def process_text_endpoint():
    data = request.get_json()
    complaint_text = data.get('complaint')

    if not complaint_text:
        return jsonify({'error': 'No text provided'}), 400

    try:
        response = classify_and_summarize_call(complaint_text)  # Directly pass the text to the OpenAI API for classification
        print(response)
        store_complaint_in_db(complaint_text)  # Store the complaint in the MySQL database
        return jsonify(response), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)