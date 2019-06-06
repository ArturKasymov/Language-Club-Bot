/* eslint-disable react/react-in-jsx-scope */

import React from 'react';
import 'whatwg-fetch';

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

		}).catch((err) => this.setState({text: err}));
	}

	componentWillMount() {
		this.pullData();
	}

	render() {
		if (this.state.ALL_LANGUAGES.length === 0) {
			return <Loading />;
		}

		return (
			<div className='app'>
				<p>{this.state.ALL_LANGUAGES.toString()}</p>
			</div>
		);
	}
}