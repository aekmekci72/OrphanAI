import React, { useEffect, useState } from 'react';
import axios from 'axios';
import xmljs from 'xml-js';

const DiseaseDropdown = ({ onSelect }) => {
  const [diseases, setDiseases] = useState([]);

  useEffect(() => {
    const fetchDiseases = async () => {
      try {
        const response = await axios.get('./xmls/en_product9_ages.xml'); // Ensure the path is correct
        const xmlData = response.data;

        // Convert XML to JSON
        const jsonData = xmljs.xml2js(xmlData, { compact: true });

        // Log the JSON structure to debug
        console.log('Parsed JSON:', JSON.stringify(jsonData, null, 2));

        // Extract disorder names
        const disorderList = jsonData?.JDBOR?.DisorderList?.Disorder || [];
        const diseaseNames = disorderList.map(disorder => disorder?.Name?._text || 'Unknown Disease');

        // Sort the names alphabetically
        const sortedDiseaseNames = diseaseNames.sort((a, b) => a.localeCompare(b));

        // Set the state with the sorted names
        setDiseases(sortedDiseaseNames);
      } catch (error) {
        console.error('Error fetching and parsing XML:', error);
      }
    };

    fetchDiseases();
  }, []);

  return (
    <select onChange={(e) => onSelect(e.target.value)}>
      <option value="">Select a disease</option>
      {diseases.map((disease, index) => (
        <option key={index} value={disease}>
          {disease}
        </option>
      ))}
    </select>
  );
};

export default DiseaseDropdown;
