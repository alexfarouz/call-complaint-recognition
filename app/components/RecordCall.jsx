import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MicIcon from '@mui/icons-material/Mic';
import MicNoneIcon from '@mui/icons-material/MicNone';
import { sendCallToBackend } from '../utils/SendCall';
import './ComplaintClassifier.css';

const RecordCall = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [response, setResponse] = useState(null); // State to hold the entire response

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
      setResponse(parsedResult.response); // Set the entire response
    } catch (error) {
      console.error('Error sending call:', error);
      setResponse({ error: 'An error occurred while processing your request.' });
    }
  };

  const handleDeleteRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setResponse(null); // Clear the response when deleting the recording
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="record-title text-3xl font-inter text-center">Record Your Complaint</h1>
      <div className="microphone-container flex justify-center">
        <IconButton 
          className={`microphone-icon ${isRecording ? 'recording' : ''}`} 
          onClick={toggleRecording}
          aria-label={isRecording ? "Stop Recording" : "Start Recording"}
        >
          {isRecording ? <MicIcon fontSize="inherit" /> : <MicNoneIcon fontSize="inherit" />}
        </IconButton>
        <div className={`wave-animation ${isRecording ? 'wave-active' : ''}`}></div>
      </div>
      
      <div className="pt-8">
        <div className="flex justify-center space-x-2 sm:space-x-4">
          <Button 
            variant="contained" 
            onClick={startRecording} 
            disabled={isRecording}
            className="px-4 py-2 sm:px-4 sm:py-2 bg-[#007BFF] text-white rounded-lg text-sm sm:text-xl font-medium 
              transition-colors hover:bg-white hover:text-blue-600 focus:outline-none
              focus:ring-offset-2 focus:ring-blue-600 normal-case sm:min-w-48"
          >
            Start Recording
          </Button>
          <Button 
            variant="contained" 
            onClick={stopRecording} 
            disabled={!isRecording}
            className="px-4 py-2 sm:px-4 sm:py-2 bg-red-600 text-white rounded-lg text-sm sm:text-lg font-medium 
              transition-colors hover:bg-white hover:text-red-600 focus:outline-none 
              focus:ring-offset-2 focus:ring-red-600 normal-case sm:min-w-48"
          >
            Stop Recording
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSendToBackend} 
            disabled={!audioBlob}
            className="px-4 py-2 sm:px-4 sm:py-2 bg-green-600 text-white rounded-lg text-sm sm:text-lg font-medium 
              transition-colors hover:bg-white hover:text-green-600 focus:outline-none 
              focus:ring-offset-2 focus:ring-green-600 normal-case sm:min-w-48"
          >
            Submit Complaint
          </Button>
          <Button 
            variant="contained" 
            onClick={handleDeleteRecording} 
            disabled={!audioBlob}
            className="px-4 py-2 sm:px-4 sm:py-2 bg-red-600 text-white rounded-lg text-sm sm:text-lg font-medium 
              transition-colors hover:bg-white hover:text-red-600 focus:outline-none
              focus:ring-offset-2 focus:ring-red-600 normal-case sm:min-w-48"
          >
            Delete Recording
          </Button>
        </div>

        {audioUrl && (
          <div className="flex justify-center my-4">
            <audio src={audioUrl} controls />
          </div>
        )}

        {response && (
          <div className="mt-8 flex justify-center">
            <div className="w-full sm:w-auto sm:min-w-[51rem] p-4 bg-white rounded-lg shadow-md text-black">
              <h2 className="text-xl font-semibold">API Response:</h2>
              <p><strong>Complaint:</strong> {response.complaint ? "Yes" : "No"}</p>
              <p><strong>Summary:</strong> {response.summary}</p>
              <p><strong>Issue:</strong> {response.issue}</p>
              <p><strong>Sub-Issue:</strong> {response['sub-issue']}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordCall;
