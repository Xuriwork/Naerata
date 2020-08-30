import React from 'react';
import { withRouter, Link } from 'react-router-dom';

import VoiceChatIcon from '../assets/icons/chat-voice-icon.svg';
import ChatIcon from '../assets/icons/chat-icon.svg';
import GamepadIcon from '../assets/icons/gamepad-icon.svg';
import HomeIcon from '../assets/icons/home-icon.svg';

const Tab = ({ name, path, icon, activeTab, location }) => {
	const active = activeTab === path ? 'active' : null;

	return (
		<Link to={path} className={active}>
			<button>
				<img src={icon} alt={name} />
			</button>
			{name}
		</Link>
	);
};

const Sidebar = ({ location }) => {
	const activeTab = location.pathname;

	return (
		<div className='sidebar-component'>
			<div className='sidebar-tabs'>
				<Tab path='/' name='Home' icon={HomeIcon} activeTab={activeTab} />
				<Tab path='/games' name='Games' icon={GamepadIcon} activeTab={activeTab} />
				<Tab path='/chat' name='Chat' icon={ChatIcon} activeTab={activeTab} />
				<Tab path='/voice-chat' name='Voice chat' icon={VoiceChatIcon} activeTab={activeTab} />
			</div>
		</div>
	);
};

export default withRouter(Sidebar);
