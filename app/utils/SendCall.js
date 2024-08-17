export const sendCallToBackend = async (audioBlob) => {
  try {
    
    const formData = new FormData(); // Create a FormData object to send the audio file
    formData.append('audio', audioBlob, 'complaint.wav');
    
    const response = await fetch('http://localhost:5000/api/send-call', { // Send the POST request to the backend endpoint
      method: 'POST',
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