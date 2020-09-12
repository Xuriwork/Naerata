import React from 'react';
import { withRouter, Link, useHistory } from 'react-router-dom';
import firebase from 'firebase';
import { useAuth } from '../context/AuthContext';
import Logo from '../assets/images/icons/naerata_logo_beta_1_white.svg';

const Navbar = () => {
	const { isAuthed, setUser } = useAuth();
	const history = useHistory();

	const handleSignOut = async () => {
		await firebase.auth().signOut()
			.then(() => history.push('/sign-in'))
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
