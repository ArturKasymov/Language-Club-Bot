/* eslint-disable react/react-in-jsx-scope */

import React from 'react';
import 'whatwg-fetch';

import WebviewControls from '../api/webview-controls';

import Loading from './loading.jsx';
import Meeting from './Meeting.jsx';

export default class MeetingsList extends React.PureComponent {

	static propTypes = {
		userId: React.PropTypes.string.isRequired,
	}

	state = {
		update_meeting_idx: -1,

		ALL_MEETINGS: null
	}

	pullData() {
		const endpoint = `/meetings/${this.props.userId}/list`;

		fetch(endpoint)
		.then((response) => {
			if (response.status == 200) {
				return response.json();
			}
		}).then((jsonResponse) => {
				
				this.setState({ALL_MEETINGS: Object.entries(jsonResponse).map((entry) => {var x = {}; x[entry[0]] = entry[1]; return x;})});

		}).catch((err) => console.error('Error pulling data', err));
	}

	componentWillMount() {
		this.pullData();
	}

	blockOthers(id) {
		this.setState({update_meeting_idx: id});
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
				<Meeting userId={this.props.userId} id={id} placeID={placeID} placeName={placeName} placeCity={placeCity} placeAddress={placeAddress}
				organizatorID={organizatorID} organizatorNickname={organizatorNickname} description={description} startDate={startDate} endDate={endDate}
				disabled={this.state.update_meeting_idx==id} onBlock={this.blockOthers.bind(this)} registerable={false} registered={false} />
			);
		});

		return (
			<div className='app'>
				<section>
				{meetings}
				</section>
			</div>
		);
	}
}