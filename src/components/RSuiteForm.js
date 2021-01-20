import React from 'react';
import './RSuiteForm.scss';

class Textbox extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			value: '',
			focused: false,
			valid: false
		};
		
		this.handleChange = this.handleChange.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
		this.validate = this.validate.bind(this);
	}
	
	componentDidMount() {
		if (this.props.index === 0) {
			this.firstInput.focus();
		}
	}
	
	handleChange(e) {
		const value = e.target.value;
		const { conditions, updateFormStatus } = this.props;
		
		const valid = conditions.every(({ test }) => test(value));
		if (valid !== this.state.valid) {
			updateFormStatus(valid);
		}
		this.setState({
			value,
			valid
		})
	}
	
	handleFocus(focused) {
		this.setState({
			focused
		})
	}
	
	validate(condition) {
		return condition(this.state.value);
	}

	render() {
		const { label, conditions, type = 'text', index } = this.props;
		const { focused, value, valid } = this.state;

		const inputProps = {
			onChange: this.handleChange,
			onFocus: this.handleFocus.bind(null, true),
			onBlur: this.handleFocus.bind(null, false),
			className: 'textbox__input',
			type: type
		};
		
		if (index === 0) {
			inputProps.ref = input => {
				this.firstInput = input
			};
		}
		
		return (
			<div className='form__row'>
				<label className={
					`textbox ${focused || value ? 'textbox_active' : ''} ${valid ? 'textbox_valid' : ''}`
					}>
					<span className='textbox__label'>{ label }</span>
					<input { ...inputProps } />
					<span className='icon'>
						<svg
							className='icon__checkmark'
							viewBox="0 0 32 32"
							xmlns="http://www.w3.org/2000/svg">
						  <path d="M 3.507 16.935 L 13.68 25.589 L 28.493 6.411"/>
						</svg>
					</span>
				</label>
				<div className='form__rules'>
					<Rules
						conditions={ conditions }
						validate={ this.validate }
						focused={ this.state.focused }
					/>
				</div>
			</div>
		);
	};
}

const Rules = ({ conditions, validate, focused }) => (
	<ul className={`rules ${!focused ? 'rules_is-hidden' : ''}`}>
		{conditions.map(({ message, test }, index) => (
			<li
				key={ index }
				className={`rules__item ${validate(test) ? 'rules__item_passed' : ''}`}>
				{ message }
			</li>
		))}
	</ul>
);

const Submit = ({ valid }) => (
	<button
		className='button'
		type='submit'
		disabled={ !valid }>
		Submit
	</button>
);

class Form extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			valid: false,
			els: props.inputs.map(_ => false),
			submitted: false
		};
		
		this.updateFormStatus = this.updateFormStatus.bind(this);
		this.submitForm = this.submitForm.bind(this);
	}
	
	updateFormStatus(index, state) {
		const status = [...this.state.els];

		status[index] = state;

		this.setState({
			els: status,
			valid: status.every(x => x)
		});
		
	}
	
	submitForm(e) {
		e.preventDefault();
		
		if (this.state.valid) {
			this.setState({
				submitted: true
			});
		}
	}
	
	render() {
		const { inputs } = this.props;
		const { valid, submitted } = this.state;

		return (
			<form 
				className={`form ${valid ? 'form_valid' : ''}`}
				onSubmit={this.submitForm}>
				<h1 className='form__title'>Sign up</h1>
				{inputs.map((props, index) => (
					<Textbox
						key={ index }
						index={ index }
						updateFormStatus={ this.updateFormStatus.bind(null, index) }
						{ ...props }
					/>
				))}
				<div className='form__submit'>
					<Submit valid={ valid }/>
					<div 
						className={`form__success ${submitted ? 'form__success_is-active' : ''}`}
						role='alert'>
						Success message
						<span className='icon'>
							<svg
								className='icon__checkmark'
								viewBox="0 0 32 32"
								xmlns="http://www.w3.org/2000/svg">
							  <path d="M 3.507 16.935 L 13.68 25.589 L 28.493 6.411"/>
							</svg>
						</span>
					</div>
				</div>
			</form>
		);
	}
}

const testLength = length => ({
	test: value => value.length >= length,
	message: `Length must be greater than ${length} characters` 
});

const conditions = {
 	containLowercase: {
		test: value => new RegExp(/[a-z]/).test(value),
		message: 'Should contain 1 lowercase character'
	},
	containUppercase: {
		test: value => new RegExp(/[A-Z]/).test(value),
		message: 'Should contain 1 uppercase character'
	},	
	startWithUppercase: {
		test:  value => new RegExp(/[A-Z]/).test(value.charAt(0)),
		message: 'Should start with uppercase letter'
	},
	mail: {
		test: value => new RegExp(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/).test(value),
		message: 'Must be a valid email address'
	}
};

const inputs = [
	{
		label: 'Your name',
		conditions: [
			conditions.startWithUppercase, 
			conditions.containLowercase,
			testLength(2)
		]
	},
	{
		label: 'Username',
		conditions: [
			conditions.containUppercase, 
			conditions.containLowercase, 
			testLength(6)
		],
	},
	{
		label: 'Email',
		conditions: [conditions.mail],
		type: 'email'
	}
];

function RSuiteForm() {
	
  return (
	<Form inputs={ inputs } />
  );
}

export default RSuiteForm;