import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaEnvelope, FaBuilding, FaInfoCircle } from 'react-icons/fa';
import MapView from './MapView';

const ProfileCard = ({ profile }) => {
  const [showMap, setShowMap] = useState(false);

  return (
    <div className="profile-card bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="relative">
        <img 
          src={profile.photo} 
          alt={profile.name} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
          <h2 className="text-xl font-bold text-white">{profile.name}</h2>
          <p className="text-sm text-white/90">{profile.position}</p>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start mb-3">
          <FaBuilding className="text-primary-500 mt-1 mr-2 flex-shrink-0" />
          <p className="text-gray-700 dark:text-gray-300">{profile.company}</p>
        </div>
        
        <div className="flex items-start mb-3">
          <FaMapMarkerAlt className="text-primary-500 mt-1 mr-2 flex-shrink-0" />
          <p className="text-gray-700 dark:text-gray-300">
            {profile.location.city}, {profile.location.country}
          </p>
        </div>
        
        <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">{profile.description}</p>
        
        <div className="mb-4">
          {profile.skills.slice(0, 3).map((skill, index) => (
            <span 
              key={index} 
              className="badge mr-1 mb-1 bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-100"
            >
              {skill}
            </span>
          ))}
          {profile.skills.length > 3 && (
            <span className="badge bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
              +{profile.skills.length - 3} more
            </span>
          )}
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between">
          <button
            onClick={() => setShowMap(!showMap)}
            className="flex items-center text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors duration-300"
          >
            <FaMapMarkerAlt className="mr-1" />
            {showMap ? 'Hide Location' : 'View Location'}
          </button>
          
          <Link
            to={`/profile/${profile.id}`}
            className="flex items-center text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors duration-300"
          >
            <FaInfoCircle className="mr-1" />
            View Details
          </Link>
        </div>
        
        {showMap && (
          <div className="mt-4 h-[200px] rounded-md overflow-hidden animate-fade-in">
            <MapView 
              profiles={[profile]} 
              center={[profile.location.coordinates.lat, profile.location.coordinates.lng]}
              zoom={12}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;