/* eslint-disable react/react-in-jsx-scope */

import React from 'react';  // eslint-disable-line
import ReactDOM from 'react-dom';

import App from './app.jsx';
import Oops from './oops.jsx';

import 'weui';
//import 'react-weui/build/packages/react-weui.css';
//import '../public/style.css';

window.attachApp = (userId) => {
    if (userId) {
        const app = <App userId={userId} />;
        ReactDOM.render(app, document.getElementById('content'));
    } else {
        ReactDOM.render(<Oops />, document.getElementById('content'));
    }
};
