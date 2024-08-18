from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import os
import mysql.connector  # Import MySQL connector
from speech_to_text import convert_audio_to_text
from interpret_call import classify_and_summarize_call
from dotenv import load_dotenv
import json
import jwt
import requests
from jwt.exceptions import InvalidTokenError

#logging.basicConfig(level=logging.DEBUG)
load_dotenv(dotenv_path='.env.local')
app = Flask(__name__)

# Allow CORS requests from your frontend domain
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

CLERK_API_KEY = os.getenv('CLERK_SECRET_KEY')

JWKS_URL = "https://rapid-octopus-76.clerk.accounts.dev/.well-known/jwks.json"

def get_jwks():
    response = requests.get(JWKS_URL)
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception("Failed to fetch JWKS")

def get_signing_key(jwks, kid):
    for key in jwks['keys']:
        if key['kid'] == kid:
            return jwt.algorithms.RSAAlgorithm.from_jwk(key)
    raise Exception("Signing key not found")

def validate_jwt(token):
    try:
        # Decode the token headers to get the key id (kid)
        unverified_headers = jwt.get_unverified_header(token)
        kid = unverified_headers['kid']

        # Fetch the JWKS and get the signing key
        jwks = get_jwks()
        signing_key = get_signing_key(jwks, kid)

        # Decode the JWT using the signing key
        # Remove the 'aud' check if not required
        decoded_token = jwt.decode(token, signing_key, algorithms=["RS256"], options={"verify_aud": False})

        return decoded_token
    except InvalidTokenError as e:
        logging.error(f"Invalid token: {e}")
        return None

def ensure_user_exists(user_id, email, name):
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        # Check if the user already exists
        cursor.execute("SELECT COUNT(*) FROM users WHERE id = %s", (user_id,))
        result = cursor.fetchone()

        if result[0] == 0:  # If the user does not exist, insert them
            cursor.execute("INSERT INTO users (id, email, name) VALUES (%s, %s, %s)", (user_id, email, name))
            connection.commit()

        cursor.close()
        connection.close()
    except mysql.connector.Error as err:
        logging.error(f"Error: {err}")
        raise


# MySQL Database connection settings
db_config = {
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'host': os.getenv('DB_HOST'),
    'database': os.getenv('DB_NAME')
}

# Function to store complaint data in MySQL
def store_complaint_in_db(user_id, complaint_text, summary, issue, subissue):
    try:
        # Connect to the database
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        # SQL query to insert data
        add_complaint = ("INSERT INTO complaints (user_id, complaint_text, summary, issue, subissue) "
                         "VALUES (%s, %s, %s, %s, %s)")

        # Pass the complaint_text as a single-item tuple
        cursor.execute(add_complaint, (user_id, complaint_text, summary, issue, subissue))

        # Commit the transaction
        connection.commit()

        # Close the cursor and connection
        cursor.close()
        connection.close()
    except mysql.connector.Error as err:
        logging.error(f"Error: {err}")
        raise

def authenticate_and_ensure_user(request):
    auth_header = request.headers.get('Authorization')  # Get the Authorization header
    if not auth_header:
        return None, 'User not authenticated', 401
    
    token = auth_header.split(" ")[1]  # Extract the token from the header
    user_data = validate_jwt(token)

    if not user_data:  # If the token is invalid or user_data is None
        return None, 'Invalid or expired token', 401

    user_id = user_data['sub']  # Extract the user ID from the validated token
    user_email = user_data.get('email', 'unknown@example.com')  # Extract email from token or use a default
    user_name = user_data.get('name', 'Unknown User')  # Extract name from token or use a default

    # Ensure the user exists in the database
    ensure_user_exists(user_id, user_email, user_name)

    return user_id, None, None


@app.route('/api/send-call', methods=['POST'])
def process_call_endpoint():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400

    # Authenticate the user and ensure they exist in the database
    user_id, error_message, status_code = authenticate_and_ensure_user(request)

    if error_message:  # If there's an error in authentication
        return jsonify({'error': error_message}), status_code

    audio_file = request.files['audio'] # Get audio file
    audio_bytes = audio_file.read()  # Convert file into bytes

    try:
        transcript = convert_audio_to_text(audio_bytes) # Convert bytes into transcript via Google Cloud Speech to Text
        print(f"Transcript: {transcript}")

        response = classify_and_summarize_call(transcript) # Pass the transcript to the OpenAI API for classification
        response_dict = json.loads(response)

        # Extract the values from the response
        complaint_text = "Yes" if response_dict["response"].get('complaint', False) else "No"
        summary = response_dict["response"].get('summary', '')
        issue = response_dict["response"].get('issue', '')
        subissue = response_dict["response"].get('sub-issue', '')

        # Store the complaint in the MySQL database
        store_complaint_in_db(user_id, complaint_text, summary, issue, subissue)  # Store the complaint in the MySQL database
        return jsonify(response), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/send-text', methods=['POST'])
def process_text_endpoint():
    user_id, error_message, status_code = authenticate_and_ensure_user(request)
    
    if error_message:  # If there's an error in authentication
        return jsonify({'error': error_message}), status_code
    
    data = request.get_json()
    complaint_text = data.get('complaint')

    if not complaint_text:
        return jsonify({'error': 'No text provided'}), 400

    try:
        response = classify_and_summarize_call(complaint_text)  # Directly pass the text to the OpenAI API for classification
        response_dict = json.loads(response)

        # Extract the values from the response
        complaint_text = "Yes" if response_dict["response"].get('complaint', False) else "No"
        summary = response_dict["response"].get('summary', '')
        issue = response_dict["response"].get('issue', '')
        subissue = response_dict["response"].get('sub-issue', '')
        print(response)

        store_complaint_in_db(user_id, complaint_text, summary, issue, subissue) # Store the complaint in the MySQL database
        return jsonify(response), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)