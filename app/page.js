'use client'
import CallButtons from './components/CallButtons';

export default function Home() {
  return (
    <div>
      <h1>Call Classification</h1>
      <CallButtons />  {/* No need to pass calls here */}
    </div>
  );
}