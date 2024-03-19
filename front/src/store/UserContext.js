import React, { createContext, useState } from 'react';

export const UserContext = createContext({
  id: null,
  isAuthenticated: null,
  token: null,
  authenticateUser: (data) => {},
  signoutUser: () => {}
});

function UserContextProvider({ children }) {
  const [userState, setUserState] = useState({ id: null, token: null });

  function authenticateUser(data) {
    localStorage.setItem('id_token', data.token);
    localStorage.setItem('user_id', data.id);
    setUserState(() => ({ id: data.id, token: data.token }));
  }

  function signoutUser(){
    localStorage.removeItem('id_token');
    localStorage.removeItem('user_id');
    setUserState(() => ({ id: null, token: null }));
  }

  const value = {
    ...userState,
    isAuthenticated: !!userState.token,
    authenticateUser,
    signoutUser
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContextProvider;
