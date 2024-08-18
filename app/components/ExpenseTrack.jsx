// ExpenseTrack.js

import React from 'react';
import { Container, Row, Col, Card, Button, Navbar, Nav } from 'react-bootstrap';
import { Box } from '@mui/system';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ExpenseTrack.css'; // Import custom CSS for styling

const ExpenseTrack = () => {
  return (
    <div className="expense-track">
      <Navbar bg="transparent" expand="lg" className="navbar-custom">
        <Container>
          <Navbar.Brand href="/expense">ExpenseTracker</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <header className="hero-section text-center text-white">
        <Container>
          <Row>
            <Col>
              <h1>Welcome to ExpenseTrack</h1>
              <p>Your ultimate solution for managing personal finances effortlessly.</p>
              <Button variant="light" className="mt-3" href='/profile'>Get Started</Button>
            </Col>
          </Row>
        </Container>
      </header>
      <section className="features-section py-5">
        <Container>
          <Row>
            <Col md={4}>
              <Card className="feature-card text-center">
                <Card.Body>
                  <h3>Track Your Expenses</h3>
                  <p>Get a detailed overview of your spending habits and budget effectively.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="feature-card text-center">
                <Card.Body>
                  <h3>Visualize Your Spending</h3>
                  <p>Use charts and graphs to see where your money is going.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="feature-card text-center">
                <Card.Body>
                  <h3>Set Budgets</h3>
                  <p>Create and manage budgets to ensure you stay on track with your financial goals.</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
      <footer className="footer-section text-center py-3">
        <Container>
          <p>&copy; 2024 ExpenseTrack. All rights reserved.</p>
        </Container>
      </footer>
    </div>
  );
};

export default ExpenseTrack;
