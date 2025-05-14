import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaSave, FaTimes, FaArrowLeft } from 'react-icons/fa';
import { useProfiles } from '../context/ProfileContext';
import LoadingSpinner from './ui/LoadingSpinner';
import ErrorMessage from './ui/ErrorMessage';

const AdminForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProfile, addProfile, updateProfile, loading } = useProfiles();
  const isEditing = !!id;

  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    photo: '',
    description: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    website: '',
    skills: '',
    social: {
      linkedin: '',
      twitter: '',
      github: ''
    },
    location: {
      address: '',
      city: '',
      state: '',
      country: '',
      zip: '',
      coordinates: {
        lat: '',
        lng: ''
      }
    }
  });

  useEffect(() => {
    if (isEditing) {
      const profile = getProfile(id);
      if (profile) {
        // Convert skills array to string for form input
        const skillsString = profile.skills.join(', ');
        
        setFormData({
          ...profile,
          skills: skillsString,
        });
      } else {
        navigate('/admin');
      }
    }
  }, [id, getProfile, isEditing, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      
      if (parent === 'location' && child === 'coordinates') {
        const [coord, val] = name.split('.')[2];
        setFormData({
          ...formData,
          location: {
            ...formData.location,
            coordinates: {
              ...formData.location.coordinates,
              [coord]: value
            }
          }
        });
      } else if (parent === 'social') {
        setFormData({
          ...formData,
          social: {
            ...formData.social,
            [child]: value
          }
        });
      } else if (parent === 'location') {
        setFormData({
          ...formData,
          location: {
            ...formData.location,
            [child]: value
          }
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.photo.trim()) errors.photo = 'Photo URL is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.location.city.trim()) errors.city = 'City is required';
    if (!formData.location.country.trim()) errors.country = 'Country is required';
    
    // Validate coordinates as numbers
    if (isNaN(parseFloat(formData.location.coordinates.lat))) {
      errors.lat = 'Latitude must be a number';
    }
    if (isNaN(parseFloat(formData.location.coordinates.lng))) {
      errors.lng = 'Longitude must be a number';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Convert skills string back to array
    const skillsArray = formData.skills
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill);
    
    const profileData = {
      ...formData,
      skills: skillsArray,
      location: {
        ...formData.location,
        coordinates: {
          lat: parseFloat(formData.location.coordinates.lat),
          lng: parseFloat(formData.location.coordinates.lng)
        }
      }
    };
    
    if (isEditing) {
      updateProfile(id, profileData);
    } else {
      addProfile(profileData);
    }
    
    navigate('/admin');
  };

  if (loading && isEditing) return <LoadingSpinner />;

  return (
    <div className="animate-fade-in">
      <Link 
        to="/admin" 
        className="inline-flex items-center text-sm text-primary-500 hover:text-primary-600 mb-6 transition-colors duration-300"
      >
        <FaArrowLeft className="mr-1" /> Back to Admin Panel
      </Link>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            {isEditing ? 'Edit Profile' : 'Add New Profile'}
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Basic Information</h2>
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`form-input ${formErrors.name ? 'border-error-500' : ''}`}
                  />
                  {formErrors.name && <p className="mt-1 text-sm text-error-500">{formErrors.name}</p>}
                </div>
                
                <div>
                  <label htmlFor="photo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Photo URL *
                  </label>
                  <input
                    type="text"
                    id="photo"
                    name="photo"
                    value={formData.photo}
                    onChange={handleChange}
                    className={`form-input ${formErrors.photo ? 'border-error-500' : ''}`}
                  />
                  {formErrors.photo && <p className="mt-1 text-sm text-error-500">{formErrors.photo}</p>}
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    className="form-input"
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="skills" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    id="skills"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g. JavaScript, React, Design"
                  />
                </div>
              </div>
              
              {/* Contact Information */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Contact Information</h2>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`form-input ${formErrors.email ? 'border-error-500' : ''}`}
                  />
                  {formErrors.email && <p className="mt-1 text-sm text-error-500">{formErrors.email}</p>}
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                
                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Position
                  </label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                
                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Website
                  </label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>
            </div>
            
            {/* Social Media */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Social Media</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="social.linkedin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    LinkedIn
                  </label>
                  <input
                    type="text"
                    id="social.linkedin"
                    name="social.linkedin"
                    value={formData.social.linkedin}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="linkedin.com/in/username"
                  />
                </div>
                
                <div>
                  <label htmlFor="social.twitter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Twitter
                  </label>
                  <input
                    type="text"
                    id="social.twitter"
                    name="social.twitter"
                    value={formData.social.twitter}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="@username"
                  />
                </div>
                
                <div>
                  <label htmlFor="social.github" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    GitHub
                  </label>
                  <input
                    type="text"
                    id="social.github"
                    name="social.github"
                    value={formData.social.github}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="github.com/username"
                  />
                </div>
              </div>
            </div>
            
            {/* Location Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Location Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="location.address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    id="location.address"
                    name="location.address"
                    value={formData.location.address}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                
                <div>
                  <label htmlFor="location.city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    id="location.city"
                    name="location.city"
                    value={formData.location.city}
                    onChange={handleChange}
                    className={`form-input ${formErrors.city ? 'border-error-500' : ''}`}
                  />
                  {formErrors.city && <p className="mt-1 text-sm text-error-500">{formErrors.city}</p>}
                </div>
                
                <div>
                  <label htmlFor="location.state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    State/Province
                  </label>
                  <input
                    type="text"
                    id="location.state"
                    name="location.state"
                    value={formData.location.state}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                
                <div>
                  <label htmlFor="location.zip" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    ZIP/Postal Code
                  </label>
                  <input
                    type="text"
                    id="location.zip"
                    name="location.zip"
                    value={formData.location.zip}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                
                <div>
                  <label htmlFor="location.country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Country *
                  </label>
                  <input
                    type="text"
                    id="location.country"
                    name="location.country"
                    value={formData.location.country}
                    onChange={handleChange}
                    className={`form-input ${formErrors.country ? 'border-error-500' : ''}`}
                  />
                  {formErrors.country && <p className="mt-1 text-sm text-error-500">{formErrors.country}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label htmlFor="location.coordinates.lat" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Latitude *
                  </label>
                  <input
                    type="text"
                    id="location.coordinates.lat"
                    name="location.coordinates.lat"
                    value={formData.location.coordinates.lat}
                    onChange={handleChange}
                    className={`form-input ${formErrors.lat ? 'border-error-500' : ''}`}
                    placeholder="e.g. 37.7749"
                  />
                  {formErrors.lat && <p className="mt-1 text-sm text-error-500">{formErrors.lat}</p>}
                </div>
                
                <div>
                  <label htmlFor="location.coordinates.lng" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Longitude *
                  </label>
                  <input
                    type="text"
                    id="location.coordinates.lng"
                    name="location.coordinates.lng"
                    value={formData.location.coordinates.lng}
                    onChange={handleChange}
                    className={`form-input ${formErrors.lng ? 'border-error-500' : ''}`}
                    placeholder="e.g. -122.4194"
                  />
                  {formErrors.lng && <p className="mt-1 text-sm text-error-500">{formErrors.lng}</p>}
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                You can find coordinates by searching for a location on Google Maps, right-clicking and selecting "What's here?"
              </p>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link
                to="/admin"
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-300"
              >
                <FaTimes className="mr-2" /> Cancel
              </Link>
              
              <button
                type="submit"
                className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 transition-colors duration-300"
              >
                <FaSave className="mr-2" /> {isEditing ? 'Update Profile' : 'Create Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminForm;