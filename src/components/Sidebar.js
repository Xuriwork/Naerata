import React from 'react';
import { Link } from 'react-router-dom';

import VoiceChatIcon from '../assets/icons/chat-voice-icon.svg';
import ChatIcon from '../assets/icons/chat-icon.svg';
import GamepadIcon from '../assets/icons/gamepad-icon.svg';
import HomeIcon from '../assets/icons/home-icon.svg';

const Sidebar = () => {
	return (
		<div className='sidebar-component'>
			<div className='list'>
				<Link to='/'>
					<button>
						<img src={HomeIcon} alt='home' />
					</button>
					Home
				</Link>
				<Link to='/games'>
					<button>
						<img src={GamepadIcon} alt='games' />
					</button>
					Games
				</Link>
				<Link to='/chat'>
					<button>
						<img src={ChatIcon} alt='chat' />
					</button>
					Chat
				</Link>
				<Link to='/voice-chat'>
					<button>
						<img src={VoiceChatIcon} alt='voice chat' />
					</button>
					Voice chat
				</Link>
			</div>
		</div>
	);
};

export default Sidebar;
