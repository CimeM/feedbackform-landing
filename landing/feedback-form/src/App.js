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
    // 1. Check if script is already injected
    let script = document.querySelector('script[src="/plugin.js"]');
    
    if (!script) {
      script = document.createElement("script");
      script.src = "/plugin.js";
      script.async = true;
      document.body.appendChild(script);
    }

    return () => {
      // 2. Remove injected DOM container created by the script
      const container = document.getElementById("riviera-chat-plugin-container");
      if (container) {
        container.remove();
      }

      // 3. Remove script tag if necessary
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
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