/* eslint-disable new-cap */
import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DateTimePicker from '@mui/lab/DateTimePicker';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

type MenuProps = {
  menuOpen: boolean;
  // eslint-disable-next-line no-unused-vars
  setMenuOpen: (menuOpen: boolean) => void;
  date: Date | null;
  // eslint-disable-next-line no-unused-vars
  setDate: (date: Date | null) => void;
};

const Menu = function ({ menuOpen, setMenuOpen, date, setDate }: MenuProps) {
  const handleCloseMenu = () => {
    setMenuOpen(false);
  };

  return (
    <Dialog open={menuOpen} onClose={handleCloseMenu}>
      <DialogContent>
        <DialogContentText>
          Choose the date to see the restaurant opening status.
        </DialogContentText>
        <DateTimePicker
          value={date}
          onChange={setDate}
          // eslint-disable-next-line react/jsx-props-no-spreading
          renderInput={(params) => <TextField {...params} fullWidth />}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseMenu}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default Menu;
