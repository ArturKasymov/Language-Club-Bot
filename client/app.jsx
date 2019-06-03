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

//const CONSTANTS = require('../model/Constants.js');

import WebviewControls from '../api/webview-controls';

import Lang from '../entities/lang';

import Loading from './loading.jsx';
import Language from './language.jsx';

export default class App extends React.PureComponent {

	static languages = [];


	static propTypes = {
		userId: React.PropTypes.string.isRequired,
	}

	state = {
		languages: []
	}

	pullData() {
		const endpoint = `/users/${this.props.userId}`;
		console.log(`Pulling data from ${endpoint}...`);

		fetch(endpoint)
		.then((response) => {
			console.log("RESPONSE "+ response.status + " " + response.json());
			if (response.status == 200) {
				return response.json();
			}

			console.error(
				  status,
				  `Unable to fetch user data for User ${this.props.userId}'`
				);
		}).then((jsonResponse) => {
				console.log(`Data fetched successfully: ${jsonResponse}`);

				App.languages = JSON.parse(jsonResponse).map((x) => (x[0].toUpperCase() + x.slice(1)));
				this.render();
		}).catch((err) => console.error('Error pulling data', err));

	}


	pushData() {
	/*
		const content = this.jsonState();
		console.log(`Push data: ${content}`);

		fetch(`/users/${this.props.userId}`, {
			method: 'PUT',
			headers: {'Content-Type': 'application/json'},
			body: content,
		}).then((response) => {
			if (response.ok) {
				console.log('Data successfully updated on the server!');
				return;
			}

			console.error(
				response.status,
				`Unable to save user data for User ${this.props.userId}'`
			);
		}).catch((err) => console.log('Error pushing data', err)).then(() => {
			WebviewControls.close();
		});
		*/
		WebviewControls.close();
	}

	jsonState() {
		return JSON.stringify(this.state.languages);
	}

	componentWillMount() {
		this.pullData();
	}

	addLanguage(lang) {
		console.log(`Add language: ${lang}`);
		const oldLanguages = this.state.languages;
		const languages = new Set(oldLanguages);
		languages.add(lang);
		this.setState({languages});
	}

	removeLanguage(lang) {
		console.log(`Remove language: ${lang}`);
		const oldLanguages = this.state.languages;
		const languages = new Set(oldLanguages);
		languages.delete(lang);
		this.setState({languages});
	}

	render() {
		if (App.languages.length == 0) {
		  return <Loading />;
		}

		const languagesFactory = App.languages.map((lang, index) => {
			//const value = Lang.TYPES[index];
			const value = lang;
			const checked = this.state.languages.includes(value);

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

		return (
			<div className='app'>
				<section>
					<CellsTitle>What languages do you speak?</CellsTitle>
					<Form checkbox>{languagesFactory}</Form>
				</section>

				<ButtonArea className='submit'>
					<Button onClick={() => this.pushData()}>Submit</Button>
				</ButtonArea>
			</div>
		);
	}
}