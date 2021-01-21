import React from 'react';

import {
	FormGroup,
	ControlLabel,
	InputGroup,
	Icon,
	IconButton,
	Button,
	ButtonToolbar,
	Modal,
} from 'rsuite'

import './RSuiteForm.scss';

class Textbox extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			value: '',
			focused: false,
			valid: false,
			show: false
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
		this.validate = this.validate.bind(this);

		// modal
		this.close = this.close.bind(this);
		this.open = this.open.bind(this);
	}

	close() {
		this.setState({ show: false });
	}

	open() {
		this.setState({ show: true });
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

		// RSuite inline style
		const styles = {
			width: 246
		};

		const inputProps = {
			onChange: this.handleChange,
			onFocus: this.handleFocus.bind(null, true),
			onBlur: this.handleFocus.bind(null, false),
			// className: 'textbox__input',
			type: type
		};

		if (index === 0) {
			inputProps.ref = input => {
				this.firstInput = input
			};
		}

		return (
			<>
				<FormGroup className={
					`field ${focused || value ? '-active' : ''} ${valid ? '-valid' : ''}`
				}>
					<ControlLabel className='label'>
						{label}
					</ControlLabel>
					<InputGroup className='input' style={styles}>
						<InputGroup.Addon>
							<Icon icon={icon} />
						</InputGroup.Addon>
						<input {...inputProps} className='rs-input' />
					</InputGroup>

					<IconButton
						size='xs'
						className='marker -info'
						onClick={this.open}
						icon={<Icon icon="question" />}
						color='blue'
						circle
					/>

					<IconButton
						size='xs'
						className='marker -success'
						onClick={this.open}
						icon={<Icon icon="check" />}
						color='green'
						circle
					/>



				</FormGroup>

				<Modal className='rules-window' size='xs' show={this.state.show} onHide={this.close}>
					<Modal.Header>
						<Modal.Title>Правила</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Rules
							conditions={conditions}
							validate={this.validate}
							focused={this.state.focused}
						/>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.close} appearance="primary">
							Понятно
						</Button>
					</Modal.Footer>
				</Modal>
			</>
		);
	};
}

const Rules = ({ conditions, validate, focused }) => (
	<ul className={`rules ${!focused ? 'rules_is-hidden' : ''}`}>
		{conditions.map(({ message, test }, index) => (
			<li
				key={index}
				className={`item ${validate(test) ? '-passed' : ''}`}>
				{ message}
			</li>
		))}
	</ul>
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
				className={`auth-form rs-form rs-form-vertical rs-form-fixed-width ${valid ? 'form_valid' : ''}`}
				onSubmit={this.submitForm}>

				<h1 className='title'>Form Title</h1>

				{inputs.map((props, index) => (
					<Textbox
						key={index}
						index={index}
						updateFormStatus={this.updateFormStatus.bind(null, index)}
						{...props}
					/>
				))}


				<ButtonToolbar className='submit'>
					{ valid && !submitted && <Button className='button' appearance="primary" type="submit" valid>Отправить</Button>}
					{ !valid && !submitted && <Button className='button' appearance="primary" type="submit" disabled>Отправить</Button>}
					{ submitted && <Button className='button' appearance="primary" type="submit" loading>Отправить</Button>}
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
		test: value => new RegExp(/[а-яa-z]/).test(value),
		message: 'Должен содержать 1 строчный символ'
	},
	containUppercase: {
		test: value => new RegExp(/[А-ЯA-Z]/).test(value),
		message: 'Должен содержать 1 заглавный символ'
	},
	startWithUppercase: {
		test: value => new RegExp(/[А-ЯA-Z]/).test(value.charAt(0)),
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
		icon: 'at',
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