import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { SplitCalls } from '../utils/SplitCalls';
import { sendCallToBackend } from '../utils/SendCall';

const CallButtons = () => {
  const [calls, setCalls] = useState([]);

  useEffect(() => {
    const loadCalls = async () => {
      try {
        const fetchedCalls = await SplitCalls();  // Fetch the calls data
        setCalls(fetchedCalls);
      } catch (error) {
        console.error('Error fetching calls:', error);
      }
    };

    loadCalls();
  }, []);

  const handleCallClick = async (callIndex) => {
    const selectedCall = calls.find(call => call.index === callIndex);
  
    console.log('Selected Call:', selectedCall); // Debugging log
  
    if (!selectedCall || !selectedCall.content) {
      console.error('Invalid call data:', selectedCall);
      return;
    }
  
    try {
      const result = await sendCallToBackend(selectedCall.content);
      console.log('Call sent successfully:', result);
    } catch (error) {
      console.error('Error sending call:', error);
    }
  };

  return (
    <Grid container spacing={2}>
      {calls.map((call) => (
        <Grid item xs={2} sm={1} key={call.id}>
          <Button
            variant="outlined"
            onClick={() => handleCallClick(call.index)}
            fullWidth
          >
            Call {call.index}
          </Button>
        </Grid>
      ))}
    </Grid>
  );
};

export default CallButtons;