import { Routes, Route, BrowserRouter } from "react-router-dom";
import Ride from "./pages/Ride";
import Drive from "./pages/Drive";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Landing from "./pages/Landing";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Landing />} />
        <Route path="/ride" element={<Ride />} />
        <Route path="/drive" element={<Drive />} />
      </Routes>
    </BrowserRouter>
    <Toaster />
    </>
  );
}

export default App;
