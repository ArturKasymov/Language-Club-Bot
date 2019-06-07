/* eslint-disable react/react-in-jsx-scope */

import React from 'react';
import 'whatwg-fetch';

import {
  Button,
  ButtonArea,
  CellBody,
  CellFooter,
  CellHeader,
  CellsTitle,
  Form,
  FormCell,
  Input,
} from 'react-weui';

import WebviewControls from '../api/webview-controls';

import Loading from './loading.jsx';
import Meeting from './Meeting.jsx';

export default class History extends React.PureComponent {

	static propTypes = {
		userId: React.PropTypes.string.isRequired,
	}

	state = {
		
		ALL_MEETINGS: null,
		alert: false,
	}

	pullData(){
		const check_endpoint = `/users/${this.props.userId}/check_perm/1`;
		fetch(check_endpoint)
		.then((response) => {
			if (response.status == 200) {
				return response.json();
			}
		}).then((jsonResponse) => {
			if(jsonResponse=="0")sendApi.sendNeedRegistrationMessage(req.params.userID);
		}).catch((err) => console.error('Error pulling data', err))
		.then(() => {
			const endpoint = `/meetings/${this.props.userId}/history`;
			fetch(endpoint)
			.then((response) => {
				if (response.ok) return response.json();
			}).then((res) => {
				this.setState({ALL_MEETINGS: res});
			});
		});	
	}

	componentWillMount() {
		this.pullData();
	}

	render() {
		if (this.state.ALL_MEETINGS == null) {
			return <Loading />;
		}

		const meetings = this.state.ALL_MEETINGS.map((entry) => {
			return <Meeting userId={this.props.userId} id={parseInt(entry.id)} placeID={parseInt(entry.placeID)} placeName={entry.place_name} 
					placeCity={entry.place_city} placeAddress={entry.place_address} organizatorID={entry.organizerID} organizatorNickname={entry.organizer_nickname}
					description={entry.description} startDate={entry.startDate} endDate={entry.endDate} 
					disabled={true} onBlock={this.onRegister.bind(this)}
					registerable={false} registered={false} 
					openable={true} open_url={'/meetings/history/' + this.props.userId + '/' + entry.id} />;
		});

		return (
			<div className='app'>
				<h1>HISTORY</h1>
				{meetings}
			</div>
		);
	}
}