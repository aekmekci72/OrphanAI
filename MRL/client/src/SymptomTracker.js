import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker'; // You will need to install this library
import "react-datepicker/dist/react-datepicker.css";
import { Link } from 'react-router-dom';
import { FaUser, FaSearch, FaHome, FaInfoCircle, FaHistory, FaNotesMedical, FaChartLine, FaList, FaQuestion } from 'react-icons/fa';

const SidebarButton = ({ to, icon, text }) => (
  <Link to={to} className="flex items-center mb-4 text-black-resonate hover:text-beige-resonate">
    <span className="mr-2">{icon}</span>
    <span>{text}</span>
  </Link>
);


const SymptomTracker = () => {
  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [userSymptoms, setUserSymptoms] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  useEffect(() => {
    axios.post('http://localhost:5000/getsymptoms')
      .then(response => {
        if (Array.isArray(response.data.user)) {
          console.log(response.data.user);
          setSymptoms(response.data.user);
        } else {
          console.error('Symptoms not found in the response data');
        }
      })
      .catch(error => {
        console.error('Error fetching symptoms:', error);
      });
  }, []);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    axios.post('http://localhost:5000/getusersymptoms', {
      username: storedUsername,
    })
      .then(response => {
        if (Array.isArray(response.data.user)) {
          setUserSymptoms(response.data.user);
        } else {
          console.error('Symptoms history not found in the response data');
        }
      })
      .catch(error => {
        console.error('Error fetching symptoms history:', error);
      });
  }, []);

  const handleDeleteSymptom = (symptomItem) => {
    const storedUsername = localStorage.getItem('username');
    
    console.log(storedUsername, symptomItem.symptom, new Date(symptomItem.date).toISOString().split('T')[0])
    axios.post('http://localhost:5000/deletesymptom', {
      username: storedUsername,
      symptom:symptomItem.symptom,
      date: new Date(symptomItem.date).toISOString().split('T')[0],
    }) 
      .then(response => {
        if (response.data.message === 'Symptom deleted successfully') {
          const updatedUserSymptoms = userSymptoms.filter(item =>
            item.symptom !== symptomItem.symptom || item.date !== symptomItem.date
          );
          setUserSymptoms(updatedUserSymptoms);
        } else {
          console.error('Server response: Symptom not deleted');
        }
      })
      .catch(error => {
        console.error('Error deleting symptom:', error);
      });
  };
  

  const handleAddSymptom = () => {
    if (selectedSymptom && selectedDate) {
      const storedUsername = localStorage.getItem('username');

      axios.post('http://localhost:5000/addsymptom', {
        username: storedUsername,
        symptom: selectedSymptom,
        date: selectedDate,
      })
        .then(response => {
          if (!response.error) {
            const newSymptom = {
              symptom: selectedSymptom,
              date: selectedDate,
            };

            setUserSymptoms([...userSymptoms, newSymptom]);
          } else {
            console.error('Invalid response data from the server');
          }
        })
        .catch(error => {
          console.error('Error adding symptom:', error);
        });
    } else {
      console.error('Please select a symptom and a date for tracking.');
    }
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
            <h1 className=" text-9xl text-grey-resonate">Symptom</h1>
          </div>
          <div className="flex items-center justify-center mt-0">
            <h1 className=" text-9xl text-grey-resonate mx-[-25px]">Tracker</h1>
          </div>
          <div className="flex items-center flex-col mt-[5%]"></div>

      <div>
        <select onChange={(e) => setSelectedSymptom(e.target.value)}>
          <option value="">Select a Symptom</option>
          {symptoms.map((symptom, index) => (
            <option key={index} value={symptom.symtpom}>
              {symptom.symptom}
            </option>
          ))}
        </select>
        <DatePicker
          selected={selectedDate}
          onChange={date => setSelectedDate(date)}
          placeholderText="Select a Date"
        />
<button
            onClick={handleAddSymptom}
            className="bg-beige-resonate text-white px-2 py-1 rounded hover:bg-[#C2899E] transition-colors"
          >
            Add
          </button>      </div>
      <div>
        <br></br>
        <h1 style={{ fontWeight: 'bold', fontSize: '1.5em' }}>Your Symptom History</h1>
        <ul>
        {userSymptoms.map((symptomItem, index) => (
          <li key={index}>
            {`${symptomItem.symptom} - Tracked on ${new Date(symptomItem.date).toLocaleDateString()}`}
            <button
            onClick={() => handleDeleteSymptom(symptomItem)}
            className="bg-beige-resonate text-white px-2 py-1 rounded hover:bg-[#C2899E] transition-colors"
          >
            Delete
          </button>
          </li>
        ))}

        </ul>
      </div>
    </div>
    </div>
    
  );
};

export default SymptomTracker;
