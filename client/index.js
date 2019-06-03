//import React from 'react';
//import ReactDOM from 'react-dom';

//import App from './app.jsx';
//import Oops from './oops.jsx';

//import 'weui';
//import 'react-weui/lib/react-weui.min.css';

document.getElementById('content').getElementsByTagName('h1')[0].innerHTML = window.attachApp;

window.attachApp = (userId) => {
    if (userId) {
        document.getElementById('content').getElementsByTagName('h1')[0].innerHTML = "HERR";
        //const app = <App userId={userId} />;
        //ReactDOM.render(app, document.getElementById('content'));
    } else {
        document.getElementById('content').getElementsByTagName('h1')[0].innerHTML = "HERR";
        //ReactDOM.render(<Oops />, document.getElementById('content'));
    }
};

document.getElementById('content').getElementsByTagName('h1')[0].innerHTML = window.attachApp;
