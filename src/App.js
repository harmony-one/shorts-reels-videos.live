import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { StreamList } from './pages/StreamLists';
import { Stream } from './pages/Stream';
// import { StreamBroadcast } from './pages/StreamBroadcast';

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<StreamList />} />
        {/* <Route path="/stream-broadcast/:key" element={<StreamBroadcast />} /> */}
        <Route path="/streams/:id" element={<Stream />} />
      </Routes>
    </div>

  );
}

export default App;
