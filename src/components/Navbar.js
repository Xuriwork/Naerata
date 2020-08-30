import React from 'react';
import { Auth } from 'aws-amplify';
import { withRouter, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../assets/images/icons/naerata_logo_beta_1_white.svg';

const Navbar = ({ history }) => {
	const { isAuthed, setUser } = useAuth();

	const handleSignOut = async () => {
		await Auth.signOut()
			.then(() => {
				setUser(null);
				history.push('/sign-in');
			})
			.catch((error) => console.error('Error signing out: ', error));
	};

	return (
		<nav className='navbar'>
			<img src={Logo} alt='logo' className='logo' />
			<div className='auth-buttons-container'>
				{isAuthed ? (
					<button className='sign-out-button' onClick={handleSignOut}>Sign Out</button>
				) : (
					<>
						<Link to='/sign-in' className='sign-in-button'>Sign In</Link>
						<Link to='/sign-up' className='sign-up-button'>Sign Up</Link>
					</>
				)}
			</div>
		</nav>
	);
};

export default withRouter(Navbar);
