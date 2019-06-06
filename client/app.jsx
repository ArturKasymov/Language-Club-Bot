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

		}).catch((err) => this.setState({text: err}));

		/*const all_endpoint = `/users/${this.props.userId}/all_languages`;

		fetch(all_endpoint)
		.then((response) => {
			if (response.status == 200) {
				return response.json();
			}

			const text = response.status.toString();
			this.setState({text});
		}).then((jsonResponse) => {
				
				this.setState({text: JSON.stringify(jsonResponse)});

		}).catch((err) => console.error('Error pulling data', err));*/
	}

	componentWillMount() {
		this.pullData();
	}

	render() {
		if (this.state.text === 'init') {
			return <Loading />;
		}

		return (
			<div className='app'>
				<p>{this.state.text}</p>
			</div>
		);
	}
}