// ExpenseTrackerHomePage.js

import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement } from 'chart.js';
import { IoIosArrowRoundBack } from 'react-icons/io';

ChartJS.register(LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement);

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
  datasets: [
    {
      label: 'Monthly Expenses',
      data: [150, 200, 180, 220, 190, 210],
      fill: false,
      borderColor: '#007bff',
      tension: 0.1
    }
  ]
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: function (tooltipItem) {
          return `$${tooltipItem.raw}`;
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      }
    },
    y: {
      grid: {
        borderColor: '#e9ecef'
      },
      ticks: {
        callback: function (value) {
          return `$${value}`;
        }
      }
    }
  }
};

const ExpenseTrackerHomePage = () => {
  return (
    <div className="expense-tracker-homepage">
      <header className="bg-primary text-white text-center py-4">
      <a href="/expense" className="back-button">
        <IoIosArrowRoundBack size={30} color='white'/>
      </a>
        <h1>Dashboard</h1>
      </header>
      <Container className="my-4">
        <Row>
          <Col md={8}>
            <Card className="shadow-sm">
              <Card.Body>
                <h3 className="mb-4">Monthly Expenses</h3>
                <Line data={data} options={options} />
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="shadow-sm">
              <Card.Body>
                <h3 className="mb-4">Quick Actions</h3>
                <Button variant="primary" className="mb-3 w-100">Add Expense</Button>
                <Button variant="secondary" className="w-100">View Reports</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <footer className="bg-light text-center py-3">
        <p>&copy; 2024 Expense Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ExpenseTrackerHomePage;
