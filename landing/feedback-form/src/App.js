import './App.css';
import { Routes, Route} from "react-router-dom";
import About from "./routes/About";
import Home from "./routes/Home";
import Navbar from './components/Navbar';
import { BrowserRouter } from 'react-router-dom';

import './index.css';

function App() {
  return (
    <>
      <BrowserRouter> 
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default App;