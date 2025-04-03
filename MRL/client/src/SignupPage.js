import React, { useState } from 'react';
import axios from 'axios';
// import backgroundImg from './assets/backgroundImg.png';
// import signuptext from './assets/signuptext.png';

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name_first, setFirst] = useState('');
  const [name_last, setLast] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const handleSignup = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/signup',
        {
          username,
          password,
          email,
          name_first,
          name_last
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.message === 'Signup successful') {
        localStorage.setItem('username', username);
        window.location.href = '/Homepage';
      } else {
        setErrorMessage('Encountered Error');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrorMessage('An error occurred while logging in');
    }
  };

  const styles = {
    page_container: {
      // backgroundImage: `url(${backgroundImg})`,
      backgroundSize: 'cover',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }, 
    signupText: {
      position: 'absolute',
      top: '12%', // Adjust to desired position
      left: '50%',
      transform: 'translateX(-50%)',
      width: '200px', // Adjust to image dimensions
    },
    container: {
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      padding: '40px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      width: '300px',
      textAlign: 'center',
      marginTop: '12%', // Adjust this value for spacing
    },
    heading: {
      fontSize: '24px',
      marginBottom: '20px'
    },
    inputContainer: {
      marginBottom: '10px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start'
    },
    input: {
      padding: '8px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      width: '100%'
    },
    button: {
      backgroundColor: '#9F9D81',
      color: '#fff',
      padding: '10px 15px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      marginTop: '10px',
    },
    error: {
      color: 'red',
      marginTop: '10px'
    }
  };

  return (
    <div style={styles.page_container}>
      <div className='bg-white-resonate '>
    <div className="flex items-center justify-center mt-20">
        <h1 className=" text-9xl text-grey-resonate">Sign</h1>
      </div>
      <div className="flex items-center justify-center mt-0">
        <h1 className=" text-9xl text-grey-resonate mx-[-0px]">Up</h1>
      </div>
      <div style={styles.container}>
        <div style={styles.inputContainer}>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.inputContainer}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.inputContainer}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.inputContainer}>
          <label>First Name:</label>
          <input
            type="name_first"
            value={name_first}
            onChange={(e) => setFirst(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.inputContainer}>
          <label>Last Name:</label>
          <input
            type="name_last"
            value={name_last}
            onChange={(e) => setLast(e.target.value)}
            style={styles.input}
          />
        </div>
        <button onClick={handleSignup} style={styles.button}>
          Sign Up
        </button>
        {errorMessage && <p style={styles.error}>{errorMessage}</p>}
      </div>
    </div>
    </div>
  );
};

export default SignupPage;
