/* eslint-disable react/react-in-jsx-scope */

import React from 'react';
import {CellBody, CellHeader, Checkbox, FormCell} from 'react-weui';

const Language = ({label, value, checked, addLanguage, removeLanguage}) => {
	const toggle = checked ? removeLanguage : addLanguage;

	return (
		<FormCell checkbox key={value}>
			<CellHeader>
				<Checkbox name={value} value={value} defaultChecked={checked} onClick={() => toggle(value)} />
			</CellHeader>

			<CellBody>{label}</CellBody>
		</FormCell>
	);
};

Language.propTypes = {
  label: React.PropTypes.string.isRequired,
  value: React.PropTypes.string.isRequired,
  checked: React.PropTypes.bool.isRequired,
  addLanguage: React.PropTypes.func.isRequired,
  removeLanguage: React.PropTypes.func.isRequired
};

export default Language;