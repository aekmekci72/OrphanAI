import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';

const Profile = () => {
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    height: '',
    weight: '',
    age: '',
    sex: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const email = localStorage.getItem('email');
      if (!email) {
        setError('No email found in local storage');
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
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/update_profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setSuccess('');
    setError('');
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <Navbar />
      <div className="flex-1 p-10 ml-64">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            {isEditing ? 'Edit Profile' : 'Profile Information'}
          </h1>
          {!isEditing ? (
            <div className="space-y-4 text-lg text-gray-700">
              <p><span className="font-semibold">First Name:</span> {profile.first_name}</p>
              <p><span className="font-semibold">Last Name:</span> {profile.last_name}</p>
              <p><span className="font-semibold">Height (in):</span> {profile.height}</p>
              <p><span className="font-semibold">Weight (lbs):</span> {profile.weight}</p>
              <p><span className="font-semibold">Age (yrs):</span> {profile.age}</p>
              <p><span className="font-semibold">Sex:</span> {profile.sex}</p>
              <p><span className="font-semibold">Email:</span> {profile.email}</p>
              <button
                className="group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-blue-600 transition duration-300 ease-out border-2 border-blue-600 rounded-full shadow-md"
                onClick={toggleEdit}
              >
                <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-blue-600 group-hover:translate-x-0 ease">
                  Edit
                </span>
                <span className="absolute flex items-center justify-center w-full h-full text-blue-600 transition-all duration-300 transform group-hover:translate-x-full ease">Edit</span>
                <span className="relative invisible">Edit</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="first_name" className="block text-lg font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={profile.first_name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-lg"
                />
              </div>
              <div>
                <label htmlFor="last_name" className="block text-lg font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={profile.last_name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-lg"
                />
              </div>
              <div>
                <label htmlFor="height" className="block text-lg font-medium text-gray-700">Height (in)</label>
                <input
                  type="text"
                  id="height"
                  name="height"
                  value={profile.height}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-lg"
                />
              </div>
              <div>
                <label htmlFor="weight" className="block text-lg font-medium text-gray-700">Weight (lbs)</label>
                <input
                  type="text"
                  id="weight"
                  name="weight"
                  value={profile.weight}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-lg"
                />
              </div>
              <div>
                <label htmlFor="age" className="block text-lg font-medium text-gray-700">Age (yrs)</label>
                <input
                  type="text"
                  id="age"
                  name="age"
                  value={profile.age}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-lg"
                />
              </div>
              <div>
                <label htmlFor="sex" className="block text-lg font-medium text-gray-700">Sex</label>
                <input
                  type="text"
                  id="sex"
                  name="sex"
                  value={profile.sex}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-lg"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-lg font-medium text-gray-700">Email</label>
                <p className="mt-1 text-lg text-gray-500">{profile.email}</p>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-blue-600 transition duration-300 ease-out border-2 border-blue-600 rounded-full shadow-md"
                >
                  <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-blue-600 group-hover:translate-x-0 ease">
                    Update Profile
                  </span>
                  <span className="absolute flex items-center justify-center w-full h-full text-blue-600 transition-all duration-300 transform group-hover:translate-x-full ease">Update Profile</span>
                  <span className="relative invisible">Update Profile</span>
                </button>
                <button
                  type="button"
                  onClick={toggleEdit}
                  className="group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-red-600 transition duration-300 ease-out border-2 border-red-600 rounded-full shadow-md"
                >
                  <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-red-600 group-hover:translate-x-0 ease">
                    Cancel
                  </span>
                  <span className="absolute flex items-center justify-center w-full h-full text-red-600 transition-all duration-300 transform group-hover:translate-x-full ease">Cancel</span>
                  <span className="relative invisible">Cancel</span>
                </button>
              </div>
            </form>
          )}
          {error && <p className="mt-4 text-red-600 text-lg">{error}</p>}
          {success && <p className="mt-4 text-blue-600 text-lg">{success}</p>}
        </div>
      </div>
    </div>
  );
};

export default Profile;