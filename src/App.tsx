import React from 'react';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { AppContextProvider } from './data/app-context';
import AppRouter from './router';

const App: React.FC = () => {
  return (
    <AppContextProvider>
      <AppRouter />;
    </AppContextProvider>
  );
};

export default App;
