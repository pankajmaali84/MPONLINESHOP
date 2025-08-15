
<<<<<<< HEAD
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { About } from "./pages/about";
import { Contact } from "./pages/contact";
import Navbar from "./component/Navbar";
import { Services } from "./pages/services";

// import Profile from "./pages/Profile";

function App() {
  return (
    <>
      <Navbar />
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/service" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          {/* <Route path="/profile" element={<Profile />} /> */}
        </Routes>
      </div>
    </>
=======

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';


import Register from "./component/Register";
import Login from "./component/Login";
import Home from "./pages/Home";
import ProtectedRoute from "./component/ProtectedRoute"; // 👈 Import किया
import PanCardForm from "./component/PanCardForm";
import ViewAllForm from "./pages/ViewForm";
import NotFound from "./pages/NotFound"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/PanCardForm"
          element={
            <ProtectedRoute>
              <PanCardForm />
            </ProtectedRoute>
          }
        />
        
           <Route
          path="/viewAllForm"
          element={
            <ProtectedRoute>
              <ViewAllForm/>
            </ProtectedRoute>
          }
        />
        
 <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
>>>>>>> c3540197e2bbe8cac0011fc08b3e5e83b82e2c2b
  );
}

export default App;
