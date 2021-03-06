﻿/* eslint-disable react/react-in-jsx-scope */

import React from 'react';
import 'whatwg-fetch';

import {
  Button,
  Form,
  FormCell,
  CellHeader,
  CellBody,
  CellsTitle,
  TextArea,
  Label,
  Input,
} from 'react-weui';

import WebviewControls from '../api/webview-controls';

export default class Place extends React.PureComponent {

	static propTypes = {
		userId: React.PropTypes.string.isRequired,
		onSubmit: React.PropTypes.func.isRequired,
	}

	state = {
		name: null,
		city: null,
		address: null,
		description: null,
		photo: null,
		alert: false
	}

	pushData() {

		const endpoint = `/places/${this.props.userId}`;
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
		}).catch((err) => console.log(err));
	}

	jsonState() {
		return JSON.stringify(this.state);
	}

	showAlert() {
		this.setState({alert:true});
	}

	updateName(e) {
		this.setState({name: e.target.value});
	}

	updateCity(e) {
		this.setState({city: e.target.value});
	}

	updateAddress(e) {
		this.setState({address: e.target.value});
	}

	updatePlaceDescription(e) {
		this.setState({description: e.target.value});
	}

	addNewPlace() {
		const callback = this.props.onSubmit;
		this.pushData()
		.then((place) => {
			callback(place);
		});
	}

	render() {	
		
		return (
			<div className='app sub-app'>
				<h1>NEW PLACE</h1>
				<section>
					<Form>
						<FormCell>
							<CellHeader>
								<Label>Name</Label>
							</CellHeader>
							<CellBody>
								<Input type="text" placeholder="Enter place name" required="required" onChange={this.updateName.bind(this)} />
							</CellBody>
						</FormCell>
						<FormCell>
							<CellHeader>
								<Label>City</Label>
							</CellHeader>
							<CellBody>
								<Input type="text" placeholder="Enter the city" required="required" onChange={this.updateCity.bind(this)} />
							</CellBody>
						</FormCell>
						<FormCell>
							<CellHeader>
								<Label>Address</Label>
							</CellHeader>
							<CellBody>
								<Input type="text" placeholder="Enter the address" required="required" onChange={this.updateAddress.bind(this)} />
							</CellBody>
						</FormCell>
					</Form>
				</section>

				<section>
					<CellsTitle>Description</CellsTitle>
					<Form>
						<FormCell>
							<CellBody>
								<TextArea placeholder="Enter brief description of this place..." rows="3" maxlength="200"
								onChange={this.updatePlaceDescription.bind(this)}></TextArea>
							</CellBody>
						</FormCell>
					</Form>
				</section>

				<section>
					<Button onClick={this.addNewPlace.bind(this)}>ADD</Button>
				</section>
			</div>
		);
	}
}