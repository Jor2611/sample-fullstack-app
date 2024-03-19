import { Navigate, Routes, Route } from 'react-router-dom';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import LoginForm from './views/LoginForm';
import RegisterForm from './views/RegisterForm';
import AppLayout from './views/Layout';
import User from './views/User';
import Landing from './views/Landing';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from './store/UserContext';
import { checkToken } from './http';
import { eventEmitter } from './eventEmitter';

export default function AppNavigation() {
  const [isUserLoading, setIsUserLoading] = useState(true);
  const { isAuthenticated, authenticateUser, signoutUser } = useContext(UserContext);

  useEffect(() => {
    const userToken = localStorage.getItem('id_token');

    async function checkAuthState(token){
      try{
        const { data }= await checkToken(token);
        authenticateUser({ id: data.id, token });
      }catch(err){
        console.log(err)
        signoutUser();
      }finally{
        setIsUserLoading(false);
      }
    }

    if(userToken){
      checkAuthState(userToken);
    } else {
      setIsUserLoading(false);
    }

    function handleUnauthorized(){
      signoutUser();
      alert('Session Expired!');
    }

    eventEmitter.on('unauthorized', handleUnauthorized);

    return () => {
      eventEmitter.removeListener('unauthorized', handleUnauthorized);
    };
  },[]);


  if(isUserLoading){
    return <LoadingScreen height='100vh'/>;
  }

  return (
    <Routes>
      <Route path='' element={isAuthenticated ? <AppLayout/> : <LoginForm/>}>
        { isAuthenticated && <Route index element={<Navigate to='/users' replace/>}/> }
        { isAuthenticated && <Route path='users' element={<Landing/>}/> }
        { isAuthenticated && <Route path='users/:id' element={<User/>}/> }
        <Route path='*' element={<Landing/>}/>      
      </Route>
      { !isAuthenticated && <Route path='/login' element={<LoginForm/>}/> }
      { !isAuthenticated && <Route path='/register' element={<RegisterForm/>}/> }
      <Route path='*' element={<Navigate to='/users' replace/>}/>
    </Routes>
  );
}

export const LoadingScreen = ({ height }) => (
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height
  }}>
    <CircularProgress size={55} />
  </Box>
)