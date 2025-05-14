import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProfiles } from '../context/ProfileContext';
import ProfileCard from './ProfileCard';
import SearchBar from './SearchBar';
import LoadingSpinner from './ui/LoadingSpinner';
import ErrorMessage from './ui/ErrorMessage';
import { FaMapMarkedAlt, FaList } from 'react-icons/fa';
import MapView from './MapView';

const ProfileList = () => {
  const { profiles, loading, error, searchProfiles } = useProfiles();
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list');

  useEffect(() => {
    if (profiles) {
      setFilteredProfiles(searchProfiles(searchQuery));
    }
  }, [profiles, searchQuery, searchProfiles]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 md:mb-0">
          Explore Profiles
        </h1>
        
        <div className="flex flex-col sm:flex-row w-full md:w-auto space-y-3 sm:space-y-0 sm:space-x-4">
          <SearchBar onSearch={handleSearch} />
          
          <div className="flex rounded-md shadow-sm">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md border border-r-0 border-gray-300 
                ${viewMode === 'list' 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200'} 
                focus:outline-none transition-colors duration-300`}
            >
              <FaList className="inline mr-1" /> List
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md border border-gray-300 
                ${viewMode === 'map' 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200'} 
                focus:outline-none transition-colors duration-300`}
            >
              <FaMapMarkedAlt className="inline mr-1" /> Map
            </button>
          </div>
        </div>
      </div>

      {filteredProfiles.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 dark:text-gray-400">No profiles found matching your search criteria.</p>
        </div>
      ) : viewMode === 'list' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 animate-fade-in">
          <div className="h-[600px]">
            <MapView profiles={filteredProfiles} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileList;