import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import notyf from '../../utils/notyf';
import { useAuth } from '../../context/AuthContext';
import { auth } from '../../services/firebase';

const SignIn = () => {
	const history = useHistory();
	const { register, handleSubmit, errors } = useForm();
	const { setUser } = useAuth();

	const handleSignIn = handleSubmit(async (data) => {
        const { username, password } = data;
		auth.signInWithEmailAndPassword(username, password)
		.then((user: any) => {
			if (user.emailVerified) {
				setUser(user);
				history.push('/');
			} else {
				history.push('/confirm-account');
			}
		})
		.catch((error: any) => {
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
