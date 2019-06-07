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

export default class Meetings extends React.PureComponent {

	static propTypes = {
		userId: React.PropTypes.string.isRequired,
		id: React.PropTypes.number.isRequired,
		placeID: React.PropTypes.string.isRequired,
		placeName: React.PropTypes.string.isRequired,
		placeCity: React.PropTypes.string.isRequired,
		placeAddress: React.PropTypes.string.isRequired,
		organizatorID: React.PropTypes.string.isRequired,
		organizatorNickname: React.PropTypes.string.isRequired,
		description: React.PropTypes.string,
		startDate: React.PropTypes.string.isRequired,
		endDate: React.PropTypes.string.isRequired,
		disabled: React.PropTypes.bool.isRequired,
		onBlock: React.PropTypes.func.isRequired,

		registerable: React.PropTypes.bool.isRequired,
		registered: React.PropTypes.bool.isRequired,
		register: React.PropTypes.func,

		openable: React.PropTypes.bool.isRequired,
		open_url: React.PropTypes.string,
	}

	state = {
		id: this.props.id,
		description: this.props.description,
		startDate: this.props.startDate,
		endDate: this.props.endDate,

		alert: false,
		change_meeting: false,
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
		this.setState({alert:true});
	}

	updateStartTime(startDate) {
		this.setState({startDate, alert: false});
	}

	updateEndTime(endDate) {
		this.setState({endDate, alert: false});
	}

	updateMeetingDescription(e) {
		this.setState({description: e.target.value});
	}

	updateMeeting() {
		this.pushData();
		this.setState({change_meeting: false});
	}

	showChangePanel() {
		this.setState({change_meeting: true});
		this.props.onBlock(this.props.id);
	}

	onRegister() {
		const endpoint = `/meetings/${this.props.userId}/register`;
		const content = JSON.stringify({id: this.props.id, registered: this.props.registered});

		fetch(endpoint, {
			method: 'PUT',
			headers: {'Content-Type': 'application/json'},
			body: content,
		}).then((res) => {
			if (res.ok) {
				this.props.register(this.props.id);
			}
		});
	}

	forward() {
		fetch(this.props.open_url);
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
					<Button onClick={() => this.updateMeeting()}>DONE</Button>
				</section>
				</div>;
		
		return (
			<div className='app sub-app'>
				<p>Meeting at {this.props.placeAddress}, {this.props.placeCity} in {this.props.placeName}</p>
				<p>from {dateString(this.props.startDate, true)} to {dateString(this.props.endDate, true)}.</p>
				<p>Organized by {this.props.organizatorNickname}</p>
				<br/>
				<h3>Description:</h3>
				<p>{this.state.description}</p>
				<br/>
				{this.props.registerable ? <Button onClick={() => this.onRegister()}>{this.props.registered ? "CANCEL" : "REGISTER"}</Button> : 
				(this.props.openable ? <Button onClick={() => this.forward()}>INFO</Button> : <Button disabled={this.props.disabled} onClick={() => this.showChangePanel()}>CHANGE</Button>)}
				{this.state.change_meeting ? changeMeetingPanel : <hr/>}				
			</div>
		);
	}
}