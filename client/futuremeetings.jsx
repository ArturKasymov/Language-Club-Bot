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

export default class FutureMeetings extends React.PureComponent {

	static propTypes = {
		userId: React.PropTypes.string.isRequired,
	}

	state = {
		
		ALL_MEETINGS: null,
		alert: false,
		//TEMP
		text: 'init'
	}

	pullData(){
		const check_endpoint = `/users/${this.props.userId}/check_reg/false`;
		fetch(check_endpoint)
		.then((response) => {
			if (response.status == 200) {
				return response.json();
			}
		}).then((jsonResponse) => {
			if(jsonResponse=="0") WebviewControls.close();
		}).catch((err) => console.error('Error pulling data', err))
		.then(() => {
			const endpoint = `/meetings/${this.props.userId}/future`;
			fetch(endpoint)
			.then((response) => {
				if (response.ok) return response.json();
			}).then((res) => {
				this.setState({ALL_MEETINGS: res, text: JSON.stringify(res)});
			})
		});		
	}

	componentWillMount() {
		this.pullData();
	}

	onRegister(id, registered) {
		
	}

	render() {
		if (this.state.ALL_MEETINGS == null) {
			return <Loading />;
		}

		const meetings = this.state.ALL_MEETINGS.map((entry) => {
			return <Meeting userId={this.props.userId} id={parseInt(entry.id)} placeID={parseInt(entry.placeID)} placeName={entry.place_name} 
					placeCity={entry.place_city} placeAddress={entry.place_address} organizatorID={entry.organizerID} organizatorNickname={entry.organizer_nickname}
					description={entry.description} startDate={entry.startDate} endDate={entry.endDate} disabled={true} onBlock={this.onRegister.bind(this)}
					registerable={true} registered={entry.registered} register={this.onRegister.bind(this)} />;
		});

		return (
			<div className='app'>
				<h1>YOUR MEETINGS</h1>
				{meetings}
			<p>{this.state.text}</p>
			</div>
		);
	}
}