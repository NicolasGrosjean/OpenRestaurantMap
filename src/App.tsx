import React, { useState } from 'react';
import DateAdapter from '@mui/lab/AdapterDateFns';
import { LocalizationProvider } from '@mui/lab';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { QueryClient, QueryClientProvider } from 'react-query';
import Map from './Map';
import Menu from './Menu';

const queryClient = new QueryClient();
const App = function () {
  const [menuOpen, setMenuOpen] = React.useState(true);
  const [date, setDate] = useState<Date | null>(new Date(Date.now()));

  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <IconButton
          aria-label="menu"
          onClick={() => setMenuOpen(true)}
          style={{
            position: 'absolute',
            zIndex: 10,
            left: '2px',
            top: '2px',
            backgroundColor: 'white',
          }}
        >
          <MenuIcon />
        </IconButton>
        <LocalizationProvider dateAdapter={DateAdapter}>
          <Menu
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            date={date}
            setDate={setDate}
          />
        </LocalizationProvider>
        <Map date={date} />
      </QueryClientProvider>
    </div>
  );
};

export default App;
