import React from 'react';
import ReactDOM from 'react-dom';

import App from './app.jsx';
import Oops from './oops.jsx';

import 'weui';
//import 'react-weui-css';

window.attachApp = (userId) => {
    if (userId) {
        console.log("RENDERING APP");
        const app = <App userId={userId} />;
        ReactDOM.render(app, document.getElementById('content'));
    } else {
        ReactDOM.render(<Oops />, document.getElementById('content'));
    }
}