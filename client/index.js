/* eslint-disable react/react-in-jsx-scope */

import React from 'react';  // eslint-disable-line
import ReactDOM from 'react-dom';

import App from './app.jsx';
import Nickname from './nickname.jsx';
import Oops from './oops.jsx';

import 'weui';
import 'react-weui/build/packages/react-weui.css';
//import '../public/style.css';

window.attachApp = (first_time, userId) => {
    if (userId) {
        const app = <App first_time={first_time} userId={userId} />;
        ReactDOM.render(app, document.getElementById('content'));
    } else {
        ReactDOM.render(<Oops />, document.getElementById('content'));
    }
};

window.attachNickname = (userID) => {
    if (userID) {
        document.getElementById('content').innerHTML = "HERR";
        const app = <Nickname userId={userID} />;
        ReactDOM.render(app, document.getElementById('content'));
    } else {
        ReactDOM.render(<Oops />, document.getElementById('content'));
    }
}
