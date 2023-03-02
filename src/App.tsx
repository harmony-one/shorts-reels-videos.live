import React from 'react';
import { Routes, Route } from 'react-router-dom';
// import './App.css';
// import { StreamList } from './pages/StreamLists';
import { Stream } from './pages/Stream';
import { Header } from './Header';
// import { CreateStream } from './pages/CreateStream';
import { Box } from 'grommet';
import { BodyContainer } from 'components/BodyContainer';
import { ActionModals } from 'components/ActionModals';

function App() {
  return (
    <Box
      fill={true}
      pad={{ horizontal: 'medium', bottom: 'medium' }}
      style={{ height: '100%', position: 'fixed', overflow: 'hidden' }}
      gap="20px"
    >
      <Header />
      <BodyContainer>
        <Routes>
          <Route path="/live" element={<Stream />} />
          {/* <Route path="/live" element={<CreateStream />} />
          <Route path="/:name" element={<Stream />} /> */}
        </Routes>
      </BodyContainer>
      <ActionModals />
    </Box>
  );
}

export default App;
