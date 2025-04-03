import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import { FixedSizeList as List } from 'react-window';

const SymptomTrackerPage = () => {
  const [symptoms, setSymptoms] = useState([]);
  const [newSymptom, setNewSymptom] = useState('');
  const [dayFelt, setDayFelt] = useState(new Date().toISOString().split('T')[0]);
  const [intensity, setIntensity] = useState(3);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableSymptoms, setAvailableSymptoms] = useState([]);
  const email = localStorage.getItem('email');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (email) {
      fetchSymptoms();
    }
  }, [email]);
  useEffect(() => {
    fetchAvailableSymptoms();
  }, []);
  
  const fetchAvailableSymptoms = async () => {
    try {
      const response = await fetch('/symptoms.txt');
      const text = await response.text();
      console.log('Raw response:', text); 
      const symptoms = JSON.parse(text);
      setAvailableSymptoms(symptoms);
    } catch (error) {
      console.error('Error fetching available symptoms:', error);
    }
  };
  // const fetchAvailableSymptoms = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:5000/get_all_symptoms');
  //     setAvailableSymptoms(response.data.symptoms || []);
  //   } catch (error) {
  //     console.error('Error fetching available symptoms:', error);
  //   }
  // };

  const sortedSymptoms = useMemo(() => {
    const uniqueSymptoms = [...new Set(availableSymptoms)];
    return uniqueSymptoms.sort((a, b) => a.localeCompare(b));
  }, [availableSymptoms]);

  const filteredSymptoms = useMemo(() => {
    return sortedSymptoms.filter(symptom => 
      symptom.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedSymptoms, searchTerm]);

  const Row = ({ index, style }) => (
    <div 
      style={style}
      className={`p-2 cursor-pointer hover:bg-blue-100 ${newSymptom === filteredSymptoms[index] ? 'bg-blue-200' : ''}`}
      onClick={() => setNewSymptom(filteredSymptoms[index])}
    >
      {filteredSymptoms[index]}
    </div>
  );
  const fetchSymptoms = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/get_symptoms?email=${email}`, {
        // params: { email }
      });
      setSymptoms(response.data.symptoms || []);
    } catch (error) {
      console.error('Error fetching symptoms:', error);
    }
  };

  const handleAddSymptom = () => {
    if (newSymptom && dayFelt) {
      const updatedSymptoms = [...symptoms, { name: newSymptom, day: new Date(dayFelt), intensity }];
      setSymptoms(updatedSymptoms);
      setNewSymptom('');
      setDayFelt(new Date().toISOString().split('T')[0]);
      setIntensity(3);
      updateSymptoms(updatedSymptoms);
    }
  };

  const handleDeleteSymptom = (index) => {
    const updatedSymptoms = symptoms.filter((_, i) => i !== index);
    setSymptoms(updatedSymptoms);
    updateSymptoms(updatedSymptoms);
  };

  const updateSymptoms = async (updatedSymptoms) => {
    try {
      const response = await axios.post(`http://localhost:5000/update_symptoms?email=${email}`, {
        email,
        symptoms: updatedSymptoms
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error updating symptoms:', error);
    }
  };

  const ssortedSymptoms = symptoms.slice().sort((a, b) => new Date(b.day) - new Date(a.day));

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <Navbar />
      <div className="flex-1 p-10 ml-64">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">Symptom Tracker</h1>
          <div className="space-y-4 mb-8">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search symptoms..."
                className="w-full p-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              />
              <div className="border border-gray-300 rounded-md h-48">
                <List
                  height={192}
                  itemCount={filteredSymptoms.length}
                  itemSize={35}
                  width="100%"
                >
                  {Row}
                </List>
              </div>
              <div className="mt-2">
                Selected symptom: <span className="font-bold">{newSymptom || 'None'}</span>
              </div>
            </div>
            <input
              type="date"
              value={dayFelt}
              onChange={(e) => setDayFelt(e.target.value)}
              className="w-full p-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex items-center space-x-4">
              <label htmlFor="intensity-slider" className="text-lg font-medium text-gray-700">Intensity: {intensity}</label>
              <input
                type="range"
                id="intensity-slider"
                min="1"
                max="5"
                value={intensity}
                onChange={(e) => setIntensity(e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <button onClick={toggleModal} className="text-blue-600 hover:text-blue-800">?</button>
            </div>
            <button
              onClick={handleAddSymptom}
              className="group relative inline-flex w-full items-center justify-center px-6 py-3 overflow-hidden font-medium text-blue-600 transition duration-300 ease-out border-2 border-blue-600 rounded-full shadow-md"
            >
              <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-blue-600 group-hover:translate-x-0 ease">
                Add Symptom
              </span>
              <span className="absolute flex items-center justify-center w-full h-full text-blue-600 transition-all duration-300 transform group-hover:translate-x-full ease">Add Symptom</span>
              <span className="relative invisible">Add Symptom</span>
            </button>
          </div>

          <div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Your Symptoms</h2>
            <ul className="space-y-3">
              {ssortedSymptoms.map((symptom, index) => (
                <li key={index} className="flex justify-between items-center bg-gray-100 p-4 rounded-md text-lg">
                  <span>{symptom.name} - {new Date(symptom.day).toISOString().split('T')[0]} - Intensity: {symptom.intensity}</span>
                  <button
                    onClick={() => handleDeleteSymptom(index)}
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
            <h2 className="text-2xl font-bold mb-4">Intensity Levels</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>1 - Mild:</strong> Symptoms are present but do not interfere significantly with daily activities.</li>
              <li><strong>2 - Moderate:</strong> Symptoms are more pronounced and can cause some discomfort.</li>
              <li><strong>3 - Severe:</strong> Symptoms are intense and can interfere with daily activities.</li>
              <li><strong>4 - Very Severe:</strong> Symptoms are debilitating and significantly hinder daily functioning.</li>
              <li><strong>5 - Extreme:</strong> Symptoms are overwhelming and incapacitating, requiring urgent medical attention.</li>
            </ul>
            <button 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
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

export default SymptomTrackerPage;