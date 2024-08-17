from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import os
from rag import print_call_content

# Set up basic configuration for logging
logging.basicConfig(level=logging.DEBUG)
app = Flask(__name__)

# Allow CORS requests from your frontend domain
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

@app.route('/api/send-call', methods=['POST'])
def process_call_endpoint():
    data = request.json
    call_content = data.get('content', '')

    if not call_content:
        return jsonify({'error': 'No call content provided'}), 400

    try:
        print_call_content(call_content)
        return jsonify({'message': 'Call content printed successfully'}), 200
    except Exception as e:
        print(f"Error occurred: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
