/* eslint-disable react/react-in-jsx-scope */

import React from 'react';  // eslint-disable-line
import ReactDOM from 'react-dom';

import {
    Button
} from 'react-weui';

//import App from './app.jsx';
//import Oops from './oops.jsx';

//import 'weui';
//import 'react-weui/lib/react-weui.min.css';

window.attachApp = (userId) => {
    if (userId) {
        //document.getElementById('content').getElementsByTagName('h1')[0].innerHTML = "userId-HERR";
        const app = <Button>HERR</Button>;
        ReactDOM.render(app, document.getElementById('content'));
    } else {
        //document.getElementById('content').getElementsByTagName('h1')[0].innerHTML = "nouserId-HERR";
        //ReactDOM.render(<Oops />, document.getElementById('content'));
    }
};
