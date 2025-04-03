import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaUser, FaSearch,FaHome, FaInfoCircle, FaHistory, FaNotesMedical, FaChartLine, FaList, FaQuestion } from 'react-icons/fa';

const SidebarButton = ({ to, icon, text }) => (
  <Link to={to} className="flex items-center mb-4 text-black-resonate hover:text-beige-resonate">
    <span className="mr-2">{icon}</span>
    <span>{text}</span>
  </Link>
);

const About = () => {
  
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

      {/* Main Content */}
      <div className="bg-white-resonate min-h-screen w-5/6 p-10">
        <div className="flex items-center justify-center mt-5">
          <h1 className=" text-9xl text-grey-resonate">About</h1>
        </div>
        <div className="mt-5 text-black-resonate">
          <h2 style={{ fontWeight: 'bold', fontSize: '1.1em' }}>Anna Ekmekci - anna.ekmekci@gmail.com</h2>
          <br></br>
          <h2 style={{ fontSize: '1.0em' }}>Data collected from NORD and Orphanet databases</h2>
          <br></br>
          <p>Abstract: It is often difficult for individuals to adopt proactive health monitoring due to uncertainties surrounding the development of orphan diseases. These are characterized by both rarity and difficulty to diagnose, which poses a predicament as individuals may be unaware of how susceptible they are to develop them. This task becomes especially daunting in the context of how multifactorial aspects such as genetics, subtle symptoms, and other risk factors contribute to the likelihood of having an orphan disease. Health Buddy tracks and interprets risk factors in the lives of users to calculate the likelihood of the development of these diseases in one’s future through the use of data analysis. It seeks to aid individuals in determining how their medical realities can affect what diseases they may develop and aims to address the unique difficulties when it comes to even figuring out what diseases to look out for in one’s future. This research project is a React application that utilizes a SQL database and complex algorithms to make such predictions. The software dynamically updates itself to keep the information up-to-date and relevant to the user. I tested various algorithms regarding the interpretation of data inputted by users and finally settled upon one that uses a weighted approach. In the future, I will implement AI and regression models to analyze the data to give the user more sophisticated information regarding their condition. I will also work on integrating the software with wearables and health devices to gather more real-time health data. 
</p>
          {}
        </div>
        {}
      </div>
    </div>
  );
};

export default About;
