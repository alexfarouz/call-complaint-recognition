import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { sendCallToBackend } from '../utils/SendCall';

const RecordCall = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [responseText, setResponseText] = useState(''); // New state variable to hold the API response

  useEffect(() => {
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      console.error("Your browser does not support audio recording.");
      return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = handleDataAvailable;
        setMediaRecorder(recorder);
      })
      .catch(err => console.error("Error accessing microphone:", err));
  }, []);

  const handleDataAvailable = (event) => {
    if (event.data && event.data.size > 0) {
      setAudioBlob(event.data);
      setAudioUrl(URL.createObjectURL(event.data));
    }
  };

  const startRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "recording") {
      mediaRecorder.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const handleSendToBackend = async () => {
    if (!audioBlob) return;

    try {
      const result = await sendCallToBackend(audioBlob);
      const parsedResult = JSON.parse(result); // Parse the response
      
      // Get the summary from the response
      const summary = parsedResult.response && parsedResult.response.summary 
        ? parsedResult.response.summary 
        : 'No summary received';
      setResponseText(summary);
    } catch (error) {
      console.error('Error sending call:', error);
      setResponseText('An error occurred while processing your request.');
    }
  };

  const handleDeleteRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setResponseText(''); // Clear the response text when deleting the recording
  };

  return (
    <div>
      <h1>Record Your Complaint</h1>
      {audioUrl && <audio src={audioUrl} controls />}
      <div style={{ marginTop: '20px' }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={startRecording} 
          disabled={isRecording}
          style={{ marginRight: '10px' }}
        >
          Start Recording
        </Button>
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={stopRecording} 
          disabled={!isRecording}
          style={{ marginRight: '10px' }}
        >
          Stop Recording
        </Button>
        <Button 
          variant="contained" 
          color="success" 
          onClick={handleSendToBackend} 
          disabled={!audioBlob}
          style={{ marginRight: '10px' }}
        >
          Send to Backend
        </Button>
        <Button 
          variant="contained" 
          color="error" 
          onClick={handleDeleteRecording} 
          disabled={!audioBlob}
        >
          Delete Recording
        </Button>
      </div>
      
      {/* Display the response text */}
      {responseText && (
        <div style={{ marginTop: '20px' }}>
          <h2>API Response:</h2>
          <p>{responseText}</p>
        </div>
      )}
    </div>
  );
};

export default RecordCall;
