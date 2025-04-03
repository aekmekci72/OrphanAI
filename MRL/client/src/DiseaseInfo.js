import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaUser, FaHome, FaInfoCircle, FaHistory, FaNotesMedical, FaChartLine, FaList, FaQuestion } from 'react-icons/fa';

const SidebarButton = ({ to, icon, text }) => (
  <Link to={to} className="flex items-center mb-4 text-black-resonate hover:text-beige-resonate">
    <span className="mr-2">{icon}</span>
    <span>{text}</span>
  </Link>
);

const Results = () => {
  const [diseaseMatches, setDiseaseMatches] = useState([]);
  const storedUsername = localStorage.getItem('username');

  useEffect(() => {
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
            .slice(0,5);
          setDiseaseMatches(sortedDiseaseMatches);
        } else {
          console.error('Invalid disease match data format in the response');
        }
      })
      .catch((error) => {
        console.error('Error fetching disease match data:', error);
      });
  }, [storedUsername]);
  if (!diseaseMatches) {
    return <div>Loading...</div>;
  }
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
        <SidebarButton to="/about" icon={<FaQuestion />} text="About" />
      </div>
      <div className="bg-white-resonate min-h-screen w-5/6 p-10 flex flex-col items-center ">
        <div className="flex items-center justify-center mt-5">
          <h1 className="text-9xl text-grey-resonate">Results</h1>
        </div>

        <div className="bg-white-resonate min-h-screen flex flex-col items-center relative">
          <div className="flex items-center relative mt-0"></div>

          <ul>
            {diseaseMatches.map((diseaseMatch, index) => (
              <li key={index} className="mb-2">
                <div class="flex justify-between mb-1">
                  <span class="text-base font-medium text-blue-700 dark:text-black">{`${diseaseMatch.disease}`}</span>
                  <span class="text-sm font-medium text-blue-700 dark:text-black">{`${diseaseMatch.percent.toFixed(2)}`}%</span>
                </div>
                <div class="w-full h-4 mb-4 bg-gray-300 rounded-full dark:bg-light-gray-700">
                  <div class="bg-green-600 h-4 rounded-full" style={{ width: `${diseaseMatch.percent}%` }} ></div>
                </div>


              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Results;