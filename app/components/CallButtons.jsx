import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { fetchCallById, fetchCallIds } from '../utils/fetchCall';
import { sendCallToBackend } from '../utils/SendCall';

const CallButtons = () => {
  const [callIds, setCallIds] = useState([]);

  useEffect(() => {
    const loadCallIds = async () => {
      try {
        const ids = await fetchCallIds();  // Fetch only the document IDs from Firestore
        setCallIds(ids);
      } catch (error) {
        console.error('Error fetching call IDs:', error);
      }
    };

    loadCallIds();
  }, []);

  const handleCallClick = async (callId) => {
    try {
      const selectedCall = await fetchCallById(callId);  // Fetch the specific call by ID when button is clicked
      console.log('Selected Call:', selectedCall); // Debugging log

      if (!selectedCall || !selectedCall.complaint_what_happened) {
        console.error('Invalid call data:', selectedCall);
        return;
      }

      const result = await sendCallToBackend(selectedCall.complaint_what_happened);
      console.log('Call sent successfully:', result);
    } catch (error) {
      console.error('Error fetching or sending call:', error);
    }
  };

  return (
    <Grid container spacing={2}>
      {callIds.map((callId, index) => (
        <Grid item xs={2} sm={1} key={callId}>
          <Button
            variant="outlined"
            onClick={() => handleCallClick(callId)}
            fullWidth
          >
            Call {index + 1}
          </Button>
        </Grid>
      ))}
    </Grid>
  );
};

export default CallButtons;
