import React from 'react';
import ReactDOM from 'react-dom';

import App from './app.jsx';
import Oops from './oops.jsx';

import 'weui';
//import 'react-weui/lib/react-weui.min.css';

window.attachApp = (userId) => {
    console.log("RENDERING APP");
    if (userId) {
        const app = <App userId={userId} />;
        ReactDOM.render(app, document.getElementById('content'));
    } else {
        ReactDOM.render(<Oops />, document.getElementById('content'));
    }
};