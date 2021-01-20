import React from 'react';

import {
	Form,
	FormGroup,
	FormControl,
	InputGroup,
	Icon,
	Button,
	ButtonToolbar
} from 'rsuite'

import './RSuiteForm.scss';
  


function TextField(props) {
	const { name, icon, accepter, ...rest } = props;
	const styles = { width: 246 };
  
	return (
	  <FormGroup>
		<InputGroup style={styles}>
		  <InputGroup.Addon>
			<Icon icon={icon} />
		  </InputGroup.Addon>
		  <FormControl name={name} accepter={accepter} {...rest} />
		</InputGroup>
	  </FormGroup>
	);
  }


class RSForm extends React.Component {
	// constructor(props) {
	// 	super(props);
		
	// 	this.state = {
	// 		valid: false,
	// 		els: props.inputs.map(_ => false),
	// 		submitted: false
	// 	};
		
	// 	this.updateFormStatus = this.updateFormStatus.bind(this);
	// 	this.submitForm = this.submitForm.bind(this);
	// }
	
	render() {

		return (
			<Form
				autoComplete='off'
				className='form form-rsuite'
			>
				<TextField name='username' icon='avatar' placeholder='TEST' />
				<TextField name='password' icon='lock' placeholder='TEST' />
				<ButtonToolbar>
					<Button appearance="primary" type="submit">
						Кнопка
					</Button>
				</ButtonToolbar>
			</Form>
		);
	}
}


function RSuiteForm() {
	
  return (
	<RSForm />
  );
}

export default RSuiteForm;