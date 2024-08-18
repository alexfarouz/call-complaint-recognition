import React, { useState } from 'react';
import './Transaction.css';  // Import the CSS file
import { Container, Row, Col, Card, Button, Navbar, Nav } from 'react-bootstrap';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

const ExpenseTracker = () => {
  const [transactions, setTransactions] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income');
  const [where, setWhere] = useState('');

  const totalBalance = transactions.reduce((acc, transaction) =>
    transaction.type === 'income' ? acc + transaction.amount : acc - transaction.amount, 0);

  const totalIncome = transactions
    .filter(transaction => transaction.type === 'income')
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const totalExpenses = transactions
    .filter(transaction => transaction.type === 'expense')
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const handleAddTransaction = () => {
    const newTransaction = {
      id: transactions.length + 1,
      amount: parseFloat(amount),
      type,
      where,
    };
    setTransactions([...transactions, newTransaction]);
    setIsAdding(false);
    setAmount('');
    setWhere('');
  };

  return (
    <div className="transaction">
      {/* Navigation Bar */}
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

      {/* Main Content */}
      
        <div className="balance-container">
          <h2>Total Balance: ${totalBalance.toFixed(2)}</h2>
          <p>Income: <span className="income">${totalIncome.toFixed(2)}</span></p>
          <p>Expenses: <span className="expenses">${totalExpenses.toFixed(2)}</span></p>
        </div>

        <div className="transactions-container" id="transactions">
            <div className="transactions-header">
                <h3>Transactions</h3>
                <button 
                className="add-transaction-button" 
                onClick={() => setIsAdding(true)}
                >
                + Add Transaction
                </button>
            </div>
            <ul className="transactions-list">
                {transactions.map(transaction => (
                <li key={transaction.id} className="transaction-item">
                    <span className={transaction.type === 'income' ? 'transaction-income' : 'transaction-expense'}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </span> - {transaction.where}
                </li>
                ))}
            </ul>
        </div>


        {isAdding && (
          <div className="modal-overlay">
            <div className="modal-container">
              <h4>Add New Transaction</h4>
              <input 
                type="number" 
                value={amount} 
                onChange={e => setAmount(e.target.value)} 
                placeholder="Amount" 
                className="modal-input" 
              />
              <input 
                type="text" 
                value={where} 
                onChange={e => setWhere(e.target.value)} 
                placeholder="Where" 
                className="modal-input" 
              />
              <div style={{ marginBottom: '10px' }}>
                <label className="modal-radio-label">
                  <input 
                    type="radio" 
                    value="income" 
                    checked={type === 'income'} 
                    onChange={() => setType('income')} 
                    className="modal-radio-input" 
                  /> Income
                </label>
                <label>
                  <input 
                    type="radio" 
                    value="expense" 
                    checked={type === 'expense'} 
                    onChange={() => setType('expense')} 
                    className="modal-radio-input" 
                  /> Expense
                </label>
              </div>
              <button 
                className="modal-add-button" 
                onClick={handleAddTransaction}
              >
                Add Transaction
              </button>
              <button 
                className="modal-cancel-button" 
                onClick={() => setIsAdding(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
  );
};

export default ExpenseTracker;
