

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
  );
}

export default App;
