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
import User from './User.jsx';

export default class History extends React.PureComponent {

	static propTypes = {
		userId: React.PropTypes.string.isRequired,
	}

	state = {
		curr_info: -1,
		currPartners: null,
		
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

	showPartners(id) {
		const endpoint = `/meetings/${id}/partners/${this.props.userId}`;
		fetch(endpoint)
		.then((response) => {
			if (response.ok) return response.json();
		}).then((res) => {
			this.setState({curr_info: parseInt(id), currPartners: res});
		});
	}

	rollBack() {
		this.setState({curr_info: -1});
	}

	render() {
		if (this.state.ALL_MEETINGS == null) {
			return <Loading />;
		}

		const meetings = this.state.ALL_MEETINGS ? this.state.ALL_MEETINGS.map((entry) => {
			return <Meeting userId={this.props.userId} id={entry.id} placeID={entry.placeID} placeName={entry.place_name} 
					placeCity={entry.place_city} placeAddress={entry.place_address} organizatorID={entry.organizerID} organizatorNickname={entry.organizer_nickname}
					description={entry.description} startDate={entry.startDate} endDate={entry.endDate} 
					disabled={true} onBlock={this.showPartners.bind(this)}
					registerable={false} registered={false} 
					openable={true} open_url={this.showPartners.bind(this)} />;
		}) : <p></p>;

		const partners = this.state.currPartners ? this.state.currPartners.map((entry) => {
			return <User id={entry.partnerID} nickname={entry.partnerNickname} addable={false} not_added={false} />;
		}) : <p>NO PARTNERS</p>;

		return (
			<div className='app'>
				<h1>{this.state.curr_info == -1 ? "HISTORY" : "PARTNERS"}</h1>
				{this.state.curr_info == -1 ? meetings : partners}
				{this.state.curr_info != -1 ? <Button onClick={() => this.rollBack()}>BACK</Button> : <p></p>}
			</div>
		);
	}
}