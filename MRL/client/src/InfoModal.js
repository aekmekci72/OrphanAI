import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InfoModal = ({ isOpen, onClose, diseaseName }) => {
  const [diseaseInfo, setDiseaseInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && diseaseName) {
      fetchDiseaseInfo();
    }
  }, [isOpen, diseaseName]);

  const fetchDiseaseInfo = async () => {
    setLoading(true);
    setDiseaseInfo(null);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5000/get_disease_info', {
        params: { disease: diseaseName }
      });
      setDiseaseInfo(response.data);
    } catch (error) {
      setError('Failed to fetch disease information');
    } finally {
      setLoading(false);
    }
  };

  const sortByFrequencyAndAlphabet = (items) => {
    const frequencyOrder = ['Obligate (100%)', 'Very frequent (99-80%)', 'Frequent (79-30%)', 'Occasional (29-5%)', 'Very rare (<4-1%)', 'Excluded (0%)', 'N/A'];
    
    return items.sort((a, b) => {
      const freqA = frequencyOrder.indexOf(a.frequency);
      const freqB = frequencyOrder.indexOf(b.frequency);
      if (freqA !== freqB) return freqA - freqB;
      try{
        return a.disability.localeCompare(b.disability);

      }
      catch(error){
        return a.symptom.localeCompare(b.symptom);

      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-3xl font-bold mb-4">{diseaseName}</h2>
        {loading && <p className="text-gray-600">Loading disease information...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {diseaseInfo && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* <InfoCard 
              title="Functional Consequences" 
              infoText="Functional consequences are limitations or changes in a person's ability to perform daily activities due to the disease."
              showInfo={true}
            >
              {diseaseInfo.functional_consequences && diseaseInfo.functional_consequences.length > 0 ? (
                sortByFrequencyAndAlphabet(diseaseInfo.functional_consequences).map((item, index) => (
                  <InfoItem 
                    key={index}
                    label={item.disability}
                    value={item.frequency}
                  />
                ))
              ) : (
                <p>No functional consequences available.</p>
              )}
            </InfoCard> */}
            <InfoCard 
              title="Symptoms" 
              infoText="Symptoms are physical or mental features which are regarded as indicating a condition of disease, particularly such features that are apparent to the patient."
              showInfo={true}
            >
              {diseaseInfo.symptoms && diseaseInfo.symptoms.length > 0 ? (
                sortByFrequencyAndAlphabet(diseaseInfo.symptoms).map((item, index) => (
                  <InfoItem 
                    key={index}
                    label={item.symptom}
                    value={item.frequency}
                  />
                ))
              ) : (
                <p>No symptoms available.</p>
              )}
            </InfoCard>
            <InfoCard title="Associations">
              {diseaseInfo.associations && diseaseInfo.associations.length > 0 ? (
                diseaseInfo.associations.map((item, index) => (
                  <p key={index} className="mb-2">
                    <span className="font-semibold">{item.target}:</span> {item.type}
                  </p>
                ))
              ) : (
                <p>No associations available.</p>
              )}
            </InfoCard>
            <InfoCard title="Age of Onset and Inheritance">
              <p className="mb-2"><span className="font-semibold">Ages of Onset:</span> {diseaseInfo.ages_of_onset.join(', ') || 'Not specified'}</p>
              <p><span className="font-semibold">Inheritance:</span> {diseaseInfo.inheritance || 'Not specified'}</p>
            </InfoCard>
          </div>
        )}
        <button 
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

const InfoCard = ({ title, children, infoText, showInfo = false }) => {
  const [contentHeight, setContentHeight] = useState('auto');
  const [showInfoText, setShowInfoText] = useState(false);
  const contentRef = React.useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      const height = contentRef.current.scrollHeight;
      setContentHeight(height > 256 ? '16rem' : 'auto');
    }
  }, [children]);

  return (
    <div className={`bg-gray-100 rounded-lg p-4 ${contentHeight === 'auto' ? '' : 'h-64'} overflow-y-auto`}>
      <h3 className="text-xl font-semibold mb-2 flex items-center">
        {title}
        {showInfo && (
          <button
            className="ml-2 text-blue-500 hover:text-blue-700"
            onMouseEnter={() => setShowInfoText(true)}
            onMouseLeave={() => setShowInfoText(false)}
          >
            (i)
          </button>
        )}
      </h3>
      {showInfoText && (
        <div className="bg-white border border-gray-300 p-2 rounded shadow-lg mb-2">
          {infoText}
        </div>
      )}
      <div ref={contentRef} className="text-gray-700">
        {children}
      </div>
    </div>
  );
};

const InfoItem = ({ label, value }) => (
  <div className="mb-2">
    <span className="font-semibold">{label}:</span> {value}
  </div>
);

export default InfoModal;