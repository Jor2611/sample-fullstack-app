import axios from 'axios';
import { eventEmitter } from './eventEmitter';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_BASE_URL
});

axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response) {
      if(error.response.status === 401){
        error.response.data.msg = 'Session Expired';
        eventEmitter.emit('unauthorized');
      }

      error.msg = error.response ? error.response.data.msg : error.message;
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
    return Promise.reject(error);
  }
);

const BACKEND_URL = `${process.env.REACT_APP_BACKEND_BASE_URL}/v1`;

export async function login(data){
  try{
    const response = await axiosInstance.post(`${BACKEND_URL}/users/token`, data);
    return response.data;
  }catch(err){
    console.log(err);
    err.msg = err.response.data.msg || err.message; 
    throw err;
  }
}

export async function register(data){
  try{
    const response = await axiosInstance.post(`${BACKEND_URL}/users/`, { ...data });
    return response.data;
  }catch(err){
    console.log(err);
    throw err;
  }
}

export async function checkToken(token){
  try{
    const response = await axiosInstance.get(`${BACKEND_URL}/users/checkToken?token=Bearer ${token}`);
    return response.data;
  }catch(err){
    console.log(err);
    throw err;
  }
}

export async function fetchUser(id) {
  try{
    const response = await axiosInstance.get(`${BACKEND_URL}/users/${id}`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('id_token')}` } });
    return response.data;
  }catch(err){
    console.log(err);
    throw err;
  }
}

