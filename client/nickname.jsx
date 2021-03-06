﻿/* eslint-disable react/react-in-jsx-scope */

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

export default class Nickname extends React.PureComponent {

	static propTypes = {
		userId: React.PropTypes.string.isRequired,
	}

	state = {
		nickname: '',
		alert: false,
		isloading: true
	}

	pullData(){
		const check_endpoint = `/users/${this.props.userId}/check_perm/1`;
		fetch(check_endpoint)
		.then((response) => {
			if (response.status == 200) {
				return response.json();
			}
		}).then((jsonResponse) => {
			if(jsonResponse=="0")WebviewControls.close();
		}).catch((err) => console.error('Error pulling data', err))	
		.then(() => {
			this.setState({isloading: false});
		});
	}

	pushData() {
		if (this.state.nickname.length == 0 || this.state.nickname.indexOf(' ') != -1) {
			this.showAlert();
			return;
		}
		const content = this.jsonState();		

		fetch(`/users/${this.props.userId}/nickname`, {
			method: 'PUT',
			headers: {'Content-Type': 'application/json'},
			body: content,
		}).then((response) => {
			if (response.ok) {
				console.log('Data successfully updated on the server!');
				return;
			}
		}).catch((err) => /*TODO: HANDLE ERROR*/console.log(err)).then(() => {
			WebviewControls.close();
		});
	}

	componentWillMount() {
		this.pullData();
	}

	jsonState() {
		return JSON.stringify({nickname: this.state.nickname});
	}

	updateNickname(name) {
		this.setState({nickname: name, alert: false});
	}

	showAlert() {
		this.setState({alert: true});
	}

	render() {	
		if (this.state.isloading) {
			return <Loading />;
		}


		var input;
		if (this.state.alert) {
			input = <section><CellsTitle>Your Nickname</CellsTitle>
					<Form><CellHeader>
					<Input className='nicknameInput alert' type='text' placeholder='Enter your nickname' onChange={(e) => this.updateNickname(e.target.value)}/>
			</CellHeader></Form></section>
		} else {
			input = <section><CellsTitle>Your Nickname</CellsTitle>
					<Form><CellHeader>
					<Input className='nicknameInput' type='text' placeholder='Enter your nickname' onChange={(e) => this.updateNickname(e.target.value)}/>
			</CellHeader></Form></section>
		}

		return (
			<div className='app'>
				{input}

				<ButtonArea className='submit'>
					<Button onClick={() => this.pushData()}>Submit</Button>
				</ButtonArea>
			</div>
		);
	}
}
