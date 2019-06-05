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

import WebviewControls from '../api/webview-controls';
import {dateString} from '../utils/date-string-format';

import Loading from './loading.jsx';
import Place from './Place.jsx';

export default class CreateMeeting extends React.PureComponent {

	static propTypes = {
		userId: React.PropTypes.string.isRequired,
	}

	state = {
		startTime: null,
		endTime: null,
		description: '',
		place_id: null,

		ALL_PLACES: null,
		new_place: false,
		//TEMP
		text: 'init'
	}

	pullData() {
	
	}

	pushData() {
	
	}

	jsonState() {
	
	}

	componentWillMount() {
		this.pullData();
	}

	updateDescription(e) {
		this.setState({description: e.target.value});
	}

	updateStartTime(time) {
		this.setState({startTime: time});
	}

	updateEndTime(time) {
		this.setState({endTime: time});
	}

	updatePlace(e) {
		this.setState({place_id: e.target.value, text: e.target.value});
	}

	showNewPlaceForm() {
		this.setState({new_place: true});
	}

	postNewPlace() {
		var new_id = this.state.ALL_PLACES ? this.state.ALL_PLACES.length : 0;
		this.setState({new_place: false, place_id: new_id});
	}

	render() {
		/*if (this.state.ALL_PLACES === null) {
			return <Loading />;
		}*/

		//const places = this.state.ALL_PLACES.map((entry, index) => {return {value: index, label: entry};});
		const places = [
                            {
                                value: 1,
                                label: 'China'
                            },
                            {
                                value: 2,
                                label: 'United States'
                            },
                            {
                                value: 3,
                                label: 'Germany'
                            }
                        ];

		return (
			<div className='app'>
			<h1>NEW MEETING</h1>
			<section>
				<CellsTitle>Description</CellsTitle>
				<Form>
					<FormCell>
						<CellBody>
							<TextArea placeholder="Enter brief description of the meeting..." rows="3" maxlength="200"
							onChange={this.updateDescription.bind(this)}></TextArea>
						</CellBody>
					</FormCell>
				</Form>
			</section>

			<section>
			  <CellsTitle>Start Time</CellsTitle>
			  <Form>
				<FormCell select id='start-time'>
				  <CellHeader id='display-date'>
					{dateString(this.state.startTime, true)}
				  </CellHeader>

				  <CellBody>
					<input
					  id='datepicker'
					  type='datetime-local'
					  required='required'
					  value={this.state.startTime}
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
					{dateString(this.state.endTime, true)}
				  </CellHeader>

				  <CellBody>
					<input
					  id='datepicker'
					  type='datetime-local'
					  required='required'
					  value={this.state.endTime}
					  onChange={(event) => this.updateEndTime(event.target.value)}
					/>
				  </CellBody>
				</FormCell>
			  </Form>
			</section>

			<section>
				<CellsTitle>Place of meeting</CellsTitle>
				<Form>
					<FormCell select selectPos="after">
						<CellHeader>
						<Label>Place</Label>
						</CellHeader>
						<CellBody>
							<Select data={places} onChange={this.updatePlace.bind(this)} />
						</CellBody>
					</FormCell>
				</Form>
			</section>

			<section>
				{ !this.state.new_place ? 
				<Button onClick={this.showNewPlaceForm.bind(this)}>Add new place</Button> : <Place onSubmit={this.postNewPlace.bind(this)}/>}
			</section>

			<p>{this.state.text}</p>
			</div>
		);
	}

}