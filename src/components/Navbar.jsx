import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaCog, FaHome } from 'react-icons/fa';

const Navbar = ({ pageTitle }) => {
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'text-primary-500' : 'text-gray-600 dark:text-gray-300';
  };

  return (
    <nav className="transition-colors duration-300 bg-white shadow-md dark:bg-gray-800">
      <div className="container px-4 mx-auto sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center flex-shrink-0">
              <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">
                {pageTitle}
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden space-x-4 md:flex">
              <Link 
                to="/" 
                className={`${isActive('/')} flex items-center px-3 py-2 rounded-md text-sm font-medium hover:text-primary-500 transition-colors duration-300`}
              >
                <FaHome className="mr-1" /> Home
              </Link>
              <Link 
                to="/admin" 
                className={`${isActive('/admin')} flex items-center px-3 py-2 rounded-md text-sm font-medium hover:text-primary-500 transition-colors duration-300`}
              >
                <FaCog className="mr-1" /> Admin
              </Link>
            </div>
            
            
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="transition-colors duration-300 border-t md:hidden dark:border-gray-700">
        <div className="flex justify-around py-2">
          <Link 
            to="/" 
            className={`${isActive('/')} flex flex-col items-center px-3 py-2 text-xs font-medium hover:text-primary-500 transition-colors duration-300`}
          >
            <FaHome className="w-5 h-5 mb-1" />
            Home
          </Link>
          <Link 
            to="/admin" 
            className={`${isActive('/admin')} flex flex-col items-center px-3 py-2 text-xs font-medium hover:text-primary-500 transition-colors duration-300`}
          >
            <FaCog className="w-5 h-5 mb-1" />
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;