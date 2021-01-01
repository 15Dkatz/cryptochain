import { header } from '../helpers/header';

const fetchBlockchainLength = () => {
  return fetch(`${document.location.origin}/api/blocks/length`, {
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

const fetchPaginatedBlocks = id => {
  return fetch(`${document.location.origin}/api/blocks/${id}`, {
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

export const blockchainAPI = {
  fetchBlockchainLength,
  fetchPaginatedBlocks
};
