import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Grid, Paper, IconButton, Link } from '@mui/material';
import { Security, Speed, IntegrationInstructions, Email } from '@mui/icons-material';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <AppBar position="static" className="hero-section">
        <Toolbar>
          <Typography variant="h5" className="logo" component="div" sx={{ flexGrow: 1 }}>
            SpeechSense
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" className="hero-content">
        <Typography variant="h3" component="h2" gutterBottom>
          Transform Your Voice into Insightful Feedback
        </Typography>
        <Button variant="contained" color="primary" size="large" href='/dashboard'>
          Get Started
        </Button>
      </Container>

      {/* About Section */}
      <Container id="about" maxWidth="md" className="about-section">
        <Typography variant="h4" component="h3" gutterBottom>
          About SpeechSense
        </Typography>
        <Typography variant="body1" component="p">
          SpeechSense is an advanced AI tool designed to analyze and summarize speech input, 
          detecting whether it contains complaints and providing a concise summary of the content. 
          Our technology makes it easier for businesses to understand customer feedback and gain 
          valuable insights with just a click.
        </Typography>
      </Container>

      {/* Features Section */}
      <Container id="features" maxWidth="md" className="features-section">
        <Typography variant="h4" component="h3" gutterBottom>
          Features
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Paper elevation={3} className="feature">
              <IconButton aria-label="real-time-analysis">
                <Speed fontSize="large" color="primary" />
              </IconButton>
              <Typography variant="h6" gutterBottom>Real-Time Analysis</Typography>
              <Typography variant="body2">Instant feedback and summary on whether the input is a complaint or not.</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper elevation={3} className="feature">
              <IconButton aria-label="easy-integration">
                <IntegrationInstructions fontSize="large" color="primary" />
              </IconButton>
              <Typography variant="h6" gutterBottom>Easy Integration</Typography>
              <Typography variant="body2">Seamlessly integrate our tool into your existing system.</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper elevation={3} className="feature">
              <IconButton aria-label="secure-private">
                <Security fontSize="large" color="primary" />
              </IconButton>
              <Typography variant="h6" gutterBottom>Secure & Private</Typography>
              <Typography variant="body2">Your data is encrypted and processed securely.</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

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
          &copy; 2024 SpeechSense. All rights reserved.
        </Typography>
      </footer>
    </div>
  );
};

export default LandingPage;
