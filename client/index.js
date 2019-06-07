/* eslint-disable react/react-in-jsx-scope */

import React from 'react';  // eslint-disable-line
import ReactDOM from 'react-dom';

import App from './app.jsx';
import Nickname from './nickname.jsx';
import Organizators from './orgs.jsx';
import CreateMeeting from './createmeet.jsx';
import MeetingsList from './meetingslist.jsx';
import AdministrateMeeting from './administrate_meeting.jsx';
import FutureMeetings from './futuremeetings.jsx';
import Oops from './oops.jsx';

import 'weui';
import 'react-weui/build/packages/react-weui.css';
import '../public/style.css';

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
        const app = <Nickname userId={userID} />;
        ReactDOM.render(app, document.getElementById('content'));
    } else {
        ReactDOM.render(<Oops />, document.getElementById('content'));
    }
};

window.attachOrganizators = (userID) => {
    if (userID) {
        const app = <Organizators userId={userID} />;
        ReactDOM.render(app, document.getElementById('content'));
    } else {
        ReactDOM.render(<Oops />, document.getElementById('content'));
    }
};

window.attachCreateMeeting = (userID) => {
    if (userID) {
        const app = <CreateMeeting userId={userID} />;
        ReactDOM.render(app, document.getElementById('content'));
    } else {
        ReactDOM.render(<Oops />, document.getElementById('content'));
    }
};

window.attachMeetingsAdmList = (userID) => {
    if (userID) {
        const app = <MeetingsList userId={userID} />;
        ReactDOM.render(app, document.getElementById('content'));
    } else {
        ReactDOM.render(<Oops />, document.getElementById('content'));
    }
};

window.attachMeetingsAdm = (userID) => {
    if (userID) {
        const app = <AdministrateMeeting userId={userID} />;
        ReactDOM.render(app, document.getElementById('content'));
    } else {
        ReactDOM.render(<Oops />, document.getElementById('content'));
    }
};

window.attachFutureMeetings = (userID) => {
    if (userID) {
        const app = <FutureMeetings userId={userId} />;
        ReactDOM.render(app, document.getElementById('content'));
    } else {
        ReactDOM.render(<Oops />, document.getElementById('content'));
    }
}
