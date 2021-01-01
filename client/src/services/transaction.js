import { header } from '../helpers/header';

const fetchConductTransaction = ({ recipient, amount }) => {
  return fetch(`${document.location.origin}/api/transact`, {
    method: 'POST',
    headers: {
      ...header(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ recipient, amount })
  })
  .then( res => {
    if(!res.ok) throw new Error(`Request rejected with status ${res.status}`);
    return res.json();
  })
  .catch(err => alert(err.message) );
};

const fetchKnownAddresses = () => {
  return fetch(`${document.location.origin}/api/known-addresses`, {
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

export const transactionAPI = {
  fetchConductTransaction,
  fetchKnownAddresses
};
