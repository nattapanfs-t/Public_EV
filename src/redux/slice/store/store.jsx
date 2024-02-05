import { configureStore } from '@reduxjs/toolkit';
import stationSlice from '../stationSlice';
import packageSlice from '../packageSlice';
import userSlice from '../userSlice';
import paymentSlice from '../paymentSlice';
import unitPriceSlice from '../unitPriceSlice';
import taxInvoiceSlice from '../taxInvoiceSlice';
import creditsSlice from '../creditsSlice';
import chargerSlice from '../chargerSlice';

export const store = configureStore({
    reducer:{
        station: stationSlice,
        package: packageSlice,
        user: userSlice,
        payment: paymentSlice,
        unitPrice:unitPriceSlice,
        taxInvoice: taxInvoiceSlice,
        credits: creditsSlice,
        charger: chargerSlice
    }
})