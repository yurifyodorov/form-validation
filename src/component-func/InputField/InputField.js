import React, { useState, useEffect } from 'react';
import {
	FormGroup,
	ControlLabel,
	InputGroup,
	Icon,
	IconButton,
	Button,
	Modal,
} from 'rsuite'

import './InputField.scss';

const Rules = ({ conditions, validate, focused }) => (

	<div className={`rules`}>
    СПИСОК ПРАВИЛ!
	</div>

  // <ul className={`rules ${!focused ? 'rules_is-hidden' : ''}`}>
	// 	{conditions.map(({ message, test }, index) => (
	// 		<li
	// 			key={index}
	// 			className={`item ${validate(test) ? '-passed' : ''}`}>
	// 			{ message}
	// 		</li>
	// 	))}
	// </ul>
);

const InputField = () => {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const [valid, setValid] = useState(false);
  const [show, setModalIsOpen] = useState(false);
	const toggleModal = () => {
		setModalIsOpen(!show);
  };
  
  // RSuite inline style
  const styles = {
    width: 246
  };

	return (
    <>
      <FormGroup 
        // className={`field ${focused || value ? '-active' : ''} ${valid ? '-valid' : ''}`}
        className={`field`}
      >
        <ControlLabel className='label'>
          label
        </ControlLabel>
        <InputGroup className='input' style={styles}>
          <InputGroup.Addon>
            <Icon icon='avatar' />
          </InputGroup.Addon>
          {/* TODO: реализовать через <Input /> RSuite */}
          <input 
            // {...inputProps} 
            className='rs-input'
            icon 
          />
        </InputGroup>

        <IconButton
          size='xs'
          className='marker -info'
          onClick={toggleModal}
          icon={<Icon icon="question" />}
          color='blue'
          circle
        />

        <IconButton
          size='xs'
          className='marker -success'
          onClick={toggleModal}
          icon={<Icon icon="check" />}
          color='green'
          circle
        />
			</FormGroup>

      <Modal
        show={show} 
        onHide={toggleModal}
        className='rules-window'
        size='xs'
      >
        <Modal.Header>
          <Modal.Title>Правила</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Rules
            // conditions={conditions}
            // validate={valid}
            // focused={focused}
					/>
        </Modal.Body>
        <Modal.Footer>
					<Button onClick={toggleModal} appearance="primary">
						Понятно
					</Button>
        </Modal.Footer>
      </Modal>

    </>
	);
};

export default InputField;