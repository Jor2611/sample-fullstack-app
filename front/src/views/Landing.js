import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function AppLayout(){
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" component="h4">
        Welcome to users app
      </Typography>
    </Box>
  );
};