import { createSlice } from '@reduxjs/toolkit';
import { walletAPI } from '../../../services';

export const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    isOpen: false,
  },
  reducers: {
    open: (state, action) => {
      state.isOpen = true;
    },
    close: (state) => {
      state.isOpen = false;
    }
  }
});

export const { open, close } = walletSlice.actions;


export const openWallet = ({ privateKey }) => dispatch => {
  walletAPI.fetchCreateWallet({ privateKey })
  .then(json => dispatch(open()));
  walletAPI.fetchCreateMiner();
};

export const isOpen = state => state.wallet.isOpen;

export default walletSlice.reducer;
