import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Ride from './pages/Passenger';
import Drive from './pages/Driver';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Landing from './pages/Landing';
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast';

import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoutes';
import Loader from './components/Loader';

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/ride"
            element={
              <ProtectedRoute>
                <Ride />
              </ProtectedRoute>
            }
          />
          <Route
            path="/drive"
            element={
              <ProtectedRoute>
                <Drive />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  );
}

export default App;
