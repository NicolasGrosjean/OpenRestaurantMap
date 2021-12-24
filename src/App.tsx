import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import Map from './Map';

const queryClient = new QueryClient();
const App = function () {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <Map />
      </QueryClientProvider>
    </div>
  );
};

export default App;
