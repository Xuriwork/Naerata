import React from 'react';
import { Auth } from 'aws-amplify';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import notyf from '../../utils/notyf';
import { useAuth } from '../../context/AuthContext';

const SignIn = ({ history }) => {
	const { register, handleSubmit, errors } = useForm();
	const { setUser } = useAuth();

	const handleSignIn = handleSubmit(async (data) => {
        const { username, password } = data;
		Auth.signIn(username, password)
		.then((user) => {
			setUser(user);
			history.push('/');
		})
		.catch((error) => {
			if (error.code === "UserNotConfirmedException") {
				Auth.resendSignUp(username);
				setTimeout(() => history.push({ pathname: '/confirm-account', state: { username } }), 2500);
				notyf.open({ 
					type: 'info', 
					message: 'User not confirmed, redirecting...' 
				});
				return;
			};
			notyf.error(error);
			console.error(error);
		});
	});

	return (
		<div className='sign-in-component'>
			<div>
				<form>
					<label>Username</label>
					<input
						type='text'
						name='username'
						placeholder='Enter your username'
						ref={register({ required: { value: true, message: 'This field is required' } })}
					/>
					<span className='form-input-error'>{errors.username && errors.username.message}</span>
					<label>Password</label>
					<input
						type='password'
						name='password'
						placeholder='Enter your password'
						ref={register({ required: { value: true, message: 'This field is required' } })}
					/>
					<span className='form-input-error'>{errors.password && errors.password.message}</span>
					<p style={{ marginTop: '5px', marginBottom: '6px' }}>
						Forgot password? <Link to='/forgot-password'>Reset password</Link>
					</p>
					<button onClick={handleSignIn} className='form-button'>Sign In</button>
					<p>
						New user? <Link to='/sign-up'>Create account</Link>
					</p>
				</form>
			</div>
		</div>
	);
};

export default SignIn;
