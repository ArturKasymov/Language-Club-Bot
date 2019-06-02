import React from 'react';
import 'whatwg-fetch';

const CONSTANTS = require('../model/Constants.js');
const query = require('../models/db.js');

import WebviewControls from '../api/webview-controls';

import Lang from '../entities/lang';

import Language from './language.jsx';

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

export default class App extends React.PureComponent {
	static dateConfig = {
		month: 'long',
		day: 'numeric',
	}

	static languages = [];


	static propTypes = {
		userId: React.PropTypes.string.isRequired,
	}

	state = {
		nickname: null,
		languages: {}
	}

	pullData() {
		query(CONSTANTS.GET_LANGUAGES, [])
		.then((langs) => {
			languages = langs;
		});
	}


	pushData() {
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
	}

	jsonState() {
		return JSON.stringify({
			...this.state,

		});
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
		if (languages === {}) {
			return <Loading />;
		}

		const languages = App.languages.map((lang, index) => {
			const value = Lang.TYPES[index];

			return (
				<Language 
					key={value}
					value={value}
					label={lang}
					checked=false
					addLanguage={this.addLanguage.bind(this)}
					removeLanguage={this.removeLanguage.bind(this)}
				/>
			);
		});


		return (
			<div className='app'>
				<section>
					<CellsTitle>Nickname</CellsTitle>
					<Input type="text" placeholder="Nickname..." />
				</section>

				<section>
					<CellsTitle>What languages do you speak?</CellsTitle>
					<Form checkbox>{languages}</Form>
				</section>

				<ButtonArea className='submit'>
					<Button onClick={() => this.pushData()}>Submit</Button>
				</ButtonArea>
			</div>
		);
	}
}










