import './App.css';
import { Routes, Route} from "react-router-dom";
import About from "./routes/About";
import Home from "./routes/Home";
import BlogPost from "./routes/BlogPost";
import BlogList from "./routes/BlogList";
import Dashboard from './routes/Dashboard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { HashRouter as Router } from "react-router-dom";
// import { BrowserRouter } from 'react-router-dom';
import { useEffect } from "react";

import './index.css';

function App() {

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/plugin.js"; // replace with your script URL
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // Clean up on unmount
    };
  }, []);

  return (
    <>
      <Router> 
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/blog/posts/:slug" element={<BlogPost />} />
        </Routes>
        <Footer/>
      </Router>
      
    </>
  );
}
export default App;