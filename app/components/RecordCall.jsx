import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MicIcon from '@mui/icons-material/Mic';
import MicNoneIcon from '@mui/icons-material/MicNone';
import { sendCallToBackend } from '../utils/SendCall';
import { IoIosArrowRoundBack } from 'react-icons/io';
import './RecordCall.css'; // Import the CSS file for styling

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

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
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
    <div className="recording-container">
      <a href="/" className="back-button">
        <IoIosArrowRoundBack size={30} />
      </a>
      <h1 className="record-title">Record Your Complaint</h1>
      <div className="microphone-container">
        <IconButton 
          className={`microphone-icon ${isRecording ? 'recording' : ''}`} 
          onClick={toggleRecording}
          aria-label={isRecording ? "Stop Recording" : "Start Recording"}
        >
          {isRecording ? <MicIcon fontSize="inherit" /> : <MicNoneIcon fontSize="inherit" />}
        </IconButton>
        <div className={`wave-animation ${isRecording ? 'wave-active' : ''}`}></div>
      </div>
      
      <div className="button-group">
        <Button 
          variant="contained" 
          color="primary" 
          onClick={startRecording} 
          disabled={isRecording}
        >
          Start Recording
        </Button>
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={stopRecording} 
          disabled={!isRecording}
        >
          Stop Recording
        </Button>
        <Button 
          variant="contained" 
          color="success" 
          onClick={handleSendToBackend} 
          disabled={!audioBlob}
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
      {audioUrl && <audio src={audioUrl} controls />}
      {responseText && (
        <div className="response-text">
          <h2>API Response:</h2>
          <p>{responseText}</p>
        </div>
      )}
    </div>
  );
};

export default RecordCall;
