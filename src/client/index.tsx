import * as React from 'react';
import { render } from 'react-dom';
import App from './App';
import "./app.scss";

render(
    <React.StrictMode>
        <App />
    </React.StrictMode>, 
    document.getElementById("root")
);