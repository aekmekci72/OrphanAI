import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUser, FaUsers, FaNotesMedical, FaChartLine, FaExclamationTriangle, FaChartBar, FaSignOutAlt, FaFileMedical, FaSearch, FaClinicMedical, FaHistory } from 'react-icons/fa';

const Navbar = ({ handleLogout }) => {
  const location = useLocation();

  const navItems = [
    { path: '/homepage', name: 'Home', icon: FaHome },
    { path: '/profile', name: 'Profile', icon: FaUser },
    { path: '/familyhistory', name: 'Family History', icon: FaUsers },
    // { path: '/medicalhistory', name: 'Medical History', icon: FaHistory },
    { path: '/symptomtracker', name: 'Symptom Tracker', icon: FaChartLine },
    // { path: '/riskfactors', name: 'Risk Factors', icon: FaExclamationTriangle },
    { path: '/results', name: 'Predictions', icon: FaChartBar },
    { path: '/clinicaltrials', name: 'Clinical Trials', icon: FaClinicMedical },
    { path: '/diseaselookup', name: 'Disease Lookup', icon: FaSearch },

  ];

  return (
    <div className="bg-white h-screen w-64 fixed left-0 top-0 shadow-lg flex flex-col">
      <div className="p-5 flex justify-center">
        <h1 className="text-3xl font-bold text-blue-600 text-center">OrphanAI</h1>
      </div>
      <nav className="flex-grow">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`group relative inline-flex items-center w-full px-4 py-2 overflow-hidden font-medium transition-all duration-300 ease-out ${
                  location.pathname === item.path
                    ? 'text-white bg-blue-600'
                    : 'text-gray-700 hover:text-white'
                }`}
              >
                <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-blue-600 group-hover:translate-x-0 ease">
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </span>
                <span className="absolute flex items-center justify-center w-full h-full transition-all duration-300 transform group-hover:translate-x-full ease">
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </span>
                <span className="relative invisible">
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-5">
        <button
          onClick={handleLogout}
          className="group relative inline-flex items-center justify-center w-full px-4 py-2 overflow-hidden font-medium text-red-600 transition duration-300 ease-out border-2 border-red-600 rounded-full shadow-md"
        >
          <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-red-600 group-hover:translate-x-0 ease">
            <FaSignOutAlt className="w-5 h-5 mr-2" />
            Logout
          </span>
          <span className="absolute flex items-center justify-center w-full h-full text-red-600 transition-all duration-300 transform group-hover:translate-x-full ease">
            <FaSignOutAlt className="w-5 h-5 mr-2" />
            Logout
          </span>
          <span className="relative invisible">
            <FaSignOutAlt className="w-5 h-5 mr-2" />
            Logout
          </span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;