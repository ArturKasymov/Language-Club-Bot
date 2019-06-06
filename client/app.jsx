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
		const user_endpoint = `/users/${this.props.userId}/user_languages`;

		fetch(user_endpoint)
		.then((response) => {
			if (response.status == 200) {
				return response.json();
			}

			const text = response.status.toString();
			this.setState({text});
		}).then((jsonResponse) => {
				
				this.setState({text: JSON.stringify(jsonResponse)});

		}).catch((err) => console.error('Error pulling data', err));

		const all_endpoint = `/users/${this.props.userId}/all_languages`;

		fetch(all_endpoint)
		.then((response) => {
			if (response.status == 200) {
				return response.json();
			}

			const text = response.status.toString();
			this.setState({text});
		}).then((jsonResponse) => {
				
				this.setState({text: JSON.stringify(jsonResponse)});

		}).catch((err) => console.error('Error pulling data', err));
	}


	pushData() {
		
	}


	jsonState() {
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
		if (this.state.text === 'init') {
			return <Loading />;
		}

		return (
			<div className='app'>

				<section>
					<CellsTitle>What languages do you speak?</CellsTitle>
				</section>

				{this.state.alert && 
					<p style="color: red;">MAYBE YOU HAVE CHOSEN NO LANGUAGE</p>
				}

				<p>{this.state.text}</p>

				<ButtonArea className='submit'>
					<Button style="background-color: green;" onClick={() => this.pushData()}>Submit</Button>
				</ButtonArea>
			</div>
		);
	}
}