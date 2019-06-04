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

import Lang from '../entities/lang';

import Loading from './loading.jsx';
import Language from './language.jsx';

export default class App extends React.PureComponent {

	static propTypes = {
		first_time: React.PropTypes.bool.isRequired,
		userId: React.PropTypes.string.isRequired,
	}

	state = {
		nickname: '',
		languages: new Set(),
		ALL_LANGUAGES: [],
		alert: false,
		//TEMP
		text: 'init'
	}

	pullData() {
		const endpoint = `/users/${this.props.userId}`;

		fetch(endpoint)
		.then((response) => {
			if (response.status == 200) {
				return response.json();
			}

			const text = response.status.toString();
			this.setState({text});
		}).then((jsonResponse) => {
				
				this.setState({languages: new Set(), ALL_LANGUAGES: jsonResponse, text: 'success'});

		}).catch((err) => console.error('Error pulling data', err));
	}


	pushData() {
		this.setState({text: this.props.first_time.toString()});
		if ((this.props.first_time && (this.state.nickname.length == 0 || this.state.nickname.indexOf(' ') != -1)) || this.state.languages.length == 0) {
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
		if (this.state.ALL_LANGUAGES.length === 0) {
			return <Loading />;
		}
		
		const languagesFactory = this.state.ALL_LANGUAGES.map((lang, index) => {
			//const value = Lang.TYPES[index];
			const value = lang;
			const checked = this.state.languages.has(value);

			return (
				<Language 
					key={value}
					value={value}
					label={lang}
					checked={checked}
					addLanguage={this.addLanguage.bind(this)}
					removeLanguage={this.removeLanguage.bind(this)}
				/>
			);
		});

		var input;
		if (this.props.first_time && this.state.alert) {
			input = <section><CellsTitle>Your Nickname</CellsTitle>
					<Form><CellHeader>
					<Input className='nicknameInput alert' type='text' placeholder='Enter your nickname' onChange={(e) => this.updateNickname(e.target.value)}/>
			</CellHeader></Form></section>
		} else if (this.props.first_time) {
			input = <section><CellsTitle>Your Nickname</CellsTitle>
					<Form><CellHeader>
					<Input className='nicknameInput' type='text' placeholder='Enter your nickname' onChange={(e) => this.updateNickname(e.target.value)}/>
			</CellHeader></Form></section>
		}

		return (
			<div className='app'>
				{this.props.first_time &&
				input
				}

				<section>
					<CellsTitle>What languages do you speak?</CellsTitle>
					<Form checkbox>{languagesFactory}</Form>
				</section>

				{this.state.alert && 
					<p style="color: red;">MAYBE YOU HAVE CHOSEN NO LANGUAGE</p>
				}

				<p>{this.state.text}</p>

				<ButtonArea className='submit'>
					<Button onClick={() => this.pushData()}>Submit</Button>
				</ButtonArea>
			</div>
		);
	}
}