from openai import OpenAI
import os
from dotenv import load_dotenv
from rag import perform_rag


load_dotenv(dotenv_path='.env.local') # Load env variables

openai_api_key = os.getenv("OPENAI_API_KEY")
os.environ['OPENAI_API_KEY'] = openai_api_key

openai_client = OpenAI()

def classify_and_summarize_call(transcript):
    try:

        augmented_query = perform_rag(transcript)

        # Craft the prompt for classification and summarization
        systemPrompt = """
            You are a call complaint classifier for a company called Ruby. The provided text is the content of the call. 
            Based on the call you must determine whether the call is a complaint or not. After determining if it is a complaint 
            or not, summarize the call based on the content given. Also make sure to define the issue and sub-issue respectively.
            Base your response heavily on the context given to you. Use the fields provided in the context to base your answers.
            If there is no issue or sub-issue for the user put "N/A" only as a last resort. Generate a similar issue or sub-issue if needed.
            Also generate a title for each query. If a user simply greets or it is not considered a complaint, still generate a short title
            for storage purposes

            Return in the following JSON format
                {
                    "response":{
                        "title": "string"
                        "complaint": true or false (based on call),
                        "summary":"string",
                        "issue":"string",
                        "sub-issue":"string",
                    }
                }
            Ensure not to surrond this with: json``` {...} ```
        """
        
        
        # Call the OpenAI API
        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages = [
                {"role": "system", "content": systemPrompt}, # System prompt
                {"role": "user", "content": augmented_query} # Call content
            ],
            max_tokens=1000
        )

        # Extract the response text
        classification_summary = response.choices[0].message.content
        return classification_summary

    except Exception as e:
        print(f"Error with OpenAI API: {str(e)}")
        return None
