import React from 'react';
import { MantineProvider, createTheme } from '@mantine/core';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Notifications } from '@mantine/notifications';

import Welcome from '../Welcome';
import Symmetric from '../Symmetric';
import Asymmetric from '../Asymmetric';
import Hash from '../Hash';
import DiffieHellman from '../DiffieHellman';

const theme = createTheme({

});

const App = () => {
    return (
        <MantineProvider theme={theme}>
            <Notifications />
            <BrowserRouter basename="/">
                <Routes>
                    <Route path="" element={<Welcome />} />
                    <Route path="symmetric" element={<Symmetric />} />
                    <Route path="asymmetric" element={<Asymmetric />} />
                    <Route path="hash" element={<Hash />} />
                    <Route path="key-sharing" element={<DiffieHellman />} />
                </Routes>
            </BrowserRouter>
        </MantineProvider>
    );
};

export default App;
