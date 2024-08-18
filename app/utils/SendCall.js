export const sendCallToBackend = async (audioBlob, token) => {
  try {
    
    const formData = new FormData(); // Create a FormData object to send the audio file
    formData.append('audio', audioBlob, 'complaint.wav');
    
    const response = await fetch('https://saphire-ts4s.onrender.com/api/send-call', { // Send the POST request to the backend endpoint
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`, // Include the JWT token in the Authorization header
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to send the call to the backend');
    }

    const result = await response.json(); // Get the response from the OpenAI API
    return result;
  } catch (error) { // Catch any potential errors
    console.error('Error sending call:', error);
    throw error;
  }
};