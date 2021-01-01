import { header } from '../helpers/header';

const fetchTransactionPoolMap = () => {
  return fetch(`${document.location.origin}/api/transaction-pool-map`, {
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

const fetchMineTransactions = () => {
  return fetch(`${document.location.origin}/api/mine-transactions`, {
    headers: {
      ...header(),
      'Content-Type': 'application/json'
    }
  })
  .then( res => {
    if(!res.ok) throw new Error(`Request rejected with status ${res.status}`);
    return res.json();
  })
  .catch(err => alert(err.message) );
}

export const transactionPoolAPI = {
  fetchTransactionPoolMap,
  fetchMineTransactions
};
