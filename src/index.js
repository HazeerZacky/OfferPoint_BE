import React from "react";
import ReactDOM,{createRoot} from "react-dom/client";
import {Provider} from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import config from './core/config';
import './assets/sass/main.scss';
import "react-datepicker/dist/react-datepicker.css";
import "jquery/dist/jquery";
import "bootstrap/dist/js/bootstrap.bundle.min";
import App from './app';
import {store, persistor} from "./redux/store";

const applicationRootElement = document.getElementById('app-root');
const appRoot = createRoot(applicationRootElement);

appRoot.render(
    <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
            <App/>
        </PersistGate>
    </Provider>
);
