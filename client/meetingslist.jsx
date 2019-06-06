/* eslint-disable react/react-in-jsx-scope */

import React from 'react';
import 'whatwg-fetch';

import WebviewControls from '../api/webview-controls';

import Loading from './loading.jsx';
import Meeting from './Meeting.jsx';

export default class App extends React.PureComponent {

	static propTypes = {
		userId: React.PropTypes.string.isRequired,
	}

	state = {
		update_meeting_idx: -1,

		ALL_MEETINGS: null,
		//TEMP
		text: 'init'
	}

	pullData() {
		const endpoint = `/meetings/${this.props.userId}/list`;

		fetch(endpoint)
		.then((response) => {
			if (response.status == 200) {
				return response.json();
			}

			const text = response.status.toString();
			this.setState({text});
		}).then((jsonResponse) => {
				
				this.setState({ALL_MEETINGS: jsonResponse});

		}).catch((err) => console.error('Error pulling data', err));
	}

	componentWillMount() {
		this.pullData();
	}

	render() {
		if (this.state.ALL_MEETINGS === null) {
			return <Loading />;
		}

		const meetings = this.state.ALL_MEETINGS.map((entry) => {
			const id = Object.keys(entry)[0];
			const placeID = entry[id][0];
			const placeName = entry[id][1];
			const placeCity = entry[id][2];
			const placeAddress = entry[id][3];
			const organizatorID = entry[id][4];
			const organizatorNickname = entry[id][5];
			const description = entry[id][6];
			const startDate = entry[id][7];
			const endDate = entry[id][8];

			return (
				<Meeting key={parseInt(id)} id={id} placeID={placeID} placeName={placeName} placeCity={placeCity} placeAddress={placeAddress}
				organizatorID={organizatorID} organizatorNickname={organizatorNickname} description={description} startDate={startDate} endDate={endDate}
				 />
			);
		})

		return (
			<div className='app'>
				<section>
				{meetings}
				</section>
			</div>
		);
	}
}