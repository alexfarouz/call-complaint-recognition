from langchain_pinecone import PineconeVectorStore
from langchain_openai import OpenAIEmbeddings
from openai import OpenAI
from pinecone import Pinecone
from dotenv import load_dotenv
import os
#from sklearn.metrics.pairwise import cosine_similarity
#import numpy as np

load_dotenv(dotenv_path='../.env.local')

pinecone_api_key = os.getenv("PINECONE_API_KEY")
os.environ['PINECONE_API_KEY'] = pinecone_api_key

openai_api_key = os.getenv("OPENAI_API_KEY")
os.environ['OPENAI_API_KEY'] = openai_api_key

embeddings = OpenAIEmbeddings()
embed_model = "text-embedding-3-small" # OpenAI embedding model
openai_client = OpenAI()

# Test cosine similarity
'''
def get_embedding(text, model="text-embedding-3-small"): # Call the OpenAI API to get the embedding for the text
    response = openai_client.embeddings.create(input=text, model=model)
    return response.data[0].embedding


def cosine_similarity_between_words(sentence1, sentence2):
    embedding1 = np.array(get_embedding(sentence1))
    embedding2 = np.array(get_embedding(sentence2))

    embedding1 = embedding1.reshape(1, -1)
    embedding2 = embedding2.reshape(1, -1)

    return cosine_similarity(embedding1, embedding2)[0][0]
'''

# Initialize Pinecone
namespace = "calls"
index_name = "call-complaint-recognition"
vectorstore = PineconeVectorStore(index_name=index_name, embedding=embeddings)


# Load calls into database
'''
def call_splitter():
    with open('../calls.json', 'r') as file:
        calls_data = json.load(file)
    calls = []
    for i in range(len(calls_data)):
        call_text = """
        Product: {product}
        Complaint: {complaint_what_happened}
        Issue: {issue}
        Sub-Issue: {sub_issue}
        Company-Response: {company_response}
        """.format(
            product=calls_data[i]["_source"]["product"],
            complaint_what_happened=calls_data[i]["_source"]["complaint_what_happened"],
            issue=calls_data[i]["_source"]["issue"],
            sub_issue=calls_data[i]["_source"]["sub_issue"],
            company_response=calls_data[i]["_source"]["company_response"]
        )
        calls.append(call_text)
    return calls

calls = call_splitter()
print(calls[0])
print(len(calls))

vectorstore_from_texts = PineconeVectorStore.from_texts(
    texts=[f"Source: Sample Data \n\nContent: {call}" for call in calls],
    embedding=embeddings,
    index_name="call-complaint-recognition",
    namespace=namespace
)'''

pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"),)
pinecone_index = pc.Index(index_name)

def perform_rag(query):
    raw_query_embedding = openai_client.embeddings.create(
        input=query,
        model="text-embedding-3-small"
    )
    query_embedding = raw_query_embedding.data[0].embedding
    top_matches = pinecone_index.query(
        vector=query_embedding,
        top_k=10,
        include_metadata=True,
        namespace=namespace
    )
    contexts = [item['metadata']['text'] for item in top_matches['matches']]
    augmented_query = (
        "<CONTEXT>\n" + "\n\n-------\n\n".join(contexts[:10]) + "\n-------\n</CONTEXT>\n\n\n\nMY QUESTION:\n" + query
    )
    return augmented_query

