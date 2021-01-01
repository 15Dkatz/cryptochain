import { header } from '../helpers/header';

const fetchSignIn = ({ email, password }) => {
  return fetch(`${document.location.origin}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  .then( res => {
    if(!res.ok) throw new Error(`Request rejected with status ${res.status}`);
    return res.json();
  })
  .catch(err => alert(err.message));
}

const fetchSignUp = ({ username, email, password, confirm }) => {
  if(password !== confirm) return alert('password must match confirm');
  return fetch(`${document.location.origin}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  })
  .then( res => {
    if(!res.ok) throw new Error(`Request rejected with status ${res.status}`);
    return res.json();
  })
  .catch(err => alert(err.message));
};

const fetchLogout = () => {
  return fetch(`${document.location.origin}/auth/logout`, {
    method: 'POST',
    headers: {
      ...header(),
      'Content-Type': 'application/json'
    }
  })
  .then( res => {
    if(!res.ok) throw new Error(`Request rejected with status ${res.status}`);
    return res.json();
  })
  .catch(err => alert(err.message));
};

export const authAPI = {
  fetchSignIn,
  fetchSignUp,
  fetchLogout
};
