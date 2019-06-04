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

	static languages = ['english', 'arabic', 'polish', 'german', 'french', 'chinese', 'russian',
                                'ukrainian', 'spanish', 'hindi', 'portuguese', 'japanese', 'korean',
                                'turkish', 'italian', 'hebrew', 'finnish', 'swedish', 'norwegian',
                                'danish', 'irish', 'hungarian', 'bulgarian', 'persian', 'serbian',
                                'slovak', 'czech', 'greek', 'latin', 'lithuanian', 'latvian', 'estonian'];

	static propTypes = {
		userId: React.PropTypes.string.isRequired,
	}

	state = {
		languages: new Set(),
		ALL_LANGUAGES: [],
		//TEMP
		text: 'init text'
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
		return JSON.stringify([...this.state.languages]);
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

		return (
			<div className='app'>
				<section>
					<CellsTitle>What languages do you speak?</CellsTitle>
					<Form checkbox>{languagesFactory}</Form>
				</section>

				<p>{this.state.text}</p>

				<ButtonArea className='submit'>
					<Button onClick={() => this.pushData()}>Submit</Button>
				</ButtonArea>
			</div>
		);
	}
}