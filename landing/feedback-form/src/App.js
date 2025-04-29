import './App.css';
import { Routes, Route} from "react-router-dom";
import About from "./routes/About";
import Home from "./routes/Home";
import Navbar from './components/Navbar';
import { HashRouter as Router } from "react-router-dom";
// import { BrowserRouter } from 'react-router-dom';

import './index.css';

function App() {
  return (
    <>
      <Router> 
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Router>
    </>
  );
}
export default App;