import { useContext } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import { UserContext } from '../store/UserContext';

const styles = {
  appBar: {
    backgroundColor: '#1976d2',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
  },
  navLink: {
    marginRight: 10,
    textDecoration: 'none',
    color: '#fff'
  },
  buttons: {
    color: '#fff'
  }
};

export default function AppLayout() {
  const { id, signoutUser } = useContext(UserContext);

  return (
    <Box>
      <Box>
        <Toolbar sx={styles.appBar}>
          <Typography variant="h6" noWrap component="div" sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}>
            Users App
          </Typography>
          <Box sx={styles.navLink}>
            <NavLink to="/">
              <Button color="inherit" sx={styles.buttons}>Home</Button>
            </NavLink>
            <NavLink to={`/users/${id}`}>
              <Button color="inherit" sx={styles.buttons}>User Data</Button>
            </NavLink>
          </Box>
          <IconButton onClick={signoutUser} color="inherit">
            <LogoutIcon />
          </IconButton>
        </Toolbar>
        <Outlet />
      </Box>
    </Box>
  );
};
