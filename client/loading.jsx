import React from 'react';
import ReactDOM from 'react-dom';
import {Toast} from 'react-weui';

const Loading = ({text = 'Loading...'}) => {
	return <Toast show icon='loading'>{text}</Toast>;
};

Loading.propTypes = {
	text: React.PropTypes.string,
};

export default Loading;