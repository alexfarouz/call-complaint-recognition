import React from 'react';
import { Typography, Button, Container, Grid, Paper, IconButton, Link } from '@mui/material';
import { Security, Speed, IntegrationInstructions, Email } from '@mui/icons-material';
import './LandingPage.css';
import Navbar from './Navbar'
import {motion} from 'framer-motion'
import Image from 'next/image';
import { GiExpense } from "react-icons/gi";
import { RiRobot3Fill } from "react-icons/ri";

const LandingPage = () => {
  return (
    <div className="landing-page">
      <Navbar />

      <Container maxWidth="md" className="py-96">
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }} className='cycle-colors'
        >
          <h2 className="text-white text-center text-4xl font-normal">
            Welcome to <span className="font-bold">Saphire</span>
          </h2>
        </motion.div>
      </Container>

      {/* About */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="bg-blue-950 lg:max-w-5xl max-w-80 p-8 lg:p-16 mx-auto rounded-3xl"
      >
        <Container>
          <Typography variant="h4" component="h3" className="text-center pb-10">
            About Saphire
          </Typography>
          <Typography variant="body1" component="p">
            Welcome to Saphire, your trusted partner in navigating the complexities of personal finance and customer satisfaction. 
            At Saphire, we are committed to harnessing the power of cutting-edge technology to provide you with innovative solutions 
            that simplify your financial life and enhance your business operations. Our platform offers two groundbreaking features: 
            AI-Powered Complaint Recognition and an Expense Tracker, both designed to bring efficiency, 
            transparency, and ease into your daily financial management.
          </Typography>
        </Container>
      </motion.div>

      {/* Features Section */}
      <div className="container mx-auto flex flex-col lg:flex-row justify-center mt-20 space-y-8 lg:space-y-0 ">
        {/* Expense Tracker */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="bg-blue-950 lg:max-w-xl max-w-80 p-8 lg:p-16 mx-auto rounded-3xl"
        >
          <Typography variant="h5" component="h4" className="text-white text-center pb-4">
            <div className="flex items-center justify-center">
              <GiExpense className="mr-2" />
              <span>Expense Tracker</span>
            </div>
          </Typography>
          <Typography variant="body1" component="p" className="text-white">
            Manage your finances with ease using our comprehensive Expense Tracker. Record, categorize, and analyze 
            all your expenses in one place, and stay on top of your financial health effortlessly.
          </Typography>
          <Image src="/assets/ExpenseTracker.png" alt="Logo" width={350} height={350} className="py-8 mx-auto"/>
          <div className="flex justify-center">
            <Button variant="contained" color="primary" href="/profile" className="normal-case">
              Expenses
            </Button>
          </div>
        </motion.div>

        {/* Complaint Recognition */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="bg-blue-950 lg:max-w-xl max-w-80 p-8 lg:p-16 mx-auto rounded-3xl"
        >
          <Typography variant="h5" component="h4" className="text-white text-center pb-4">
            <div className="flex items-center justify-center">
              <RiRobot3Fill className="mr-2"/>
              <span>Complaint Recognition</span>
            </div>
          </Typography>
          <Typography variant="body1" component="p" className="text-white">
            Enhance customer satisfaction with our AI-powered Complaint Recognition system. Automatically detect, 
            categorize, and respond to customer complaints, ensuring a seamless resolution process.
          </Typography>
          <Image src="/assets/ComplaintRecognition.png" alt="Logo" width={350} height={350} className="py-8 mx-auto"/>
          <div className="flex justify-center">
            <Button variant="contained" color="primary" href="/recognition" className="normal-case">
              Complaint Recognition
            </Button>
          </div>
        </motion.div>
      </div>


      {/* Contact Section */}
      <Container id="contact" maxWidth="md" className="contact-section">
        <Typography variant="h4" component="h3" gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="body1" component="p">
          Have questions? Reach out to us at 
          <Link href="mailto:support@speechsense.com" color="primary"> support@speechsense.com</Link>
        </Typography>
      </Container>

      {/* Footer */}
      <footer className="footer">
        <Typography variant="body2" color="textSecondary" align="center">
          &copy; 2024 Saphire. All rights reserved.
        </Typography>
      </footer>
    </div>
  );
};

export default LandingPage;
