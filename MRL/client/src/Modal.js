// Modal.js
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

Modal.setAppElement('#root');

const DiseaseModal = ({ isOpen, closeModal, diseaseName }) => {
  const [diseaseDetails, setDiseaseDetails] = useState(null);

  useEffect(() => {
    if (isOpen && diseaseName) {
      axios
        .post('http://localhost:5000/getspecificdiseaseinfo', { name: diseaseName })
        .then((response) => {
          const details = response.data;
          setDiseaseDetails(details);
        })
        .catch((error) => {
          console.error('Error fetching specific disease info:', error);
        });
    }
  }, [isOpen, diseaseName]);

  const modalStyle = {
    content: {
      width: '500px',
      height: '300px',
      margin: 'auto',
      border: '2px solid black',
      borderRadius: '8px',
    },
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Disease Details"
      style={modalStyle}
    >
      <h1 style={{ fontWeight: 'bold', fontSize: '1.5em' }}>{diseaseName}</h1>
      {diseaseDetails && (
        <div>
          <p>{diseaseDetails.desc}</p>
          <h3 style={{ fontSize: '1.4em' }}>More Information:</h3>

          <p>
            {diseaseDetails.geneticEffects === 'None'
              ? 'This condition is not passed down genetically.'
              : `This condition is passed down genetically: ${diseaseDetails.geneticEffects}`}
          </p>
          <p>{diseaseDetails.symptomsOccurrence}</p>

          <h3 style={{ fontSize: '1.4em' }}>Symptoms:</h3>
          <ul>
            {diseaseDetails.symptoms.map((symptom, index) => (
              <li key={index}>{symptom}</li>
            ))}
          </ul>
        </div>
      )}
      <button
        onClick={closeModal}
        className="bg-beige-resonate text-white px-2 py-1 rounded hover:bg-[#C2899E] transition-colors"
      >
        Close
      </button>
    </Modal>
  );
};

export default DiseaseModal;
