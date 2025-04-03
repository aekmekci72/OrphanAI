import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import { FixedSizeList as List } from 'react-window';

const MedicalHistoryPage = () => {
  const [diseases, setDiseases] = useState([]);
  const [newDisease, setNewDisease] = useState('');
  const [diagnosisDate, setDiagnosisDate] = useState(new Date().toISOString().split('T')[0]);
  const [availableDiseases, setAvailableDiseases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const email = localStorage.getItem('email');

  useEffect(() => {
    if (email) {
      fetchDiseases();
    }
  }, [email]);

  useEffect(() => {
    fetchAvailableDiseases();
  }, []);

  const fetchAvailableDiseases = async () => {
    try {
      const response = await fetch('./diseases.txt');
      const text = await response.text();
      const diseases = JSON.parse(text);
      setAvailableDiseases(diseases);
    } catch (error) {
      console.error('Error fetching available diseases:', error);
    }
  };

  const sortedUniqueDiseases = useMemo(() => {
    const uniqueDiseases = [...new Set(availableDiseases)];
    return uniqueDiseases.sort((a, b) => a.localeCompare(b));
  }, [availableDiseases]);

  const filteredDiseases = useMemo(() => {
    return sortedUniqueDiseases.filter(disease => 
      disease.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedUniqueDiseases, searchTerm]);

  const Row = ({ index, style }) => (
    <div 
      style={style}
      className={`p-2 cursor-pointer hover:bg-blue-100 ${newDisease === filteredDiseases[index] ? 'bg-blue-200' : ''}`}
      onClick={() => setNewDisease(filteredDiseases[index])}
    >
      {filteredDiseases[index]}
    </div>
  );

  const fetchDiseases = async () => {
    try {
      const response = await axios.get('http://localhost:5000/get_medical_history', {
        params: { email }
      });
      setDiseases(response.data.medical_history || []);
    } catch (error) {
      console.error('Error fetching medical history:', error);
    }
  };

  const handleAddDisease = () => {
    if (newDisease && diagnosisDate) {
      const updatedDiseases = [...diseases, { name: newDisease, date: diagnosisDate }];
      setDiseases(updatedDiseases);
      setNewDisease('');
      setDiagnosisDate(new Date().toISOString().split('T')[0]);
      updateDiseases(updatedDiseases);
    }
  };

  const handleDeleteDisease = (index) => {
    const updatedDiseases = diseases.filter((_, i) => i !== index);
    setDiseases(updatedDiseases);
    updateDiseases(updatedDiseases);
  };

  const updateDiseases = async (updatedDiseases) => {
    try {
      const response = await axios.post('http://localhost:5000/update_medical_history', {
        email,
        medical_history: updatedDiseases
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error updating medical history:', error);
    }
  };

  const sortedDiseases = diseases.slice().sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <Navbar />
      <div className="flex-1 p-10 ml-64">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">Medical History</h1>
          <div className="space-y-4 mb-8">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search diseases..."
                className="w-full p-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              />
              <div className="border border-gray-300 rounded-md h-48">
                <List
                  height={192}
                  itemCount={filteredDiseases.length}
                  itemSize={35}
                  width="100%"
                >
                  {Row}
                </List>
              </div>
              <div className="mt-2">
                Selected disease: <span className="font-bold">{newDisease || 'None'}</span>
              </div>
            </div>
            <input
              type="date"
              value={diagnosisDate}
              onChange={(e) => setDiagnosisDate(e.target.value)}
              className="w-full p-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddDisease}
              className="group relative inline-flex w-full items-center justify-center px-6 py-3 overflow-hidden font-medium text-blue-600 transition duration-300 ease-out border-2 border-blue-600 rounded-full shadow-md"
            >
              <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-blue-600 group-hover:translate-x-0 ease">
                Add Disease
              </span>
              <span className="absolute flex items-center justify-center w-full h-full text-blue-600 transition-all duration-300 transform group-hover:translate-x-full ease">Add Disease</span>
              <span className="relative invisible">Add Disease</span>
            </button>
          </div>

          <div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Your Medical History</h2>
            <ul className="space-y-3">
              {sortedDiseases.map((disease, index) => (
                <li key={index} className="flex justify-between items-center bg-gray-100 p-4 rounded-md text-lg">
                  <span>{disease.name} - {new Date(disease.date).toISOString().split('T')[0]}</span>
                  <button
                    onClick={() => handleDeleteDisease(index)}
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
    </div>
  );
};

export default MedicalHistoryPage;