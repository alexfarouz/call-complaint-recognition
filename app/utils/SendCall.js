export const sendCallToBackend = async (callContent) => {
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
};