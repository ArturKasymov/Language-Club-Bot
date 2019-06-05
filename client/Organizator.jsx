/* eslint-disable react/react-in-jsx-scope */

import React from 'react';
import {MediaBox, MediaBoxBody, MediaBoxTitle, Button} from 'react-weui';

const Organizator = ({id, nickname, removeOrganizator}) => {

	return (
		<MediaBox type="appmsg">
			<MediaBoxBody>
				<MediaBoxTitle>{nickname}</MediaBoxTitle>
				<Button onClick={() => removeOrganizator([id, nickname])}>Remove</Button>
			</MediaBoxBody>
		</MediaBox>
	);
};

Organizator.propTypes = {
  id: React.PropTypes.string.isRequired,
  nickname: React.PropTypes.string.isRequired,
  removeOrganizator: React.PropTypes.func.isRequired,
};

export default Organizator;