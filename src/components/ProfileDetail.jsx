import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaGlobe, FaBuilding, FaArrowLeft, FaEdit, FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa';
import { useProfiles } from '../context/ProfileContext';
import MapView from './MapView';
import LoadingSpinner from './ui/LoadingSpinner';
import ErrorMessage from './ui/ErrorMessage';

const ProfileDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProfile, loading, error } = useProfiles();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (id) {
      const profileData = getProfile(id);
      if (profileData) {
        setProfile(profileData);
      } else {
        // Profile not found
        navigate('/');
      }
    }
  }, [id, getProfile, navigate]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!profile) return <LoadingSpinner />;

  return (
    <div className="animate-fade-in">
      <Link 
        to="/" 
        className="inline-flex items-center mb-6 text-sm transition-colors duration-300 text-primary-500 hover:text-primary-600"
      >
        <FaArrowLeft className="mr-1" /> Back to Profiles
      </Link>
      
      <div className="overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
        {/* Header section with photo and basic info */}
        <div className="relative">
          <div className="h-48 bg-primary-500"></div>
          <div className="absolute bottom-0 left-0 flex flex-col w-full p-4 md:flex-row md:items-end">
            <img 
              src={profile.photo} 
              alt={profile.name} 
              className="object-cover w-32 h-32 -mb-16 border-4 border-white rounded-full dark:border-gray-800"
            />
            <div className="mt-16 md:mt-0 md:ml-4 md:mb-2">
              <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
              <p className="text-white/80">{profile.position} at {profile.company}</p>
            </div>
            <div className="mt-4 ml-auto md:mt-0">
              <Link 
                to={`/admin/edit/${profile.id}`}
                className="flex items-center btn-primary"
              >
                <FaEdit className="mr-1" /> Edit Profile
              </Link>
            </div>
          </div>
        </div>
        
        {/* Content section */}
        <div className="grid grid-cols-1 gap-6 p-6 pt-20 md:pt-6 md:grid-cols-3">
          {/* Left column - Contact information */}
          <div className="md:col-span-1">
            <div className="p-4 mb-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">Contact Information</h2>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <FaEnvelope className="flex-shrink-0 mt-1 mr-3 text-primary-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-gray-800 dark:text-white">{profile.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FaPhone className="flex-shrink-0 mt-1 mr-3 text-primary-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="text-gray-800 dark:text-white">{profile.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FaGlobe className="flex-shrink-0 mt-1 mr-3 text-primary-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Website</p>
                    <a 
                      href={`https://${profile.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-500 hover:text-primary-600"
                    >
                      {profile.website}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FaMapMarkerAlt className="flex-shrink-0 mt-1 mr-3 text-primary-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                    <p className="text-gray-800 dark:text-white">
                      {profile.location.address}<br />
                      {profile.location.city}, {profile.location.state} {profile.location.zip}<br />
                      {profile.location.country}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">Skills</h2>
              <div className="flex flex-wrap">
                {profile.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="mb-2 mr-2 badge bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-100"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            {profile.social && (
              <div className="p-4 mt-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">Social Media</h2>
                <div className="space-y-2">
                  {profile.social.linkedin && (
                    <a 
                      href={`https://${profile.social.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-700 transition-colors duration-300 dark:text-gray-300 hover:text-primary-500"
                    >
                      <FaLinkedin className="mr-2" /> LinkedIn
                    </a>
                  )}
                  
                  {profile.social.twitter && (
                    <a 
                      href={`https://twitter.com/${profile.social.twitter.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-700 transition-colors duration-300 dark:text-gray-300 hover:text-primary-500"
                    >
                      <FaTwitter className="mr-2" /> Twitter
                    </a>
                  )}
                  
                  {profile.social.github && (
                    <a 
                      href={`https://${profile.social.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-700 transition-colors duration-300 dark:text-gray-300 hover:text-primary-500"
                    >
                      <FaGithub className="mr-2" /> GitHub
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Right column - Main content */}
          <div className="md:col-span-2">
            <div className="p-4 mb-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <h2 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">About</h2>
              <p className="text-gray-700 whitespace-pre-line dark:text-gray-300">{profile.description}</p>
            </div>
            
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">Location</h2>
              <div className="overflow-hidden rounded-md h-80">
                <MapView 
                  profiles={[profile]} 
                  center={[profile.location.coordinates.lat, profile.location.coordinates.lng]}
                  zoom={14}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetail;