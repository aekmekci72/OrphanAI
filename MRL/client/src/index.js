import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Switch, Redirect } from 'react-router-dom';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import WelcomePage from './WelcomePage';
import MatchResults from './MatchResults';
import Signup from './Signup';
import Login from './Login';
import HomePage from './Home';
import Profile from './ProfilePage';
import UserInformation from './UserInformation';
import FamilyHistory from './Family';
import MedicalHistory from './Medical';
import SymptomTracker from './Symptoms';
import PredictionResults from './PredictionResults';
import About from './About';
import Lookup from './Lookup';
import RiskFactors from './RiskFactors';
import ClinicalTrials from './ClinicalTrials';
import Locations from './Locations';
import DiseaseLookup from './DiseaseLookup'


ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/userinformation" element={<UserInformation />} />
        <Route path="/familyhistory" element={<FamilyHistory />} />
        <Route path="/medicalhistory" element={<MedicalHistory />} />
        <Route path="/symptomtracker" element={<SymptomTracker />} />
        <Route path="/results" element={<PredictionResults />} />
        <Route path="/about" element={<About />} />
        <Route path="/lookup" element={<Lookup />} />
        <Route path="/matchresults" element={<MatchResults />} />
        <Route path="/clinicaltrials" element={<ClinicalTrials />} />
        <Route path="/riskfactors" element={<RiskFactors />} />        
        <Route path="/diseaselookup" element={<DiseaseLookup />} />
        <Route path="/locations" element={<Locations />} />
        
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
