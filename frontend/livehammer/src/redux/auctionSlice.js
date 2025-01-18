import { createSlice } from '@reduxjs/toolkit';

const auctionSlice = createSlice({
    name: 'auction',
    initialState: {
        currentPrice: 1000, // Real-time price
        objectName: 'Bat', // Name of the auctioned object
    },
    reducers: {
        setPrice: (state, action) => {
            state.currentPrice = action.payload;
        },
        setObjectName: (state, action) => {
            state.objectName = action.payload;
        },
    },
});

export const { setPrice, setObjectName } = auctionSlice.actions;

export default auctionSlice.reducer;
