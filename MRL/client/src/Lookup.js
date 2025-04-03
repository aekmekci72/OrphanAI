import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaUser, FaSearch, FaHome, FaInfoCircle, FaHistory, FaChartLine, FaList, FaQuestion } from 'react-icons/fa';
import Modal from './Modal'; 

const SidebarButton = ({ to, icon, text }) => (
  <Link to={to} className="flex items-center mb-4 text-black-resonate hover:text-beige-resonate">
    <span className="mr-2">{icon}</span>
    <span>{text}</span>
  </Link>
);

const Results = () => {
  // State for disease matches
  const [diseaseInfo, setDiseaseInfo] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  // Fetch disease data on component mount
  useEffect(() => {
    axios
      .get('http://localhost:5000/getdiseaseinfo')
      .then((response) => {
        const diseaseInfo = response.data.user;
        if (diseaseInfo && typeof diseaseInfo === 'object') {
          setDiseaseInfo(diseaseInfo);
        } else {
          console.error('Invalid disease match data format in the response');
        }
      })
      .catch((error) => {
        console.error('Error fetching disease match data:', error);
      });
  }, []);

  const openModal = (diseaseName) => {
    setSelectedDisease(diseaseName);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDisease(null);
  };


  return (
    <div className="flex">
      
      {/* Sidebar/Navbar */}
      <div className="bg-yellow-resonate w-1/6 p-6">
      <div className="mb-4 text-black text-2xl font-bold">
          Health Buddy
        </div>
        <SidebarButton to="/homepage" icon={<FaHome />} text="Home" />
        <SidebarButton to="/profile" icon={<FaUser />} text="Profile" />
        <SidebarButton to="/userinformation" icon={<FaInfoCircle />} text="General Info" />
        <SidebarButton to="/familyhistory" icon={<FaHistory />} text="Family History" />
        <SidebarButton to="/symptomtracker" icon={<FaChartLine />} text="Symptom Tracker" />
        <SidebarButton to="/results" icon={<FaList />} text="Results" />
        <SidebarButton to="/lookup" icon={<FaSearch />} text="Lookup" />

        <SidebarButton to="/about" icon={<FaQuestion />} text="About" />
      </div>
      <div className="bg-white-resonate min-h-screen w-5/6 p-10 flex flex-col items-center ">
        <div className="flex items-center justify-center mt-5">
          <h1 className="text-9xl text-grey-resonate">Lookup</h1>
          
        </div>
    <br></br>
        <input
          type="text"
          placeholder="Search for diseases..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="my-4 p-2 border rounded-md"
        />


          <ul>
            {diseaseInfo
              .filter((disease) => disease.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((disease, index) => (
                <li key={index} className="mb-2">
                  <div className="flex justify-between mb-1">
                    <span className="text-base font-medium text-blue-700 dark:text-black">{`${disease.name}`}</span>
                    <button onClick={() => openModal(disease.name)}             className="bg-beige-resonate text-white px-2 py-1 rounded hover:bg-[#C2899E] transition-colors">Details</button>

                  </div>
                </li>
              ))}
          </ul>

      </div>
      <Modal
        isOpen={isModalOpen}
        closeModal={closeModal}
        diseaseName={selectedDisease}
      />
    

    </div>
    
  );
};

export default Results;