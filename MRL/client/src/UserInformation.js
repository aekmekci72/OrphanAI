import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import bg_profile2 from './assets/bg_profile2.png';
// import profileheading from './assets/profileheading.png';
import profilePictures from './profilePictures/profilePictures'; // Import the profilePictures object
import { FaUser, FaSearch, FaHome, FaInfoCircle, FaHistory, FaNotesMedical, FaChartLine, FaList, FaQuestion } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const SidebarButton = ({ to, icon, text }) => (
  <Link to={to} className="flex items-center mb-4 text-black-resonate hover:text-beige-resonate">
    <span className="mr-2">{icon}</span>
    <span>{text}</span>
  </Link>
);
const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [newValue, setNewValue] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    // Get the username from localStorage
    const storedUsername = localStorage.getItem('username');

    // Fetch user profile based on the username
    axios.post('http://localhost:5000/userinfo', { username: storedUsername })
      .then(response => {
        setUserProfile(response.data.user);
      })
      .catch(error => {
        console.error('Error fetching user profile:', error);
      });
  }, []);

  const handleEdit = (field) => {
    setEditingField(field);
    setNewValue('');
    setShowModal(true);
    setIsEditing(true);
  };

  const handleSubmitEdit = () => {
    if (!newValue) {
      return;
    }

    const endpoint = `/edit${editingField}`;
    const data = {
      username: userProfile.username,
      newValue
    };

    axios.post(`http://localhost:5000${endpoint}`, data)
      .then(response => {
        // Update user profile after successful edit
        setUserProfile(prevUserProfile => ({
          ...prevUserProfile,
          [editingField]: newValue
        }));

        // Close the modal and deactivate editing mode
        setShowModal(false);
        setIsEditing(false);
      })
      .catch(error => {
        console.error('Error editing field:', error);
      });
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
      <div className="bg-white-resonate min-h-screen w-5/6 p-10">

    
    <div className="bg-white-resonate min-h-screen flex flex-col items-center relative">
      <div className="flex items-center justify-center mt-5">
          <h1 className=" text-9xl text-grey-resonate">General</h1>
        </div>
      
      <div className="flex items-center flex-col mt-[5%]">
            {}
            {}
        
            
            {userProfile && (
  <div className='mt-[-17%] flex flex-col items-center'>
    {/* Display user information */}
    {Object.keys(userProfile).map((field) => {
      // Define a mapping for specific fields
      const fieldMappings = {
        name_first: 'First name',
        name_last: 'Last name',
        // Add more mappings for other fields if needed
      };

      const displayField = fieldMappings[field] || field; // Use the mapped value or the field itself
      
      return (
        <div
          key={field}
          className="flex items-center space-x-4 mt-2 overflow-x-hidden justify-center"
          style={{ overflowWrap: 'break-word' }}
        >
          {isEditing && editingField === field ? (
            <>
              <input
                type="text"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
              />
              <button
            onClick={handleSubmitEdit}
            className="bg-beige-resonate text-white px-2 py-1 rounded hover:bg-[#C2899E] transition-colors"
          >
            Submit
          </button>

            </>
          ) : (
            <>
              <label
                htmlFor={field}
                className="transition-colors hover:text-[#C2899E]"
              >
                {displayField.charAt(0).toUpperCase() + displayField.slice(1)}: {userProfile[field]}{' '}
                <button
              onClick={() => handleEdit(field)}
              className="bg-beige-resonate text-white px-2 py-1 rounded hover:bg-[#C2899E] transition-colors"
            >
              Edit
            </button>
              </label>
            </>
          )}
        </div>
      );
    })}
  </div>
)}



          </div>
          </div>
          </div>
          </div>
  );
};

export default Profile;
