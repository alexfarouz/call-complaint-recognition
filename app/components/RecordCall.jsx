import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { sendCallToBackend } from '../utils/SendCall';

const RecordCall = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);

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
      console.log('Call sent successfully:', result);
    } catch (error) {
      console.error('Error sending call:', error);
    }
  };

  const handleDeleteRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
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
    </div>
  );
};

export default RecordCall;
