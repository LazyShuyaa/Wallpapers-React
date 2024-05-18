import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SearchBar from './components/SearchBar';
import WallpaperPage from './components/WallpaperPage';
function App() {
  return (
  <div className="font-oswald bg-black">
    <Router>
      <Routes>
        <Route path="/" element={<SearchBar />} />
        <Route path="/:query" element={<WallpaperPage />} /> 
      </Routes>
    </Router>
  </div>
  );
}

export default App;
