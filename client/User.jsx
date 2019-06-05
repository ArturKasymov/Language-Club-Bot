/* eslint-disable react/react-in-jsx-scope */

import React from 'react';
import {MediaBox, MediaBoxBody, MediaBoxTitle} from 'react-weui';

const User = ({id, nickname}) => {

	return (
		<MediaBox type="text">
			<MediaBoxBody>
				<MediaBoxTitle>{nickname}</MediaBoxTitle>
			</MediaBoxBody>
		</MediaBox>
	);
};

User.propTypes = {
  id: React.PropTypes.string.isRequired,
  nickname: React.PropTypes.string.isRequired,
};

export default User;