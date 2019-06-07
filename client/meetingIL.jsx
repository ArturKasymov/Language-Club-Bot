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

import Loading from './loading.jsx';

export default class MeetingIL extends React.PureComponent {

	static propTypes = {
		meetingId: React.PropTypes.number.isRequired,
		userId: React.PropTypes.string.isRequired,
	}

	state = {
		
		ALL_PARTNERS: null,
		alert: false,
	}

	pullData(){
		const check_endpoint = `/users/${this.props.userId}/check_reg/false`;
		fetch(check_endpoint)
		.then((response) => {
			if (response.status == 200) {
				return response.json();
			}
		}).then((jsonResponse) => {
			if(jsonResponse=="0") WebviewControls.close();
		}).catch((err) => console.error('Error pulling data', err))
		.then(() => {
			const endpoint = `/meetings/${this.props.userId}/history`;
			fetch(endpoint)
			.then((response) => {
				if (response.ok) return response.json();
			}).then((res) => {
				this.setState({ALL_MEETINGS: res});
			})
		});		
	}

	componentWillMount() {
		this.pullData();
	}

	render() {
		if (this.state.ALL_PARTNERS == null) {
			return <Loading />;
		}

		return (
			<div className='app'>
				<h1>INTERLOCUTORS</h1>
			</div>
		);
	}
}