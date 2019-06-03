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

const CONSTANTS = require('../model/Constants.js');

import WebviewControls from '../api/webview-controls';

import Lang from '../entities/lang';

import Language from './language.jsx';

export default class App extends React.PureComponent {

	static languages = [];


	static propTypes = {
		userId: React.PropTypes.string.isRequired,
	}

	state = {
		languages: {}
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
	}

	jsonState() {
		/*return JSON.stringify({
			...this.state,

		});*/
	}

	componentWillMount() {
		//this.pullData();
		// TEMP
		languages = [
			'English',
			'Deutsch',
			'Polish',
			'Franch',
			'Spanish',
		];
	}

	render() {
		/*if (languages.length == 0) {
			console.log("LENGTH OF LANGS === 0");
			return <Loading />;
		}

		const languages = App.languages.map((lang, index) => {
			const value = Lang.TYPES[index];
			const checked = (value in this.state.languages);

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
		*/

		return (
			<div className='app'>
				<section>
					<CellsTitle>Nickname</CellsTitle>
					<Input type="text" placeholder="Nickname..." />
				</section>
				
				<ButtonArea className='submit'>
					<Button onClick={() => this.pushData()}>Submit</Button>
				</ButtonArea>
			</div>
		);
	}
}