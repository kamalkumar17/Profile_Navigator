import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProfileList from './components/ProfileList'
import ProfileDetail from './components/ProfileDetail'
import AdminPanel from './components/AdminPanel'
import AdminForm from './components/AdminForm'
import { ProfileProvider } from './context/ProfileContext'
import './App.css'

function App() {
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState('Profile Directory');

  useEffect(() => {
    // Update page title based on route
    const path = location.pathname;
    
    if (path === '/') {
      setPageTitle('Profile Directory');
      document.title = 'Profile Directory - Home';
    } else if (path.includes('/profile/')) {
      setPageTitle('Profile Details');
      document.title = 'Profile Directory - Details';
    } else if (path === '/admin') {
      setPageTitle('Admin Panel');
      document.title = 'Profile Directory - Admin';
    } else if (path.includes('/admin/edit/') || path === '/admin/add') {
      setPageTitle('Edit Profile');
      document.title = 'Profile Directory - Edit';
    }
  }, [location]);

  return (
    <ProfileProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Navbar pageTitle={pageTitle} />
        <main className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<ProfileList />} />
            <Route path="/profile/:id" element={<ProfileDetail />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/add" element={<AdminForm />} />
            <Route path="/admin/edit/:id" element={<AdminForm />} />
          </Routes>
        </main>
      </div>
    </ProfileProvider>
  )
}

export default App