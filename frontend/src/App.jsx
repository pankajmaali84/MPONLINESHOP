
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
  );
}

export default App;
