import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const ClinicalTrials = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nctIds, setNctIds] = useState([]);
  const [locations, setLocations] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSearchResults([]);
    setNctIds([]);
    setCurrentIndex(0);

    try {
      const response = await axios.post('http://localhost:5000/search_clinical_trials', {
        disease: searchTerm.trim(),
        index: 0,
      });

      setNctIds(response.data.ids);
    } catch (error) {
      console.error('Error searching clinical trials:', error);
      setIsLoading(false);
    }
  };

  const geocodeAddress = async (address) => {
    try {
      const GEOCODE_API = process.env.GEOCODE_API;
      const response = await axios.get(`https://geocode.maps.co/search`, {
        params: {
          q: address,
          api_key: GEOCODE_API
        }
      });
  
      if (response.data && response.data.length > 0) {
        return {
          lat: parseFloat(response.data[0].lat),
          lng: parseFloat(response.data[0].lon)
        };
      }
  
      return null;
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  };



  useEffect(() => {
    const geocodeLocations = async () => {
      const extractedLocations = await Promise.all(
        searchResults.map(async (trial, index) => {
          const locations = trial[5].filter(loc => !loc.toLowerCase().includes('recruiting'));
          const geocodedLocations = [];
  
          for (let i = 0; i < locations.length; i += 2) {
            const cityLocation = locations[i];
            const facilityLocation = locations[i + 1] || '';
            const combinedLocation = `${cityLocation} ${facilityLocation}`.trim();
  
            const coords = await geocodeAddress(combinedLocation);
            
            geocodedLocations.push({
              id: `${index}-${i/2}`,
              name: combinedLocation,
              lat: coords ? coords.lat : null,
              lng: coords ? coords.lng : null,
            });
          }
  
          return geocodedLocations;
        })
      );
      
      const flattenedLocations = extractedLocations.flat();
      setLocations(flattenedLocations);
      console.log(flattenedLocations);
    };
  
    if (searchResults.length > 0) {
      geocodeLocations();
    }
  }, [searchResults]);
  useEffect(() => {
    const fetchTrialData = async () => {
      if (nctIds.length > 0 && currentIndex < nctIds.length) {
        try {
          const response = await axios.post('http://localhost:5000/search_clinical_trials', {
            disease: searchTerm.trim(),
            index: currentIndex + 1,
            nct_id: nctIds[currentIndex],
          });

          setSearchResults(prevResults => [...prevResults, response.data.trial]);
          setCurrentIndex(prevIndex => prevIndex + 1);
        } catch (error) {
          console.error('Error fetching trial data:', error);
        }
        if (currentIndex >= nctIds.length - 1) {
          setIsLoading(false);
        }
      } else if (currentIndex >= nctIds.length && nctIds.length > 0) {
        setIsLoading(false);

      }
    };

    if (nctIds.length > 0 && currentIndex < nctIds.length) {
      fetchTrialData();
    }
    
  }, [nctIds, currentIndex, searchTerm]);
  const handleViewLocations = () => {
    navigate('/locations', { state: { locations } });
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <Navbar />
      <div className="flex-1 p-10 ml-64">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">Clinical Trials Search</h1>

          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex items-center border-b-2 border-blue-500 py-2">
              <input
                className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                type="text"
                placeholder="Enter disease name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                className="flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded"
                type="submit"
              >
                Search
              </button>
            </div>
          </form>

          {!isLoading && searchResults.length > 0 && (
            <button
              onClick={handleViewLocations}
              className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              View Locations on Map
            </button>
          )}

          {isLoading && (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-gray-600">Loading... {currentIndex} / {nctIds.length || '?'}</p>
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="space-y-6">
              {searchResults.map((trial, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-bold text-blue-600 mb-4">{trial[0]}</h2>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-700">
                      <strong>Description:</strong> {trial[1]}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Details:</strong> {trial[2]}
                    </p>
                    <div>
                      <strong>Related Links:</strong>
                      <ul className="list-disc list-inside pl-4">
                        {trial[3].map((link, linkIndex) => (
                          <li key={linkIndex} className="text-sm text-blue-500">
                            <a href={link} target="_blank" rel="noopener noreferrer">
                              {link}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <strong>Contact:</strong>
                      <ul className="list-disc list-inside pl-4">
                        {trial[4].map((contact, contactIndex) => (
                          <li key={contactIndex} className="text-sm text-gray-700">
                            {contact}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <strong>Location:</strong>
                      <ul className="list-disc list-inside pl-4">
                        {trial[5].map((location, locationIndex) => (
                          <p key={locationIndex} className="text-sm text-gray-700">
                            {location}
                          </p>
                        ))}
                      </ul>
                    </div>
                    <p className="text-sm text-gray-700">
                      <strong>Eligibility:</strong> {trial[6]}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Age:</strong> {trial[7].join(', ')}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Sex:</strong> {trial[8]}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Accepts Healthy Volunteers:</strong> {trial[9]}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Sampling Method:</strong> {trial[10]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && searchResults.length === 0 && (
            <p className="text-center text-gray-600">No clinical trials found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClinicalTrials;