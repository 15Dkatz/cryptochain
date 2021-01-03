import { createSlice } from '@reduxjs/toolkit';
import { authAPI } from '../../../services';
import { close } from '../wallet/walletSlice';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLogged: false,
    username: '',
    jwt: ''
  },
  reducers: {
    onLogin: (state, action) => {
      state.isLogged = true;
      const { username, jwt } = action.payload;
      state.username = username;
      state.jwt = jwt;
    },
    onLogout: (state) => {
      state.isLogged = false;
      state.username = '';
      state.jwt = ''
    }
  }
});

export const { onLogin, onLogout } = authSlice.actions;

export const login = ({ email, password }) => dispatch => {
  authAPI.fetchSignIn({ email, password})
  .then(json => dispatch(onLogin({ username: json.username, jwt: json.jwt })))
  .catch(err => alert(err.message));
};

export const register = ({ username, email, password }) => dispatch => {
  authAPI.fetchSignUp({ username, email, password })
  .then(json => dispatch(login({ email, password })) )
  .catch(err => alert(err.message));
};

export const logout = () => dispatch => {
  authAPI.fetchLogout()
  .then(() => {
    dispatch(onLogout());
    dispatch(close());
  })
  .catch(err => alert(err.message));
};

export const getIsLogged = state => state.auth.isLogged;

export const getUsername = state => state.auth.username;

export const getJWT = state => state.auth.jwt;

export default authSlice.reducer;
