/*export const sendCallToBackend = async (callContent) => {
    try {
      const response = await fetch('http://localhost:5000/api/send-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: callContent }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to send call to the backend');
      }
  
      const result = await response.json();
      console.log('Backend response:', result);
    } catch (error) {
      console.error('Error sending call:', error);
      throw error;
    }
};*/

export const sendCallToBackend = async (audioBlob) => {
  try {
    // Create a FormData object to send the audio file
    const formData = new FormData();
    formData.append('audio', audioBlob, 'complaint.wav');

    // Send the POST request to the correct backend endpoint
    const response = await fetch('http://localhost:5000/api/send-call', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to send the call to the backend');
    }

    const result = await response.json();
    console.log('Backend response:', result);
    return result;
  } catch (error) {
    console.error('Error sending call:', error);
    throw error;
  }
};