/* eslint-disable react/react-in-jsx-scope */

import React from 'react';
import 'whatwg-fetch';

import {
	CellsTitle,
	Form,
	FormCell,
	CellHeader,
	CellBody,
	TextArea,
	Label,
	Select,
	Button,
} from 'react-weui';

import {dateString} from '../utils/date-string-format';

export default class Place extends React.PureComponent {

	static propTypes = {
		id: React.PropTypes.string.isRequired,
		placeID: React.PropTypes.string.isRequired,
		placeName: React.PropTypes.string.isRequired,
		placeCity: React.PropTypes.string.isRequired,
		placeAddress: React.PropTypes.string.isRequired,
		organizatorID: React.PropTypes.string.isRequired,
		organizatorNickname: React.PropTypes.string.isRequired,
		description: React.PropTypes.string,
		startDate: React.PropTypes.string.isRequired,
		endDate: React.PropTypes.string.isRequired,
	}

	state = {
		id: this.state.id,
		description: this.props.description,
		startDate: this.props.startDate,
		endDate: this.props.endDate,

		alert: false,
		change_meeting: false,
		//TEMP
		text: 'init'
	}

	pushData() {

		const endpoint = `/meetings/${this.props.userId}/update`;
		const content = this.jsonState();

		return fetch(endpoint, {
			method: 'PUT',
			headers: {'Content-Type': 'application/json'},
			body: content,
		}).then((response) => {
			if (response.ok) {
				console.log('Data successfully updated on the server!');
				return response.json();
			}
		}).catch((err) => /*TODO: HANDLE ERROR*/console.log(err));
	}

	jsonState() {
		return JSON.stringify(this.state);
	}

	showAlert() {
		this.setState({alert:true, text: "alert"});
	}

	updateStartTime(startDate) {
		this.setState({startDate, text: startDate, alert: false});
	}

	updateEndTime(endDate) {
		this.setState({endDate, text: endDate, alert: false});
	}

	updateMeetingDescription(e) {
		this.setState({description: e.target.value, text: e.target.value});
	}

	updateMeeting() {
		pushData();
		this.setState({change_meeting: false});
	}

	showChangePanel() {
		this.setState({change_meeting: true});
	}

	render() {	

		const changeMeetingPanel = 
				<div className='app sub-app'>
				<hr/>
				<section>
				  <CellsTitle>Start Time</CellsTitle>
				  <Form>
					<FormCell select id='start-time'>
					  <CellHeader id='display-date'>
						{dateString(this.state.startDate, true)}
					  </CellHeader>

					  <CellBody>
						<input
						  id='datepicker'
						  className={this.state.alert ? "alert" : ""}
						  type='datetime-local'
						  required='required'
						  value={this.state.startDate}
						  onChange={(event) => this.updateStartTime(event.target.value)}
						/>
					  </CellBody>
					</FormCell>
				  </Form>
				</section>

				<section>
				  <CellsTitle>Finish Time</CellsTitle>
				  <Form>
					<FormCell select id='finish-time'>
					  <CellHeader id='display-date'>
						{dateString(this.state.endDate, true)}
					  </CellHeader>

					  <CellBody>
						<input
						  id='datepicker'
						  type='datetime-local'
						  required='required'
						  value={this.state.endDate}
						  onChange={(event) => this.updateEndTime(event.target.value)}
						/>
					  </CellBody>
					</FormCell>
				  </Form>
				</section>
				<section>
					<CellsTitle>Description</CellsTitle>
					<Form>
						<FormCell>
							<CellBody>
								<TextArea rows="3" maxlength="200"
								onChange={this.updateMeetingDescription.bind(this)}>{this.state.description}</TextArea>
							</CellBody>
						</FormCell>
					</Form>
				</section>

				<section>
					<Button onClick={this.updateMeeting.bind(this)}>DONE</Button>
				</section>
				</div>;
		
		return (
			<div className='app sub-app'>
				<p>Meeting at {this.props.placeAddress}, {this.props.placeCity} in {this.props.placeName} from {this.props.startDate} to {this.props.endDate}</p>
				<br/>
				<p>{this.state.description}</p>
				<Button onClick={() => this.showChangePanel()}>CHANGE</Button>
				<p>{this.state.text}</p>
				{this.state.change_meeting && changeMeetingPanel}				
			</div>
		);
	}
}