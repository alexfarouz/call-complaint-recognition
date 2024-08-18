import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';

const ComplaintsDropdown = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = await getToken();
        const response = await fetch('https://saphire-ts4s.onrender.com/api/get-complaints', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch complaints');
        }

        const data = await response.json();
        setComplaints(data);
      } catch (error) {
        console.error('Error fetching complaints:', error);
      }
    };

    fetchComplaints();
  }, [getToken]);

  const handleComplaintSelect = (complaint) => {
    setSelectedComplaint(complaint);
  };

  return (
    <div className="max-w-md mx-auto mt-10 pb-20">
      <label className="block text-white text-2xl mb-3">
        Your Complaints
      </label>
      <select
        onChange={(e) => handleComplaintSelect(complaints.find(c => c.id === parseInt(e.target.value)))}
        className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 
        px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none text-black focus:shadow-outline"
      >
         <option value="">Select a Complaint</option>
        {complaints.map(complaint => (
          <option key={complaint.id} value={complaint.id}>
            {complaint.title}
          </option>
        ))}
      </select>

      {selectedComplaint && (
        <div className="mt-4 p-4 border rounded shadow-lg bg-white text-black">
          <h3 className="text-xl font-semibold">Complaint Details</h3>
          <p><strong>Summary:</strong> {selectedComplaint.summary}</p>
          <p><strong>Issue:</strong> {selectedComplaint.issue}</p>
          <p><strong>Sub-Issue:</strong> {selectedComplaint.subissue}</p>
          <p><strong>Date:</strong> {new Date(selectedComplaint.created_at).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
};

export default ComplaintsDropdown;
