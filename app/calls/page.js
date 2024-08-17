'use client'
import React from 'react';
import CallButtons from '../components/CallButtons';
import { SplitCalls } from '../utils/SplitCalls';

export default async function Home() {
  let calls = [];

  try {
    calls = await SplitCalls();
  } catch (error) {
    console.error('Error loading calls:', error);
  }

  return (
    <div>
      <h1>Call Classification</h1>
      <CallButtons calls={calls} />
    </div>
  );
}
