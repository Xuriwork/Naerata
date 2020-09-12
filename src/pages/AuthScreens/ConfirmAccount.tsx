import React, { useState } from 'react';
import notyf from '../../utils/notyf';
import { Redirect, useHistory, useLocation } from 'react-router-dom';
import { auth } from '../../services/firebase';

const ConfirmAccount = () => {
	const history = useHistory();
	const location = useLocation();

	const [confirmationCode, setConfirmationCode] = useState('');
	if (!(location.state && location.state.username)) return <Redirect to={{ pathname: '/sign-in' }} />;
	const username = location.state.username;

	const handleOnCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => setConfirmationCode(e.target.value);

	const handleResendConfirmationCode = async () => {
		try {
			await auth.currentUser.sendEmailVerification()
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
