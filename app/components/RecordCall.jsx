import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import MicIcon from '@mui/icons-material/Mic';
import MicNoneIcon from '@mui/icons-material/MicNone';
import { sendCallToBackend } from '../utils/SendCall';
import './ComplaintClassifier.css';
import { useAuth } from '@clerk/nextjs';

const RecordCall = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [response, setResponse] = useState(null); // State to hold the entire response
  const { getToken } = useAuth();

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
      const token = await getToken();
      console.log("JWT Token:", token);
      const result = await sendCallToBackend(audioBlob, token);
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
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
      <h1 className="record-title text-3xl font-inter text-center pb-16">Record Your Complaint</h1>
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
      
      <div className="pt-16">
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
        <button className={`px-4 py-2 rounded-lg border items-center space-x-2 sm:min-w-40
          ${isRecording ? 'bg-transparent border-transparent text-gray-500 cursor-not-allowed' : 
          'bg-white text-black border-gray-300 hover:bg-gray-100 hover:border-gray-400'}`}
          onClick={startRecording}
          disabled={isRecording} // Ensure button is disabled properly
        >
          Start Recording
        </button>
        <button className={`px-4 py-2 rounded-lg items-center space-x-2 sm:min-w-40
          ${isRecording ? 'bg-red-600 text-white hover:bg-white hover:text-red-600'
          : 'bg-transparent border-transparent text-gray-500 cursor-not-allowed'}`}
          onClick={stopRecording}
          disabled={!isRecording} // Ensure button is disabled properly
        >
          Stop Recording
        </button>
        
        <button className={`px-4 py-2 rounded-lg items-center space-x-2 sm:min-w-40
          ${audioBlob ? 'bg-green-600 text-white hover:bg-white hover:text-green-600':
            'bg-transparent border-transparent text-gray-500 cursor-not-allowed' }`}
          onClick={handleSendToBackend}
          disabled={!audioBlob} // Ensure button is disabled properly
        >
          Submit Complaint
        </button>
        <button className={`px-4 py-2 rounded-lg items-center space-x-2 sm:min-w-40
          ${audioBlob ? 'bg-red-600 text-white hover:bg-white hover:text-red-600'
          : 'bg-transparent border-transparent text-gray-500 cursor-not-allowed'}`}
          onClick={handleDeleteRecording}
          disabled={!audioBlob} // Ensure button is disabled properly
        >
          Delete Recording
        </button>
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
