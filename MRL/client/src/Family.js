import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { FixedSizeList as List } from 'react-window';
import Navbar from './Navbar';

const FamilyHistory = () => {
  const [selectedDisease, setSelectedDisease] = useState('');
  const [selectedGeneration, setSelectedGeneration] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [userFamilyHistory, setUserFamilyHistory] = useState([]);
  const [availableDiseases, setAvailableDiseases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const generationOptions = Array.from({ length: 10 }, (_, i) => ({ 
    value: i + 1, 
    label: `${i + 1} Generation${i === 0 ? '' : 's'} Back` 
  }));

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    fetchUserFamilyHistory();
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
      className={`p-2 cursor-pointer hover:bg-blue-100 ${selectedDisease === filteredDiseases[index] ? 'bg-blue-200' : ''}`}
      onClick={() => setSelectedDisease(filteredDiseases[index])}
    >
      {filteredDiseases[index]}
    </div>
  );

  const fetchUserFamilyHistory = async () => {
    try {
      const email = localStorage.getItem('email');
      const response = await axios.get('http://localhost:5000/get_family_history', {
        params: { email }
      });
      setUserFamilyHistory(response.data.family_history || []);
    } catch (error) {
      console.error('Error fetching family history:', error);
    }
  };

  const handleAddFamilyHistory = async () => {
    if (selectedDisease && selectedGeneration && selectedGender) {
      try {
        const email = localStorage.getItem('email');
        const newFamilyHistory = [
          ...userFamilyHistory, 
          { 
            disease: selectedDisease, 
            generation: parseInt(selectedGeneration),
            gender: selectedGender
          }
        ];
        
        await axios.post('http://localhost:5000/update_family_history', {
          email,
          family_history: newFamilyHistory
        });

        setUserFamilyHistory(newFamilyHistory);
        setSelectedDisease('');
        setSelectedGeneration('');
        setSelectedGender('');
        setSearchTerm('');
      } catch (error) {
        console.error('Error adding family history:', error);
      }
    }
  };

  const handleDeleteFamilyHistory = async (indexToDelete) => {
    try {
      const email = localStorage.getItem('email');
      const updatedFamilyHistory = userFamilyHistory.filter((_, index) => index !== indexToDelete);
      
      await axios.post('http://localhost:5000/update_family_history', {
        email,
        family_history: updatedFamilyHistory
      });

      setUserFamilyHistory(updatedFamilyHistory);
    } catch (error) {
      console.error('Error deleting family history:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <Navbar />
      <div className="flex-1 p-10 ml-64">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">Family History</h1>
          <div className="mb-8 space-y-4">
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
                Selected disease: <span className="font-bold">{selectedDisease || 'None'}</span>
              </div>
            </div>
            <select
              value={selectedGeneration}
              onChange={(e) => setSelectedGeneration(e.target.value)}
              className="w-full p-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Generation</option>
              {generationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="w-full p-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Gender</option>
              {genderOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              onClick={handleAddFamilyHistory}
              className="group relative inline-flex w-full items-center justify-center px-6 py-3 overflow-hidden font-medium text-blue-600 transition duration-300 ease-out border-2 border-blue-600 rounded-full shadow-md"
            >
              <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-blue-600 group-hover:translate-x-0 ease">
                Add Family History
              </span>
              <span className="absolute flex items-center justify-center w-full h-full text-blue-600 transition-all duration-300 transform group-hover:translate-x-full ease">Add Family History</span>
              <span className="relative invisible">Add Family History</span>
            </button>
          </div>
          <div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Your Family History</h2>
            <ul className="space-y-3">
              {userFamilyHistory.map((item, index) => (
                <li key={index} className="flex justify-between items-center bg-gray-100 p-4 rounded-md text-lg">
                  <span>{item.disease} - {item.generation} Generation{item.generation > 1 ? 's' : ''} Back - {item.gender}</span>
                  <button
                    onClick={() => handleDeleteFamilyHistory(index)}
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

export default FamilyHistory;