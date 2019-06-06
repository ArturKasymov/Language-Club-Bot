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

export default class App extends React.PureComponent {

	static propTypes = {
		userId: React.PropTypes.string.isRequired,
	}

	state = {
		id: null,
		placeID: null,
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
		}).then((jsonResponse) => {
				
				this.setState(jsonResponse);

		}).catch((err) => console.error('Error pulling data', err));
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

		const users = <User key={"a"} id={"a"} nickname={"Demian"} addable={true} not_added={true} add={this.addPresentUser.bind(this)} />;

		return (
			<div className='app'>
				<section>
					<p>Meeting at {this.state.placeAddress}, {this.props.placeCity} in {this.props.placeName}</p>
					<p>from {dateString(this.props.startTime, true)} to {dateString(this.props.endTime, true)}</p>
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