import React from 'react';
import { Routes, Route } from 'react-router-dom';
// import './App.css';
import { StreamList } from './pages/StreamLists';
import { Stream } from './pages/Stream';
import { Header } from './Header';
import { CreateStream } from './pages/Stream/CreateStream';
import { Box } from 'grommet';
import { BodyContainer } from 'components/BodyContainer';

function App() {
  return (
    <Box>
      <Header />
      <BodyContainer>
        <Routes>
          <Route path="/" element={<StreamList />} />
          <Route path="/go-live" element={<CreateStream />} />
          <Route path="/streams/:id" element={<Stream />} />
        </Routes>
      </BodyContainer>
    </Box>

  );
}

export default App;
