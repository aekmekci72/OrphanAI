import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaUser, FaSearch, FaHome, FaInfoCircle, FaHistory, FaChartLine, FaList, FaQuestion } from 'react-icons/fa';
import Modal from 'react-modal';

const SidebarButton = ({ to, icon, text }) => (
  <Link to={to} className="flex items-center mb-4 text-black-resonate hover:text-beige-resonate">
    <span className="mr-2">{icon}</span>
    <span>{text}</span>
  </Link>
);

const Results = () => {
  // State for disease matches
  const [diseaseMatches, setDiseaseMatches] = useState([]);
  const [selectedDisease, setSelectedDisease] = useState(null);  // State to track the selected disease
  const [modalIsOpen, setModalIsOpen] = useState(false);  // State to control the modal visibility
  const [symptoms, setSymptoms] = useState([]);

  // Fetch disease data on component mount
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');

    axios
      .post('http://localhost:5000/calculatepercentagematch', {
        username: storedUsername,
      })
      .then((response) => {
        const diseaseMatchResults = response.data.diseaseMatchResults;

        if (diseaseMatchResults && typeof diseaseMatchResults === 'object') {
          const sortedDiseaseMatches = Object.entries(diseaseMatchResults)
            .map(([disease, percent]) => ({ disease, percent }))
            .sort((a, b) => b.percent - a.percent)
            .slice(0, 5);
          setDiseaseMatches(sortedDiseaseMatches);
        } else {
          console.error('Invalid disease match data format in the response');
        }
      })
      .catch((error) => {
        console.error('Error fetching disease match data:', error);
      });
  }, []);

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
          <h1 className="text-9xl text-grey-resonate">Results</h1>
        </div>

        {/* Disease List */}
        <ul>
          {diseaseMatches.map((diseaseMatch, index) => (
            <li key={index} className="mb-2">
              <div className="flex justify-between mb-1">
                <span className="text-base font-medium text-blue-700 dark:text-black">{`${diseaseMatch.Disease}`}</span>
                <span className="text-sm font-medium text-blue-700 dark:text-black">{`${diseaseMatch.Probability.toFixed(2)}%`}</span>
              </div>
              <div className="w-full h-4 mb-4 bg-gray-300 rounded-full dark:bg-light-gray-700">
                <div className="bg-green-600 h-4 rounded-full" style={{ width: `${diseaseMatch.Probability}%` }} ></div>
              </div>
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
};

export default Results;