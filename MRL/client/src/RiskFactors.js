import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import axios from 'axios';

const RiskFactorTrackerPage = () => {
  const [riskFactors, setRiskFactors] = useState([]);
  const [newRiskFactor, setNewRiskFactor] = useState('');
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const email = localStorage.getItem('email');

  useEffect(() => {
    if (email) {
      fetchRiskFactors();
    }
  }, [email]);

  const fetchRiskFactors = async () => {
    try {
      const response = await axios.get('http://localhost:5000/get_risk_factors', {
        params: { email }
      });
      setRiskFactors(response.data.risk_factors || []);
    } catch (error) {
      console.error('Error fetching risk factors:', error);
    }
  };

  const handleAddRiskFactor = () => {
    if (newRiskFactor && startYear && endYear) {
      const updatedRiskFactors = [...riskFactors, { name: newRiskFactor, startYear, endYear }];
      setRiskFactors(updatedRiskFactors);
      setNewRiskFactor('');
      setStartYear('');
      setEndYear('');
      updateRiskFactors(updatedRiskFactors);
    }
  };

  const handleDeleteRiskFactor = (index) => {
    const updatedRiskFactors = riskFactors.filter((_, i) => i !== index);
    setRiskFactors(updatedRiskFactors);
    updateRiskFactors(updatedRiskFactors);
  };

  const updateRiskFactors = async (updatedRiskFactors) => {
    try {
      const response = await axios.post('http://localhost:5000/update_risk_factors', {
        email,
        risk_factors: updatedRiskFactors
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error updating risk factors:', error);
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <Navbar />
      <div className="flex-1 p-10 ml-64">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">Risk Factor Tracker</h1>
          <div className="space-y-4 mb-8">
            <input
              type="text"
              placeholder="Risk Factor Name"
              value={newRiskFactor}
              onChange={(e) => setNewRiskFactor(e.target.value)}
              className="w-full p-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Start Year"
              value={startYear}
              onChange={(e) => setStartYear(e.target.value)}
              className="w-full p-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="End Year"
              value={endYear}
              onChange={(e) => setEndYear(e.target.value)}
              className="w-full p-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddRiskFactor}
              className="group relative inline-flex w-full items-center justify-center px-6 py-3 overflow-hidden font-medium text-blue-600 transition duration-300 ease-out border-2 border-blue-600 rounded-full shadow-md"
            >
              <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-blue-600 group-hover:translate-x-0 ease">
                Add Risk Factor
              </span>
              <span className="absolute flex items-center justify-center w-full h-full text-blue-600 transition-all duration-300 transform group-hover:translate-x-full ease">Add Risk Factor</span>
              <span className="relative invisible">Add Risk Factor</span>
            </button>
          </div>

          <div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Your Risk Factors</h2>
            <ul className="space-y-3">
              {riskFactors.map((factor, index) => (
                <li key={index} className="flex justify-between items-center bg-gray-100 p-4 rounded-md text-lg">
                  <span>{factor.name} - {factor.startYear} to {factor.endYear}</span>
                  <button
                    onClick={() => handleDeleteRiskFactor(index)}
                    className="group relative inline-flex items-center justify-center px-4 py-2 overflow-hidden font-medium text-red-600 transition duration-300 ease-out border-2 border-red-600 rounded-full shadow-md"
                  >
                    <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-red-600 group-hover:translate-x-0 ease">
                      Delete
                    </span>
                    <span className="absolute flex items-center justify-center w-full h-full text-red-600 transition-all duration-300 transform group-hover:translate-x-full ease">Delete</span>
                    <span className="relative invisible">Delete</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" onClick={toggleModal}>
          <div className="bg-white rounded-lg p-6 max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4">Risk Factor Information</h2>
            <p className="mb-4">Track the risk factors and the time frames during which they were present.</p>
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
              onClick={toggleModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskFactorTrackerPage;