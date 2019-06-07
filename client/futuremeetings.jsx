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

export default class FutureMeetings extends React.PureComponent {

	static propTypes = {
		userId: React.PropTypes.string.isRequired,
	}

	state = {
		
		ALL_MEETINGS: [],
		alert: false,
	}

	pullData() {
		const check_endpoint = `/meetings/${this.props.userId}/`;
		fetch(check_endpoint)
		.then((response) => {
			if (response.status == 200) {
				return response.json();
			}
		}).then((jsonResponse) => {
			if(jsonResponse!="0"&&this.props.first_time==true) WebviewControls.close();
			if(jsonResponse=="0"&&this.props.first_time==false) WebviewControls.close();
		}).catch((err) => console.error('Error pulling data', err));


		const user_endpoint = `/users/${this.props.userId}/user_languages`;

		fetch(user_endpoint)
		.then((response) => {
			if (response.status == 200) {
				return response.json();
			}
		}).then((jsonResponse) => {
				
				this.setState({languages: new Set(jsonResponse.user_langs)});

		}).catch((err) => console.error('Error pulling data', err));

		const all_endpoint = `/users/${this.props.userId}/all_languages`;

		fetch(all_endpoint)
		.then((response) => {
			if (response.status == 200) {
				return response.json();
			}
		}).then((jsonResponse) => {
				
				this.setState({ALL_LANGUAGES: jsonResponse});

		}).catch((err) => console.error('Error pulling data', err));
	}


	pushData() {
		if ((this.props.first_time && (this.state.nickname.length == 0 || this.state.nickname.indexOf(' ') != -1)) || this.state.languages.size == 0) {
			this.showAlert();
			return;
		}

		const content = this.jsonState();		

		fetch(`/users/${this.props.userId}`, {
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


	jsonState() {
		if (this.props.first_time) return JSON.stringify({nickname: this.state.nickname, languages: [...this.state.languages]});
		else return JSON.stringify({languages: [...this.state.languages]});
	}

	componentWillMount() {
		this.pullData();
	}

	addLanguage(lang) {
		const oldLanguages = this.state.languages;
		const languages = new Set(oldLanguages);
		languages.add(lang);
		this.setState({languages: languages});
	}

	removeLanguage(lang) {
		const oldLanguages = this.state.languages;
		const languages = new Set(oldLanguages);
		languages.delete(lang);
		this.setState({languages: languages});
	}

	updateNickname(name) {
		this.setState({nickname: name, alert: false});
	}

	showAlert() {
		this.setState({alert: true});
	}

	render() {
		if ( === 0) {
			return <Loading />;
		}

		return (
			<div className='app'>
				
			</div>
		);
	}
}