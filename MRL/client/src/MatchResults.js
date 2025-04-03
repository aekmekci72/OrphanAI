// MatchResults.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Scatter } from 'react-chartjs-2';
import { LinearScale, CategoryScale } from 'chart.js';

const MatchResults = () => {
  const [matches, setMatches] = useState([]);
  const username = localStorage.getItem('username');

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.post('http://localhost:5000/calculatepercentagematch', {
          username: username,
        });

        // Assuming the response contains a property 'diseaseMatchResults'
        const matchResults = response.data.diseaseMatchResults;

        // Convert the object to an array of objects for easier mapping
        const matchArray = Object.entries(matchResults).map(([disease, percentage]) => ({
          disease,
          percentage,
        }));

        setMatches(matchArray);
      } catch (error) {
        console.error('Error fetching match results:', error);
      }
    };

    fetchMatches();
  }, [username]);

  const chartData = {
    datasets: matches.map((match) => ({
      label: match.disease,
      data: [{ x: 1, y: match.percentage.toFixed(2) }],
      pointBackgroundColor: 'blue',
    })),
  };

  const chartOptions = {
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        min: 0,
        max: 2,
        ticks: { display: false },
      },
      y: {
        type: 'linear',
        position: 'left',
        min: 0,
        max: 100,
        ticks: { beginAtZero: true },
      },
    },
  };

  // Register the scales
  chartOptions.scales.x = {
    type: LinearScale,
    position: 'bottom',
    min: 0,
    max: 2,
    ticks: { display: false },
  };

  chartOptions.scales.y = {
    type: LinearScale,
    position: 'left',
    min: 0,
    max: 100,
    ticks: { beginAtZero: true },
  };

  return (
    <div>
      <h2>Match Results</h2>
      <Scatter data={chartData} options={chartOptions} />
    </div>
  );
};

export default MatchResults;
