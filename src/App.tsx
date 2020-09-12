import React from 'react';

import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import { ProtectedRoute, PublicRoute } from './components/Routes';
import { useAuth } from './context/AuthContext';

import './App.scss';
import 'notyf/notyf.min.css';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import VoiceChat from './pages/VoiceChat';
import Chat from './pages/Chat';
import Games from './pages/Games/Games';
import Joonistame from './pages/Games/Joonistame/Joonistame';
import Settings from './pages/Settings';
import ForgotPassword from './pages/AuthScreens/ForgotPassword';
import ConfirmAccount from './pages/AuthScreens/ConfirmAccount';
import SignIn from './pages/AuthScreens/SignIn';
import SignUp from './pages/AuthScreens/SignUp';
import NotFound from './pages/NotFound';
import CharacterEditor from './pages/CharacterEditor/CharacterEditor';

import Canvas from './pages/Games/Joonistame/DemoCanvas';

const App = () => {
	const { user, isAuthed } = useAuth();
	console.log(user);

	return (
		<Router>
			<Navbar />
			<div className='app-component'>
				{ isAuthed && <Sidebar /> }
				<div className='pages-container' style={{ width: isAuthed ? 'calc(100% - 250px)' : '100%' }}>
					<Switch>
						<ProtectedRoute exact path='/' component={Home} />
						<ProtectedRoute path='/games/joonistame' component={Joonistame} />
						<ProtectedRoute path='/games/demo' component={Canvas} />
						<ProtectedRoute path='/games' component={Games} />
						<ProtectedRoute path='/chat' component={Chat} />
						<ProtectedRoute path='/voice-chat' component={VoiceChat} />
						<ProtectedRoute
							path='/settings/character-editor'
							component={CharacterEditor}
						/>
						<ProtectedRoute path='/settings' component={Settings} />
						<PublicRoute path='/sign-up' component={SignUp} restricted={true} />
						<PublicRoute path='/sign-in' component={SignIn} restricted={true} />
						<PublicRoute
							path='/confirm-account'
							component={ConfirmAccount}
							restricted={true}
						/>
						<PublicRoute
							path='/forgot-password'
							component={ForgotPassword}
							restricted={true}
						/>
						<Route component={NotFound} />
					</Switch>
				</div>
			</div>
		</Router>
	);
};

export default App;
