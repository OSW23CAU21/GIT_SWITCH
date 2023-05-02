import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Workspace from './pages/Workspace';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Workspace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
