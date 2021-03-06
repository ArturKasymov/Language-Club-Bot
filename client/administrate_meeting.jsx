﻿/* eslint-disable react/react-in-jsx-scope */

import React from 'react';
import 'whatwg-fetch';

import {
	Button,
} from 'react-weui';

import WebviewControls from '../api/webview-controls';
import {dateString} from '../utils/date-string-format';

import Loading from './loading.jsx';
import User from './User.jsx';

export default class AdministrateMeeting extends React.PureComponent {

	static propTypes = {
		userId: React.PropTypes.string.isRequired,
	}

	state = {
		id: null,
		placeName: null,
		placeCity: null,
		placeAddress: null,
		description: null,
		startTime: null,
		endTime: null,

		REGISTERED_USERS: null,
		started: false,
	}

	pullData() {
		const check_endpoint = `/users/${this.props.userId}/check_perm/2`;
		fetch(check_endpoint)
		.then((response) => {
			if (response.status == 200) {
				return response.json();
			}
		}).then((jsonResponse) => {
			if(!(jsonResponse=="2"||jsonResponse=="3")) WebviewControls.close();
		}).catch((err) => console.error('Error pulling data', err)).then( () => {

			const endpoint = `/meetings/${this.props.userId}/current`;
			fetch(endpoint)
			.then((response) => {
				if (response.status == 200) {
					return response.json();
				}
			}).then((res) => {
				this.setState({id: res.id, placeName: res.placename, placeCity: res.city, placeAddress: res.adress, description: res.meetingDescription, 
								startTime: res.startDate.toString(), endTime: res.endDate.toString()});
				return res.id;
			}).then((id) => {
				const endpoint_users = `/meetings/${this.props.userId}/users`;
				const content = JSON.stringify({id: id});
				fetch(endpoint_users, {
					method: 'PUT',
					headers: {'Content-Type': 'application/json'},
					body: content,
				}).then((response) => {
					if (response.status == 200) {
						return response.json();
					}
				}).then((res) => this.setState({REGISTERED_USERS: res}))
				.catch((err) => alert(err));
			});
		});
	}

	componentWillMount() {
		this.pullData();
	}

	handleMeeting() {
		if (this.state.started) {
			if (new Date(this.state.startTime).getTime() > new Date().getTime()) return;
			const endpoint = `/meetings/${this.props.userId}/finish`;
			const content = JSON.stringify({meet_id: parseInt(this.state.id)});

			fetch(endpoint, {
				method: 'PUT',
				headers: {'Content-Type': 'application/json'},
				body: content,
			}).then((response) => {
				if (response.ok) {
					WebviewControls.close();
				}
			});
		} else {
			const endpoint = `/meetings/${this.props.userId}/start`;
			const content = JSON.stringify({meet_id: parseInt(this.state.id)});

			fetch(endpoint, {
				method: 'PUT',
				headers: {'Content-Type': 'application/json'},
				body: content,
			}).then((response) => {
				if (response.ok) {
					const newDate = new Date().toString();
					this.setState({startTime: newDate, started: true});
				}
			});
		}
		
	}

	nextRound() {
	
	}

	addPresentUser(id, not_added) {
		const endpoint = `/meetings/${this.props.userId}/present`;
		const content = JSON.stringify({meet_id: this.state.id, id: id, present: not_added});

		fetch(endpoint, {
			method: 'PUT',
			headers: {'Content-Type': 'application/json'},
			body: content,
		}).then((response) => {
			if (response.ok) {
				var newRegisteredUsers = new Object(this.state.REGISTERED_USERS);
				for (var i = 0; i < newRegisteredUsers.length; i++) {
					if (newRegisteredUsers[i].userID === id) {
						newRegisteredUsers[i].isPresent = !newRegisteredUsers[i].isPresent;
						break;
					}
				}
				this.setState({REGISTERED_USERS: null});
				this.setState({REGISTERED_USERS: newRegisteredUsers});
			}
		});
	}

	render() {
		if (this.state.id === null) {
			return <Loading />;
		}
		
		const cb = this.addPresentUser.bind(this);
		const users = this.state.REGISTERED_USERS ? this.state.REGISTERED_USERS.map((entry) => {
			return <User id={entry.userID} nickname={entry.nickname} addable={true} not_added={!entry.isPresent} add={cb} />;
		}) : <p>NOR</p>;

		return (
			<div className='app'>
				<section>
					<p>Meeting at {this.state.placeAddress}, {this.state.placeCity} in {this.state.placeName}</p>
					<p>from {dateString(this.state.startTime, true)} to {dateString(this.state.endTime, true)}</p>
					<hr/>
					<Button onClick={() => this.handleMeeting()}>{this.state.started ? "FINISH" : "START"}</Button>
					<Button disabled={this.state.started !== true} onClick={() => this.nextRound()}>NEXT ROUND</Button>
					<hr/>
					<h2>USERS</h2>
					{users}
					<p>{this.state.id}</p>
				</section>
			</div>
		);
	}
}