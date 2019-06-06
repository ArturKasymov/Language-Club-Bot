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
	}

	pushData() {
		
	}

	pullData() {
		const user_endpoint = `/users/${this.props.userId}/user_languages`;

		fetch(user_endpoint)
		.then((response) => {
			if (response.status == 200) {
				return response.json();
			}

			const text = response.status.toString();
			this.setState({text});
		}).then((jsonResponse) => {
				
				this.setState({languages: new Set(jsonResponse.user_langs)});

		}).catch((err) => console.log(err));

		const all_endpoint = `/users/${this.props.userId}/all_languages`;

		fetch(all_endpoint)
		.then((response) => {
			if (response.status == 200) {
				return response.json();
			}

			const text = response.status.toString();
			this.setState({text});
		}).then((jsonResponse) => {
				
				this.setState({ALL_LANGUAGES: jsonResponse});

		}).catch((err) => console.log(err));
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

		var input;
		if (this.props.first_time && this.state.alert) {
			input = <section><CellsTitle>Your Nickname</CellsTitle>
					<Form><CellHeader>
					<Input className='nickname-input alert' type='text' placeholder='Enter your nickname' onChange={(e) => this.updateNickname(e.target.value)}/>
			</CellHeader></Form></section>
		} else if (this.props.first_time) {
			input = <section><CellsTitle>Your Nickname</CellsTitle>
					<Form><CellHeader>
					<Input className='nickname-input' type='text' placeholder='Enter your nickname' onChange={(e) => this.updateNickname(e.target.value)}/>
			</CellHeader></Form></section>
		}

		return (
			<div className='app'>
				<p>{this.state.ALL_LANGUAGES.toString()}</p>

				{this.props.first_time &&
				input
				}

				<section>
					<CellsTitle>What languages do you speak?</CellsTitle>
				</section>

				{this.state.alert && 
					<p style="color: red;">MAYBE YOU HAVE CHOSEN NO LANGUAGE</p>
				}

				<ButtonArea className='submit'>
					<Button style="background-color: green;" onClick={() => this.pushData()}>Submit</Button>
				</ButtonArea>
			</div>
		);
	}
}