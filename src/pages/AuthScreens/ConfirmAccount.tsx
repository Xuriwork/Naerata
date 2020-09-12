import React from 'react';
import notyf from '../../utils/notyf';
import { auth } from '../../services/firebase';

const ConfirmAccount = () => {
	const handleResendConfirmationCode = async () => {
		
		try {
			await auth.currentUser?.sendEmailVerification()
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
