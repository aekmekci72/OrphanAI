import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import InfoModal from './InfoModal';
const Results = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDisease, setSelectedDisease] = useState('');
  const [isLoading, setIsLoading] = useState(true);


  const [diseaseMatches, setDiseaseMatches] = useState([]);
  const openModal = (disease) => {
    setSelectedDisease(disease);
    setIsModalOpen(true);
  };
  useEffect(() => {
    const fetchDiseaseMatches = async () => {
      try {
        const email = localStorage.getItem('email');

        const storedUsername = localStorage.getItem('username');
        const r = await fetch(`http://localhost:5000/profile?email=${email}`);
        if (!r.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await r.json();
        const age = data.age;
        const sex = data.sex;
        const response = await axios.post('http://localhost:5000/predict', 
          { username:  localStorage.getItem('email'),
            age: age,
            sex: sex
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        const predictionData = response.data.prediction;
        if (Array.isArray(predictionData)) {
          const sortedDiseaseMatches = predictionData
            .map(item => ({ 
              disease: item.Disease, 
              percent: item.Probability * 100 // Convert to percentage
            }))
            .sort((a, b) => b.percent - a.percent)
            .slice(0, 5);
          setDiseaseMatches(sortedDiseaseMatches);
        } else {
          console.error('Invalid prediction data format in the response');
        }
      } catch (error) {
        console.error('Error fetching disease match data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiseaseMatches();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <Navbar />
      <div className="flex-1 p-10 ml-64">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-screen">
            <div className="flex flex-col items-center">
              <div className="loader animate-spin rounded-full border-t-4 border-blue-600 border-solid h-12 w-12"></div>
              <p className="mt-4 text-gray-700 text-lg">Loading results...</p>
            </div>
          </div>
        ) : (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">Results</h1>
          <div className="space-y-6">
            {diseaseMatches.map((diseaseMatch, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-xl font-medium text-gray-700">{diseaseMatch.disease}</span>
                  <span className="text-lg font-medium text-gray-600">{diseaseMatch.percent.toFixed(2)}%</span>
                </div>
                <div className="w-full h-4 bg-gray-200 rounded-full">
                  <div
                    className="h-4 bg-blue-600 rounded-full"
                    style={{ width: `${diseaseMatch.percent}%` }}
                  ></div>
                </div>
                <button onClick={() => openModal(diseaseMatch.disease)}>Learn about {diseaseMatch.disease}</button>
              </div>
            ))}
          </div>
        </div>
        )}
      </div>
      <InfoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        diseaseName={selectedDisease}
      />
    </div>
  );
};

export default Results;