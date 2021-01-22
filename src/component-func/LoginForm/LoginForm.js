import React, { useState } from 'react';
import {
	Button,
	ButtonToolbar
} from 'rsuite'

import InputField from '../InputField/InputField';
import './LoginForm.scss';

const LoginForm = () => {
	const [valid, setValid] = useState(false);
	const [submitted, setSubmitted] = useState(false);

	const submitForm = (e) => {
		e.preventDefault();
		if (valid) { 
			setSubmitted(true); 
		}
	}

  return (
			<form
				className={`auth-form rs-form rs-form-vertical rs-form-fixed-width ${valid ? 'form_valid' : ''}`}
				onSubmit={submitForm}
      >

				<h1 className='title'>Form Title</h1>

				<InputField />


				<ButtonToolbar className='submit'>
					{ valid && !submitted && <Button className='button' appearance="primary" type="submit" valid>Отправить</Button>}
					{ !valid && !submitted && <Button className='button' appearance="primary" type="submit" disabled>Отправить</Button>}
					{ submitted && <Button className='button' appearance="primary" type="submit" loading>Отправить</Button>}
				</ButtonToolbar>

			</form>
  );
}

export default LoginForm;
