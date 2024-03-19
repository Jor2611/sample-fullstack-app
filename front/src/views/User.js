import { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { LoadingScreen } from '../navigation';
import { fetchUser } from '../http';
import { UserContext } from '../store/UserContext';

export default function User() {
  const [user, setUser] = useState(null);
  const { id } = useContext(UserContext);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const { data } = await fetchUser(id);
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchUserData();
  }, []);

  if (!user) {
    return <LoadingScreen height={35}/>;
  }

  const userFields = [
    { label: 'Id', value: user.id },
    { label: 'Email', value: user.email || 'N/A' },
    { label: 'Role', value: user.role || 'N/A' }, 
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" component="h4">
        User Page
      </Typography>
      <List sx={{ width: '100%', maxWidth: 400, mt: 2 }}>
        {userFields.map((field) => (
          <ListItem key={field.label}>
            <ListItemText primary={field.label} secondary={field.value} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
