import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import InfoModal from './InfoModal';
import { FixedSizeList as List } from 'react-window';

const DiseaseSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [diseases, setDiseases] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDisease, setSelectedDisease] = useState('');

  useEffect(() => {
    fetchDiseases();
  }, []);

  const fetchDiseases = async () => {
    try {
      const response = await axios.get('http://localhost:5000/get_all_diseases');
      const sortedDiseases = (response.data.diseases || []).sort((a, b) =>
        a.localeCompare(b)
      );
      setDiseases(sortedDiseases);
    } catch (error) {
      console.error('Error fetching diseases:', error);
    }
  };

  const filteredDiseases = useMemo(() => {
    return diseases.filter((disease) =>
      disease.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [diseases, searchTerm]);

  const openModal = (disease) => {
    setSelectedDisease(disease);
    setIsModalOpen(true);
  };

  const Row = ({ index, style }) => (
    <div
      style={style}
      className="flex items-center justify-between p-2 border-b border-gray-200 cursor-pointer hover:bg-blue-100"
    >
      <span className="text-xl font-medium text-gray-700">{filteredDiseases[index]}</span>
      
      <button
              onClick={() => openModal(filteredDiseases[index])}
              className="ml-auto px-4 py-2 text-sm group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-blue-600 transition duration-300 border-2 ease-out border-2 border-blue-600 rounded-full shadow-md"
            >
              <span className="absolute inset-0 flex items-center justify-center h-full text-white duration-300 -translate-x-full bg-blue-600 group-hover:translate-x-0 ease">
                Learn More
              </span>
              <span className="absolute flex items-center justify-center  h-full text-blue-600 transition-all duration-300 transform group-hover:translate-x-full ease">Learn More</span>
              <span className="relative invisible">Learn More</span>
            </button>
     
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <Navbar />
      <div className="flex-1 p-10 ml-64">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">Disease Lookup</h1>
          <div className="space-y-4 mb-8">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search diseases..."
              className="w-full p-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            />
          </div>
          <div className="border border-gray-300 rounded-md h-96">
            <List
              height={384}
              itemCount={filteredDiseases.length}
              itemSize={50}
              width="100%"
            >
              {Row}
            </List>
          </div>
        </div>
      </div>
      <InfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        diseaseName={selectedDisease}
      />
    </div>
  );
};

export default DiseaseSearch;
