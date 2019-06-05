/* eslint-disable react/react-in-jsx-scope */

import React from 'react';
import 'whatwg-fetch';

import {
  Panel,
  PanelHeader,
  PanelBody,
  SearchBar,
  MediaBox
} from 'react-weui';

import WebviewControls from '../api/webview-controls';

import Loading from './loading.jsx';
import Organizator from './Organizator.jsx';

export default class Organizators extends React.PureComponent {

	static propTypes = {
		userId: React.PropTypes.string.isRequired,
	}

	state = {
		organizators: new Set(),
		users: new Set(),
		searchFilter: "",
		results: [],
		//TEMP
		text: 'init'
	}

	pullData() {
		const endpoint = `/users/${this.props.userId}/users_list`;

		fetch(endpoint)
		.then((response) => {
			if (response.status == 200) {
				return response.json();
			}

			const text = response.status.toString();
			this.setState({text});
		}).then((jsonResponse) => {
				var organizators = new Set();
				var users = new Set();
			
				const flat = Object.entries(jsonResponse);
				for (var i = 0; i < flat.length; i++) {
					users.add([flat[i][0], flat[i][1].slice(1)]);
					if (flat[i][1].charAt(0) === '2') organizators.add([flat[i][0], flat[i][1].slice(1)]);
				}

				const results = [...users];

				this.setState({organizators, users, results, text: jsonResponse});

		}).catch((err) => console.error('Error pulling data', err));
	}

	pushData() {
	
	}

	componentWillMount() {
		this.pullData();
	}

	removeOrganizator(org) {
		const endpoint = `/users/${this.props.userId}/remove`;
		const content = JSON.stringify({orgID: org[0]});

		fetch(endpoint, {
			method: 'PUT',
			headers: {'Content-Type': 'application/json'},
			body: content,
		}).then((response) => {
			if (response.ok) {
				console.log('Data successfully updated on the server!');
				return;
			}
		}).catch((err) => /*TODO: HANDLE ERROR*/console.log(err));

		const oldOrganizators = this.state.organizators;
		const organizators = new Set(oldOrganizators);
		organizators.delete(org);
		this.setState({organizators: organizators});
	}

	handleSearchChange(text, e) {
		if (text === "") {
			const results = [...this.state.users];
			this.setState({results, searchFilter: text});
			return;
		}

		let keywords = [text];
        let results = [...this.state.users].filter((x) => new RegExp(keywords.join('|'),'i').test(x[1]));

        this.setState({
            results,
            searchFilter: text,
        });
	}

	render() {
		if (this.state.users.length === 0) {
			return <Loading />;
		}

		/*const organizators = [...this.state.organizators].map((org, index) => {
			return <Organizator key={org[0]} id={org[0]} nickname={org[1]} removeOrganizator={this.removeOrganizator.bind(this)} />;
		});*/
		const organizators = [<Organizator key='a' id='a' nickname='Demian' removeOrganizator={this.removeOrganizator.bind(this)} />];

		/*const users = this.state.results.map((org, index) => {
			return <User key={org[0]} id={org[0]} nickname={org[1]} />;
		});*/
		const users = [<User key='a' id='a' nickname='Demian' />];

		return (
		<div className='app'>
			<Panel>
				<PanelHeader>Organizators</PanelHeader>

				<PanelBody>{organizators}</PanelBody>
			</Panel>

			<SearchBar
				onChange={this.handleSearchChange.bind(this)}
				defaultValue=""
				placeholder="User search"
				lang={{cancel: 'Cancel'}}
			/>
			<Panel>
				<PanelHeader>Users</PanelHeader>
				<PanelBody>{users.length > 0 ? users : <MediaBox>Can't find any!</MediaBox>}</PanelBody>
			</Panel>

			<p>{this.state.text}</p>
		</div>
		);
	}

}