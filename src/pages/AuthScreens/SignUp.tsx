/* eslint-disable no-useless-escape */
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import notyf from '../../utils/notyf';
import { auth } from '../../services/firebase';

const SignUp = () => {
	const history = useHistory();
	const [focus, setFocus] = useState(false);
	const { register, handleSubmit, watch, errors } = useForm();

	const password = watch('password') || '';
	const passwordRequirements: { [requirement: string]: boolean } = {
		hasLowercaseLetters: password.search(/[a-z]/) > -1,
		hasUppercaseLetters: password.search(/[A-Z]/) > -1,
		hasNumbers: password.search(/\d/) > -1,
		hasSpecialCharacters:
			password.search(/[\s~`!@#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?()\._]/) > -1,
		isAtLeast8Characters: password.length >= 8,
	};

	const handleInputFocus = () => setFocus(true);
	const handleInputBlur = () => setFocus(false);

	const handleSignUp = handleSubmit(async (data) => {
		const { username, email, password } = data;

		const meetsAllRequirements = Object.keys(passwordRequirements).every((key) => passwordRequirements[key]);

		if (!meetsAllRequirements) return;

		await auth.createUserWithEmailAndPassword(email, password)
			.then(() => {
				setTimeout(
					() =>
						history.push({ pathname: '/confirm-account', state: { username } }),
					2500
				);
				notyf.open({
					type: 'info',
					message: 'User not confirmed, redirecting...',
				});
			})
			.catch((error: any) => {
				console.error(error);
				notyf.error(error);
			});
	});

	return (
		<div className='sign-up-component'>
			<div>
				<form>
					<label>Username</label>
						<input
							type='text'
							name='username'
							placeholder='Enter your username'
							ref={register({
								required: { value: true, message: 'This field is required' },
							})}
						/>
					<span className='form-input-error'>
						{errors.username && errors.username.message}
					</span>
					<label>Email</label>
					<input
						type='email'
						name='email'
						placeholder='Enter your email'
						ref={register({
							required: { value: true, message: 'This field is required' },
						})}
					/>
					<span className='form-input-error'>
						{errors.email && errors.email.message}
					</span>
					<label>Password</label>
					<div className='password-input-container'>
						<input
							type='password'
							name='password'
							placeholder='Enter your password'
							onFocus={handleInputFocus}
							onBlur={handleInputBlur}
							ref={register({
								required: { value: true, message: 'This field is required' },
								pattern: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*].{8,}$/,
							})}
						/>
						{focus && (
							<div className='password-requirments'>
								<h4>Password must meet the following requirements:</h4>
								<ul>
									<li>
										{passwordRequirements.hasLowercaseLetters ? (
											<span
												role='img'
												aria-label='Password contains at least one lowercase letter'
											>
												✔️
											</span>
										) : (
											<span
												role='img'
												aria-label='Password does not contain any lowercase letters'
											>
												❌
											</span>
										)}{' '}
										At least <strong>one lowercase</strong>
									</li>
									<li>
										{passwordRequirements.hasUppercaseLetters ? (
											<span
												role='img'
												aria-label='Password has uppercase letter'
											>
												✔️
											</span>
										) : (
											<span
												role='img'
												aria-label='Password does not contain any uppercase letters'
											>
												❌
											</span>
										)}{' '}
										At least <strong>one uppercase letter</strong>
									</li>
									<li>
										{passwordRequirements.hasNumbers ? (
											<span role='img' aria-label='Password contains a number'>
												✔️
											</span>
										) : (
											<span
												role='img'
												aria-label='Password does not contain any numbers'
											>
												❌
											</span>
										)}{' '}
										At least <strong>one number</strong>
									</li>
									<li>
										{passwordRequirements.hasSpecialCharacters ? (
											<span
												role='img'
												aria-label='Password contains special characters'
											>
												✔️
											</span>
										) : (
											<span
												role='img'
												aria-label="Password doesn't contain any special characters"
											>
												❌
											</span>
										)}{' '}
										At least <strong>one special characters</strong>
									</li>
									<li>
										{passwordRequirements.isAtLeast8Characters ? (
											<span
												role='img'
												aria-label='Password is at least 8 characters'
											>
												✔️
											</span>
										) : (
											<span
												role='img'
												aria-label="Password isn't at least 8 characters"
											>
												❌
											</span>
										)}{' '}
										At least <strong>8 characters</strong>
									</li>
								</ul>
							</div>
						)}
					</div>
					<span className='form-input-error'>
						{errors.password && errors.password.message}
					</span>
					<label>Confirm Password</label>
					<input
						type='password'
						name='confirm_password'
						placeholder='Confirm password'
						onFocus={handleInputFocus}
						onBlur={handleInputBlur}
						ref={register({
							required: { value: true, message: 'This field is required' },
							validate: (value) =>
								value === watch('password') || 'Passwords do not match',
						})}
					/>
					<span className='form-input-error'>
						{errors.confirm_password && errors.confirm_password.message}
					</span>
					<button onClick={handleSignUp} className='form-button'>
						Sign Up
					</button>
					<p>
						Already have an account? <Link to='/sign-in'>Sign In</Link>
					</p>
				</form>
			</div>
		</div>
	);
};

export default SignUp;
