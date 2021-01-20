import React from 'react';

import {
	Form,
	FormGroup,
	FormControl,
	ControlLabel,
	Input,
	InputGroup,
	Icon,
	Button,
	ButtonToolbar
} from 'rsuite'

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
		const { label, icon, conditions, type = 'text', index } = this.props;
		const { focused, value, valid } = this.state;

		const styles = {
			width: 246
		};

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
			<FormGroup className='form__row'>
				<ControlLabel className={
					`textbox ${focused || value ? 'textbox_active' : ''} ${valid ? 'textbox_valid' : ''}`
				}>
					<span className='textbox__label'>{ label }</span>
					<InputGroup style={styles}>
						<InputGroup.Addon>
							<Icon icon={icon} />
						</InputGroup.Addon>
						<input {...inputProps} className='rs-input textbox__input' />
					</InputGroup>
					<span className='icon'>
						<svg
							className='icon__checkmark'
							viewBox="0 0 32 32"
							xmlns="http://www.w3.org/2000/svg">
						  <path d="M 3.507 16.935 L 13.68 25.589 L 28.493 6.411"/>
						</svg>
					</span>
				</ControlLabel>
				<div className='form__rules'>
					<Rules
						conditions={ conditions }
						validate={ this.validate }
						focused={ this.state.focused }
					/>
				</div>
			</FormGroup>
		);
	};
}

const Rules = ({ conditions, validate, focused }) => (
	<ul className={`rules ${!focused ? 'rules_is-hidden' : ''}`}>
		{conditions.map(({ message, test }, index) => (
			<li
				key={index}
				className={`rules__item ${validate(test) ? 'rules__item_passed' : ''}`}>
				{ message}
			</li>
		))}
	</ul>
);

const Submit = ({ valid }) => (
	<Button 
		valid={valid} disabled={!valid} 
		appearance="primary" 
		type="submit"
	>
		Отправить
	</Button>
);

class RSForm extends React.Component {
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
			// rs-form form form-rsuite  rs-form-vertical rs-form-fixed-width
			<form
				className={`rs-form form form-rsuite rs-form-vertical rs-form-fixed-width ${valid ? 'form_valid' : ''}`}
				onSubmit={this.submitForm}>

				{inputs.map((props, index) => (
					<Textbox
						key={index}
						index={index}
						updateFormStatus={this.updateFormStatus.bind(null, index)}
						{...props}
					/>
				))}


				<ButtonToolbar className='form__submit'>
					<Submit valid={ valid }/>
					<div
						className={`form__success ${submitted ? 'form__success_is-active' : ''}`}
						role='alert'
					>
						Успех!
					</div>
				</ButtonToolbar>
			</form>
		);
	}
}

const testLength = length => ({
	test: value => value.length >= length,
	message: `Длина должна быть больше ${length} символов`
});

const conditions = {
	containLowercase: {
		test: value => new RegExp(/[a-z]/).test(value),
		message: 'Должен содержать 1 строчный символ'
	},
	containUppercase: {
		test: value => new RegExp(/[A-Z]/).test(value),
		message: 'Должен содержать 1 заглавный символ'
	},
	startWithUppercase: {
		test: value => new RegExp(/[A-Z]/).test(value.charAt(0)),
		message: 'Должно начинаться с заглавной буквы'
	},
	mail: {
		test: value => new RegExp(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/).test(value),
		message: 'Должен быть действительный адрес электронной почты'
	}
};

const inputs = [
	{
		label: 'Ваше имя',
		icon: 'avatar',
		conditions: [
			conditions.startWithUppercase,
			conditions.containLowercase,
			testLength(2)
		]
	},
	{
		label: 'Логин',
		icon: 'avatar',
		conditions: [
			conditions.containUppercase,
			conditions.containLowercase,
			testLength(6)
		],
	},
	{
		label: 'Email',
		icon: 'avatar',
		conditions: [conditions.mail],
		type: 'email'
	}
];

function RSuiteForm() {

	return (
		<RSForm inputs={inputs} />
	);
}

export default RSuiteForm;