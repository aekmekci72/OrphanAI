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

const MedicalHistory = () => {
  const [diseases, setDiseases] = useState([]);
  const [selectedDisease, setSelectedDisease] = useState('');
  const [year, setSelectedYear] = useState(''); // State to store selected year
  const [userMedicalHistory, setUserMedicalHistory] = useState([]);

  useEffect(() => {
    axios.post('http://localhost:5000/getdiseases')
      .then(response => {
        if (Array.isArray(response.data.user)) {
          setDiseases(response.data.user);
        } else {
          console.error('Diseases not found in the response data');
        }
      })
      .catch(error => {
        console.error('Error fetching:', error);
      });
  }, []);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    axios.post('http://localhost:5000/getusermedicalhistory', {
      username: storedUsername,
    })
      .then(response => {
        if (Array.isArray(response.data.user)) {
          setUserMedicalHistory(response.data.user);
        } else {
          console.error('Medical History not found in the response data');
        }
      })
      .catch(error => {
        console.error('Error fetching:', error);
      });
  }, []);
  
  

  const handleDeleteMedicalHistory = (medicalHistoryItem) => {
    if (medicalHistoryItem.disease && medicalHistoryItem.year) {
      const storedUsername = localStorage.getItem('username');
      axios.post('http://localhost:5000/deletemedicalhistory', {
        username: storedUsername,
        disease: medicalHistoryItem.disease,
        year: medicalHistoryItem.year, 
      })
        .then(response => {
          if (!response.error) {
            const updatedUserMedicalHistory = userMedicalHistory.filter(item =>
              item.disease !== medicalHistoryItem.disease || item.year !== medicalHistoryItem.year
            );
            setUserMedicalHistory(updatedUserMedicalHistory);
          } else {
            console.error('Invalid response data from the server');
          }
        })
        .catch(error => {
          console.error('Error deleting medical history:', error);
        });
    }
  };
  

  const handleAddMedicalHistory = () => {
    if (selectedDisease && year) {
      const storedUsername = localStorage.getItem('username');
  
      console.log('Adding medical history with disease:', selectedDisease, 'and year:', year);
  
      axios.post('http://localhost:5000/addmedicalhistory', {
        username: storedUsername,
        disease: selectedDisease,
        year: year, 
      })
        .then(response => {
          if (!response.error) {
            const newMedicalHistory = {
              disease: selectedDisease,
              year: year, 
            };
  
            setUserMedicalHistory([...userMedicalHistory, newMedicalHistory]);
          } else {
            console.error('Invalid response data from the server');
          }
        })
        .catch(error => {
          console.error('Error adding medical history:', error);
        });
    } else {
      console.error('Please select a disease and a year for diagnosis.');
    }
  };
  

  const yearsList = Array.from({ length: 100 }, (_, i) => (new Date().getFullYear() - i).toString());

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
        <SidebarButton to="/medicalhistory" icon={<FaNotesMedical />} text="Medical History" />
        <SidebarButton to="/symptomtracker" icon={<FaChartLine />} text="Symptom Tracker" />
        <SidebarButton to="/results" icon={<FaList />} text="Results" />
        <SidebarButton to="/about" icon={<FaQuestion />} text="About" />
      </div>
      <div className="bg-white-resonate min-h-screen w-5/6 p-10 flex flex-col items-center ">
          <div className="flex items-center justify-center mt-5">
            <h1 className=" text-9xl text-grey-resonate">Medical</h1>
          </div>
          <div className="flex items-center justify-center mt-0">
            <h1 className=" text-9xl text-grey-resonate mx-[-25px]">History</h1>
          </div>
        <div className="flex items-center flex-col mt-[5%]"></div>
        <div>
          <select onChange={(e) => setSelectedDisease(e.target.value)}>
            <option value="">Select a Disease</option>
            {diseases.map((disease, index) => (
              <option key={index} value={disease.name}>
                {disease.name}
              </option>
            ))}
          </select>
          <select onChange={(e) => setSelectedYear(e.target.value)}>
            <option value="">Select a Year of Diagnosis</option>
            {yearsList.map((year, index) => (
              <option key={index} value={year}>
                {year}
              </option>
            ))}
          </select>
          <button onClick={handleAddMedicalHistory}>Add</button>
        </div>
        <div>
          <h2>Your Medical History</h2>
          <ul>
          {userMedicalHistory.map((medicalHistoryItem, index) => (
            <li key={index}>
              {`${medicalHistoryItem.disease} - Diagnosed in ${medicalHistoryItem.year}`}
              <button onClick={() => handleDeleteMedicalHistory(medicalHistoryItem)}>Delete</button>
            </li>
          ))}

          </ul>
        </div>
      </div>
    </div>
    
  );
};

export default MedicalHistory;
