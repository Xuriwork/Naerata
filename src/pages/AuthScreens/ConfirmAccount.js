import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import notyf from '../../utils/notyf';
import { Redirect } from 'react-router-dom';

const ConfirmAccount = ({ location, history }) => {
	const [confirmationCode, setConfirmationCode] = useState('');
	if (!(location.state && location.state.username)) return <Redirect to={{ pathname: '/sign-in' }} />;
	const username = location.state.username;

	const handleOnCodeChange = (e) => setConfirmationCode(e.target.value);

	const handleConfirmSignUp = async (e) => {
		e.preventDefault();

		await Auth.confirmSignUp(username, confirmationCode)
		.then(() => {
			notyf.success('User confirmed, redirecting to sign in');
			history.push('/');
		})
		.catch((error) => console.log('Error confirming sign up', error));
	};

	const handleResendConfirmationCode = async () => {
		try {
			await Auth.resendSignUp(username);
			notyf.open({ type: 'info', message: 'Confirmation code sent' });
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<div className='confirm-account-component'>
			<div>
				<h2>Check your email</h2>
				<p>We've sent you a 6 digit confirmation code</p>
				<form>
					<label>Confirmation Code</label>
					<input
						type='number'
						name='confirmation_code'
						onChange={handleOnCodeChange}
						style={{ marginTop: '2px', marginBottom: 0 }}
					/>
					<button onClick={handleConfirmSignUp} className='form-button'>
						Confirm
					</button>
					<p
						onClick={handleResendConfirmationCode}
						className='resend-confirmation-code-button'
					>
						Resend Confirmation Code
					</p>
				</form>
			</div>
		</div>
	);
};

export default ConfirmAccount;
