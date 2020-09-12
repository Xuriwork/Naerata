import React, { useState } from 'react';
import { useHistory } from 'react-router';
import notyf from '../../utils/notyf';
import { auth } from '../../services/firebase';

const ForgotPassword = () => {
	const history = useHistory();

	const [email, setEmail] = useState('');
	const [emailSent, setEmailSent] = useState(false);
	const [verificationCode, setVerificationCode] = useState('');
	const [newPassword, setNewPassword] = useState('');

	const handleOnEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
	const handleOnVerificationCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => setVerificationCode(e.target.value);
	const handleOnNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value);

	const handleSendResetPasswordVerificationCode = async () => {
		try {
			await auth.sendPasswordResetEmail(email);
			notyf.open({ type: 'info', message: 'Verification code sent' });
			setEmailSent(true);
		} catch (error) {
			console.log('Error resending code: ', error);
		}
	};

	const handleChangePassword = async (e: MouseEvent) => {
		e.preventDefault();
		try {
			await auth.confirmPasswordReset(verificationCode, newPassword);
			setTimeout(() => history.push('/'), 2500);
			notyf.success('Password reset successful, redirecting...');
		} catch (error) {
			console.log('Error confirming sign up', error);
		}
	};

	return (
		<div className='forgot-password-component'>
			<div>
				<h2>Reset your Password</h2>
				<form>
					{emailSent ? (
						<>
							<label>Verification Code</label>
							<input
								type='text'
								name='verification_code'
								onChange={handleOnVerificationCodeChange}
								style={{ marginTop: '2px', marginBottom: 0 }}
							/>
							<label>New Password</label>
							<input
								type='text'
								name='new_password'
								onChange={handleOnNewPasswordChange}
								style={{ marginTop: '2px', marginBottom: 0 }}
							/>
							<button onClick={handleChangePassword} className='form-button'>
								Change Password
							</button>
						</>
					) : (
						<>
							<label>Email Address</label>
							<input
								type='email'
								name='email'
								onChange={handleOnEmailChange}
								style={{ marginTop: '2px', marginBottom: 0 }}
							/>
							<button
								onClick={handleSendResetPasswordVerificationCode}
								className='form-button'
							>
								Send email
							</button>
						</>
					)}
				</form>
			</div>
		</div>
	);
};

export default ForgotPassword;
