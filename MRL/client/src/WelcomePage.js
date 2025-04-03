import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaSignInAlt } from 'react-icons/fa';

const Homepage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 animate-fade-in">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-800">
            Orphan<span className="text-blue-600">AI</span>
          </h1>
          <p className="mt-4 text-xl text-gray-600 font-light">
            Your Personalized Proactive Health Monitoring Solution
          </p>
        </header>

        <main className="max-w-3xl mx-auto">
          <p className="text-lg text-gray-700 leading-relaxed mb-8 font-light">
            Welcome to OrphanAI, an advanced platform designed to empower you in the complex landscape of health management. Our state-of-the-art system meticulously tracks and analyzes various risk factors to provide you with comprehensive insights into your health profile, with a particular focus on rare and orphan diseases.
          </p>

          <div className="flex justify-center space-x-6">
            <Link to="/login" className="group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-blue-600 transition duration-300 ease-out border-2 border-blue-600 rounded-full shadow-md hover:bg-blue-600 hover:text-white">
              <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-blue-600 group-hover:translate-x-0 ease">
                <FaSignInAlt className="mr-2" />
                Log In
              </span>
              <span className="absolute flex items-center justify-center w-full h-full text-blue-600 transition-all duration-300 transform group-hover:translate-x-full ease">Log In</span>
              <span className="relative invisible">Log In</span>
            </Link>
            <Link to="/signup" className="group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out border-2 border-indigo-600 rounded-full shadow-md hover:bg-indigo-600 hover:text-white">
              <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-indigo-600 group-hover:translate-x-0 ease">
                <FaUser className="mr-2" />
                Sign Up
              </span>
              <span className="absolute flex items-center justify-center w-full h-full text-indigo-600 transition-all duration-300 transform group-hover:translate-x-full ease">Sign Up</span>
              <span className="relative invisible">Sign Up</span>
            </Link>
          </div>
        </main>

       
      </div>
    </div>
  );
};

export default Homepage;