import React from 'react';
import { withRouter, Link } from 'react-router-dom';

import VoiceChatIcon from '../assets/icons/chat-voice-icon.svg';
import ChatIcon from '../assets/icons/chat-icon.svg';
import GamepadIcon from '../assets/icons/gamepad-icon.svg';
import HomeIcon from '../assets/icons/home-icon.svg';
import UserIcon from '../assets/icons/user-icon.svg';
import SettingsIcon from '../assets/icons/settings-icon.svg';

const Tab = ({ name, path, icon, activeTab }) => {
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
				<Tab path='/settings/character-editor' name='Editor' icon={UserIcon} activeTab={activeTab} />
				<Tab path='/settings' name='Settings' icon={SettingsIcon} activeTab={activeTab} />
			</div>
		</div>
	);
};

export default withRouter(Sidebar);
