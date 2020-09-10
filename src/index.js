import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Auth0Provider } from "@auth0/auth0-react";

console.log(window.location.origin)

ReactDOM.render(
  <Auth0Provider
    domain="dev-ogr-2kjg.us.auth0.com"
    clientId="EfG0Jc7siGXfNAPSqe7JbPfILBPZvpRk"
    redirectUri={window.location.origin}
    audience="https://steg-project/api"
    scope="read:current_user update:current_user_metadata"
  >
    <App />
  </Auth0Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
