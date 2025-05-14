import { createContext, useState, useEffect, useContext } from 'react';
import { mockProfiles } from '../data/mockProfiles';

const ProfileContext = createContext();

export const useProfiles = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize profiles from localStorage or mock data
  useEffect(() => {
    const fetchProfiles = () => {
      setLoading(true);
      try {
        const storedProfiles = localStorage.getItem('profiles');
        if (storedProfiles) {
          setProfiles(JSON.parse(storedProfiles));
        } else {
          // Initialize with mock data if no data in localStorage
          setProfiles(mockProfiles);
          localStorage.setItem('profiles', JSON.stringify(mockProfiles));
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching profiles:', err);
        setError('Failed to load profiles. Please try again later.');
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  // Save profiles to localStorage whenever they change
  useEffect(() => {
    if (profiles.length > 0 && !loading) {
      localStorage.setItem('profiles', JSON.stringify(profiles));
    }
  }, [profiles, loading]);

  // Get a single profile by ID
  const getProfile = (id) => {
    return profiles.find(profile => profile.id === id);
  };

  // Add a new profile
  const addProfile = (profile) => {
    const newProfile = {
      ...profile,
      id: Date.now().toString(),
    };
    setProfiles([...profiles, newProfile]);
    return newProfile;
  };

  // Update an existing profile
  const updateProfile = (id, updatedProfile) => {
    setProfiles(profiles.map(profile => 
      profile.id === id ? { ...updatedProfile, id } : profile
    ));
  };

  // Delete a profile
  const deleteProfile = (id) => {
    setProfiles(profiles.filter(profile => profile.id !== id));
  };

  // Search profiles by name or location
  const searchProfiles = (query) => {
    if (!query) return profiles;
    
    const lowerCaseQuery = query.toLowerCase();
    return profiles.filter(profile => 
      profile.name.toLowerCase().includes(lowerCaseQuery) || 
      profile.location.city.toLowerCase().includes(lowerCaseQuery) ||
      profile.location.country.toLowerCase().includes(lowerCaseQuery)
    );
  };

  const value = {
    profiles,
    loading,
    error,
    getProfile,
    addProfile,
    updateProfile,
    deleteProfile,
    searchProfiles
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};