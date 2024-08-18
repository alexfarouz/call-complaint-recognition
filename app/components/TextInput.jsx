import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';

const TextInput = () => {
  const [text, setText] = useState('');
  const [response, setResponse] = useState(null); // State to hold the entire response
  const { getToken } = useAuth(); // Get the JWT token using Clerk's useAuth hook

  const handleChange = (event) => {
    setText(event.target.value);
  };

  const handleSubmit = async () => {
    if (!text) return;
    const token = await getToken();
    try {
      const response = await fetch('http://localhost:5000/api/send-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ complaint: text }),
      });

      if (!response.ok) {
        throw new Error('Failed to send text to the backend');
      }

      const result = await response.json();
      const parsedResult = JSON.parse(result); // Parse the response
      setResponse(parsedResult.response); // Set the entire response
    } catch (error) {
      console.error('Error sending text:', error);
      setResponse({ error: 'An error occurred while processing your request.' });
    }
  };

  return (
    <div className="pt-10">
      <h1 className="text-3xl mb-5">Type Your Complaint</h1>
      <textarea
        value={text}
        onChange={handleChange}
        placeholder="Type your complaint here..."
        rows="10"
        className="w-96 sm:w-full h-64 p-4 bg-[#d7deed] border border-transparent rounded-lg 
          focus:outline-none focus:bg-[#c5d1e8] text-[#424242] text-base resize-none leading-relaxed font-inter"
      />
      <button
        className="mt-4 px-6 py-3 bg-[#007BFF] text-white rounded-lg text-lg transition-colors hover:bg-white 
        hover:text-black focus:outline-none focus:ring-offset-2 focus:ring-[#007BFF] normal-case"
        onClick={handleSubmit}
      >
        Submit Complaint
      </button>

      {response && (
        <div className="w-full flex justify-center">
            <div className="w-96 sm:w-full justify-center response-text mt-8 p-4 bg-white rounded-lg shadow-md text-black">
            <h2 className="text-xl font-semibold">API Response:</h2>
            <p><strong>Complaint:</strong> {response.complaint ? "Yes" : "No"}</p>
            <p><strong>Summary:</strong> {response.summary}</p>
            <p><strong>Issue:</strong> {response.issue}</p>
            <p><strong>Sub-Issue:</strong> {response['sub-issue']}</p>
            </div>
        </div>
      )}
    </div>
  );
};

export default TextInput;
