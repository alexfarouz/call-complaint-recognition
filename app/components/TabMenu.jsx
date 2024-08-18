import React, { useState } from 'react';
import { Box, Container, Tabs, Tab } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { IoIosArrowRoundBack } from 'react-icons/io';
import RecordCall from './RecordCall'; // Import your RecordCall component
import TextInput from './TextInput'; // Import your TextInput component
import './ComplaintClassifier.css';
import  Navbar from '../components/Navbar'

export default function TabMenu() {
  const [activeTab, setActiveTab] = useState('voice'); // Default to the 'voice' tab

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <>
    <Navbar />
    <div className="recording-container">
    
      <div className="text-4xl pt-2" style={{ position: 'absolute', top: '5px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
        <Container maxWidth="md" className="bg-blue-950 p-5 rounded-3xl">Complaint Recognition</Container>
      </div>
      <Box sx={{ width: '100%', maxWidth: '800px', margin: '0 auto', mt: 2 }}>
        {/* Tab Menu */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: { xs: 'center', sm: 'center' }, // Center the tabs on mobile
            position: 'relative',
            backgroundColor: '#007BFF',
            borderRadius: '24px',
            padding: '4px',
            width: 'fit-content',
            margin: { xs: '0 auto', sm: 'initial' }, // Ensure it's centered on mobile
          }}
          className="mb-12 bg-blue-950"
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              minHeight: 0,
              '& .MuiTabs-indicator': {
                display: 'none',
              },
            }}
          >
            <Tab
              label="Voice Recording"
              value="voice"
              sx={{
                fontSize: 14,
                textTransform: 'capitalize',
                padding: '6px 12px',
                borderRadius: '24px',
                color: activeTab === 'voice' ? '#ffffff' : 'white',
                fontWeight: activeTab === 'voice' ? 'bold' : 'normal',
                cursor: 'pointer',
                backgroundColor: activeTab === 'voice' ? '#ffffff' : 'transparent',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '-5px',
                  left: '-5px',
                  right: '-5px',
                  bottom: '-5px',
                  border: activeTab === 'voice' ? '2px solid white' : 'none',
                  borderRadius: '24px',
                  zIndex: -1,
                },
                fontFamily: 'Inter, sans-serif',
              }}
            />
            <Tab
              label="Text Input"
              value="text"
              sx={{
                fontSize: 14,
                textTransform: 'capitalize',
                padding: '6px 12px',
                borderRadius: '24px',
                color: activeTab === 'text' ? '#ffffff' : 'white',
                fontWeight: activeTab === 'text' ? 'bold' : 'normal',
                cursor: 'pointer',
                backgroundColor: activeTab === 'text' ? '#ffffff' : 'transparent',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '-5px',
                  left: '-5px',
                  right: '-5px',
                  bottom: '-5px',
                  border: activeTab === 'text' ? '2px solid white' : 'none',
                  borderRadius: '24px',
                  zIndex: -1,
                },
                fontFamily: 'Inter, sans-serif',
              }}
            />
          </Tabs>
        </Box>


        {/* Content Area */}
        <AnimatePresence mode="wait">
          {activeTab === 'voice' && (
            <motion.div
              key="voice"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              style={{ height: '500px' }} // Set consistent height
            >
              <RecordCall />
            </motion.div>
          )}

          {activeTab === 'text' && (
            <motion.div
              key="text"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              style={{ height: '500px' }} // Set consistent height
            >
              <TextInput />
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </div></>
  );
}
