from openai import OpenAI
import os
from dotenv import load_dotenv


load_dotenv(dotenv_path='../.env.local') # Load env variables

# Configure OpenAI API Key
openai_api_key = os.getenv("OPENAI_API_KEY")
os.environ['OPENAI_API_KEY'] = openai_api_key

openai_client = OpenAI()

def classify_and_summarize_call(call_content):
    try:
        # Craft the prompt for classification and summarization
        prompt = (
            """Determine if the following text is a complaint. Summarize the complaint:
            
            Return in the following JSON format
                    {
                        "response":[{
                            "complaint": true or false (pick one),
                            "summary":"string"
                        }]
                    }
            """
        )

        # Call the OpenAI API
        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages = [
                {"role": "system", "content": prompt},
                {"role": "user", "content": {call_content}}
            ],
            max_tokens=1000
        )

        # Extract the response text
        classification_summary = response.choices[0].message.content
        print(f"AI Response: {classification_summary}")  # Print the response in the console
        return classification_summary

    except Exception as e:
        print(f"Error with OpenAI API: {str(e)}")
        return None
