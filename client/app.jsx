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

import Language from './language.jsx';

export default class App extends React.PureComponent {

	static languages = [
		'English',
		'Deutsch',
		'Polish',
		'Franch',
		'Spanish',
	];


	static propTypes = {
		userId: React.PropTypes.string.isRequired,
	}

	state = {
		languages: []
	}

	pullData() {
		// SOMEHOW GET DATA FROM Server
	}


	pushData() {
		/*const content = this.jsonState();
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
		});*/
		WebviewControls.close();
	}

	/*jsonState() {
		return JSON.stringify({
			...this.state,

		});
	}*/

	componentWillMount() {
		//this.pullData();
	}

	addLanguage(lang) {
	
	}

	removeLanguage(lang) {
	
	}

	render() {
		/*const languagesFactory = App.languages.map((lang, index) => {
			const value = Lang.TYPES[index];
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
		});*/

		return (
			<div className='app'>
				<section>
					<CellsTitle>What languages do you speak?</CellsTitle>
					<Form checkbox><Language key={"english"} value={"english"} label={"English"} checked={false} 
					addLanguage={this.addLanguage.bind(this)} removeLanguage={this.removeLanguage.bind(this)} /></Form>
				</section>

				<ButtonArea className='submit'>
					<Button onClick={() => this.pushData()}>Submit</Button>
				</ButtonArea>
			</div>
		);
	}
}