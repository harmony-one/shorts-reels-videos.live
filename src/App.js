import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { StreamList } from './pages/StreamLists';
import { Stream } from './pages/Stream';
import { Header } from './Header';

function App() {
  return (
    <div className="App">
      <Header />
      <div className="App-body">
        <Routes>
          <Route path="/" element={<StreamList />} />
          <Route path="/streams/:id" element={<Stream />} />
        </Routes>
      </div>
    </div>

  );
}

export default App;
