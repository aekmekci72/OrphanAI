import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

const HomePage = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const email = localStorage.getItem('email');
      if (!email) {
        setError('No email found in local storage');
        setIsLoaded(true);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/profile?email=${email}`);
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setProfile(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoaded(true);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <Navbar />
      <div className="flex-1 p-10 ml-64">
        {!isLoaded ? (
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-slate-200 h-10 w-10"></div>
            <div className="flex-1 space-y-6 py-1">
              <div className="h-2 bg-slate-200 rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                  <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                </div>
                <div className="h-2 bg-slate-200 rounded"></div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
            <p>{error}</p>
          </div>
        ) : (
          profile && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Welcome, {profile.first_name} {profile.last_name}
              </h1>
              <div className="bg-blue-50 rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">About</h2>
                <p className="text-gray-700 leading-relaxed">
                OrphanAI is your advanced, AI-powered health companion designed to revolutionize the way we approach orphan diseases. By leveraging cutting-edge artificial intelligence, we provide personalized insights into your potential risk factors and connect you with relevant clinical trials.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                Our sophisticated AI analyzes your unique profile, including:
                </p>
                <ul className="list-disc list-inside text-gray-700 mt-2 mb-4">
                <li>Basic medical information</li>
                <li>Current symptoms</li>
                <li>Family health history</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
              Using this comprehensive data, OrphanAI calculates your likelihood of developing specific orphan diseases and identifies clinical trials that match your profile. This proactive approach empowers you to take control of your health journey and potentially access groundbreaking treatments.
              </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                To begin your personalized health assessment, navigate through the sidebar menu to input your information. OrphanAI will then provide you with tailored insights and recommendations, putting the power of AI-driven healthcare in your hands.
                </p>
              </div>
              <div className="flex space-x-4">
                <Link
                  to="/profile"
                  className="group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-blue-600 transition duration-300 ease-out border-2 border-blue-600 rounded-full shadow-md"
                >
                  <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-blue-600 group-hover:translate-x-0 ease">
                    View Profile
                  </span>
                  <span className="absolute flex items-center justify-center w-full h-full text-blue-600 transition-all duration-300 transform group-hover:translate-x-full ease">View Profile</span>
                  <span className="relative invisible">View Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-red-600 transition duration-300 ease-out border-2 border-red-600 rounded-full shadow-md"
                >
                  <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-red-600 group-hover:translate-x-0 ease">
                    Logout
                  </span>
                  <span className="absolute flex items-center justify-center w-full h-full text-red-600 transition-all duration-300 transform group-hover:translate-x-full ease">Logout</span>
                  <span className="relative invisible">Logout</span>
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default HomePage;