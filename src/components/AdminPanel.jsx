import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { useProfiles } from '../context/ProfileContext';
import LoadingSpinner from './ui/LoadingSpinner';
import ErrorMessage from './ui/ErrorMessage';
import ConfirmDialog from './ui/ConfirmDialog';

const AdminPanel = () => {
  const { profiles, loading, error, deleteProfile, searchProfiles } = useProfiles();
  const [searchQuery, setSearchQuery] = useState('');
  const [profileToDelete, setProfileToDelete] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDeleteClick = (profile) => {
    setProfileToDelete(profile);
    setShowConfirmDialog(true);
  };

  const confirmDelete = () => {
    if (profileToDelete) {
      deleteProfile(profileToDelete.id);
      setShowConfirmDialog(false);
      setProfileToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setProfileToDelete(null);
  };

  const filteredProfiles = searchProfiles(searchQuery);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-0">
          Manage Profiles
        </h1>
        
        <Link
          to="/admin/add"
          className="btn-primary flex items-center"
        >
          <FaPlus className="mr-1" /> Add New Profile
        </Link>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <input
              type="text"
              placeholder="Search profiles..."
              value={searchQuery}
              onChange={handleSearch}
              className="form-input pl-10"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Profile
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProfiles.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No profiles found
                  </td>
                </tr>
              ) : (
                filteredProfiles.map((profile) => (
                  <tr key={profile.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img className="h-10 w-10 rounded-full object-cover" src={profile.photo} alt={profile.name} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{profile.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{profile.position}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{profile.location.city}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{profile.location.country}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{profile.email}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{profile.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/profile/${profile.id}`}
                          className="text-primary-500 hover:text-primary-600 transition-colors duration-150"
                        >
                          View
                        </Link>
                        <Link
                          to={`/admin/edit/${profile.id}`}
                          className="text-primary-500 hover:text-primary-600 transition-colors duration-150"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(profile)}
                          className="text-error-500 hover:text-red-600 transition-colors duration-150"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {showConfirmDialog && (
        <ConfirmDialog
          title="Confirm Deletion"
          message={`Are you sure you want to delete ${profileToDelete?.name}'s profile? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default AdminPanel;