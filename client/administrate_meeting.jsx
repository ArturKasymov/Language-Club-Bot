/* eslint-disable react/react-in-jsx-scope */

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
		//TEMP
		text: 'init'
	}

	pullData() {
		const endpoint = `/meetings/${this.props.userId}/current`;

		fetch(endpoint)
		.then((response) => {
			if (response.status == 200) {
				return response.json();
			}

			const text = response.status.toString();
			this.setState({text});
		}).then((res) => {
				this.setState({id: res.id, placeName: res.placename, placeCity: res.city, placeAddress: res.adress, description: res.meetingDescription, 
								startTime: res.startDate, endTime: res.endDate, text: 'success'});
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

				const text = response.status.toString();
				this.setState({text});
			}).then((res) => this.setState({REGISTERED_USERS: res}))
			.catch((err) => this.setState({text: 'err'}));
		});
	}

	componentWillMount() {
		this.pullData();
	}

	finishMeeting() {
	
	}

	nextRound() {
	
	}

	addPresentUser(id, not_added) {
	
	}

	render() {
		if (this.state.id === null) {
			return <Loading />;
		}
		const adminId = this.props.userId;
		const users = this.state.REGISTERED_USERS.map((entry) => {
			return <User key={entry.userID} id={entry.userID} nickname={entry.nickname} addable={true} not_added={entry.userID != adminId} add={this.addPresentUser.bind(this)} />;
		});
		//const users = <User key={"a"} id={"a"} nickname={"Demian"} addable={true} not_added={true} add={this.addPresentUser.bind(this)} />;

		return (
			<div className='app'>
				<section>
					<p>Meeting at {this.state.placeAddress}, {this.state.placeCity} in {this.state.placeName}</p>
					<p>from {dateString(this.state.startTime, true)} to {dateString(this.state.endTime, true)}</p>
					<hr/>
					<Button onClick={() => this.finishMeeting()}>FINISH</Button>
					<Button onClick={() => this.nextRound()}>NEXT ROUND</Button>
					<hr/>
					<h2>USERS</h2>
					{users}

					<p>{this.state.text}</p>
				</section>
			</div>
		);
	}
}