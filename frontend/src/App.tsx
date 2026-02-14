import { Routes, Route, BrowserRouter, Navigate, useLocation } from 'react-router-dom';
import { LanguageSync } from './helpers';
import { useTranslation } from 'react-i18next';
import Ride from './pages/Passenger';
import Drive from './pages/Driver';
import Signin from './pages/Signin';
import Signup from './pages/Signup';

import Home from './pages/Home';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import DayCardDetails from './pages/DayCardDetails';
import DayCardStat from './pages/DayCardStat';
import Profile from './pages/Profile';
import DriverProfile from './pages/DriverProfile';
import { Toaster } from 'react-hot-toast';

import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoutes';
import Landing from './pages/Landing';
import Loader from './components/Loader';
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Footer';
import About from './pages/About';

// Root redirect component
const RootRedirect = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const lang = i18n.language?.split('-')[0] || 'en';
  const targetLang = ['en', 'ar'].includes(lang) ? lang : 'en';
  
  return <Navigate to={`/${targetLang}${location.pathname}`} replace />;
};

function App() {
  const { isLoading } = useAuth();
  const { i18n } = useTranslation();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <LanguageSync />
        <Navbar />
        <Routes>
          <Route path="/:lang">
            <Route index element={<Landing />} />
            <Route path="home" element={<Home />} />
            <Route path="signin" element={<Signin />} />
            <Route path="signup" element={<Signup />} />
            <Route path="about" element={<About />} />

            {/* Protected Routes */}
            <Route
              path="ride"
              element={
                <ProtectedRoute>
                  <Ride />
                </ProtectedRoute>
              }
            />
            <Route
              path="drive"
              element={
                <ProtectedRoute>
                  <Drive />
                </ProtectedRoute>
              }
            />
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="day-card/:dayCardId"
              element={
                <ProtectedRoute>
                  <DayCardDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="day-card-stats/:dayCardId"
              element={
                <ProtectedRoute>
                  <DayCardStat />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile/:userId"
              element={
                <ProtectedRoute>
                  <DriverProfile />
                </ProtectedRoute>
              }
            />
            {/* Fallback for the lang route itself */}
            <Route path="*" element={<Navigate to={`/${i18n.language || 'en'}/home`} replace />} />
          </Route>
          
          {/* Redirect root to default language */}
          <Route path="/" element={<RootRedirect />} />
          <Route path="*" element={<RootRedirect />} />
        </Routes>
        <Footer />
      </BrowserRouter>
      <Toaster />
    </>
  );
}

export default App;

