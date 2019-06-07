/* eslint-disable react/react-in-jsx-scope */

import React from 'react';
import {Button, MediaBox, MediaBoxBody, MediaBoxTitle} from 'react-weui';

const User = ({id, nickname, addable, not_added, add}) => {

	const addButton = <Button onClick={() => add(id, not_added)}>ADD</Button>

	return (
		<MediaBox type="appmsg">
			<MediaBoxBody>
				{addable && addButton}
				<MediaBoxTitle>{nickname}</MediaBoxTitle>
			</MediaBoxBody>
		</MediaBox>
	);
};

User.propTypes = {
  id: React.PropTypes.string.isRequired,
  nickname: React.PropTypes.string.isRequired,
  addable: React.PropTypes.bool.isRequired,
  not_added: React.PropTypes.bool.isRequired,
  add: React.PropTypes.func.isRequired,
};

export default User;