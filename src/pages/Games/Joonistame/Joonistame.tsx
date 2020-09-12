import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Prompt, useHistory } from 'react-router';
import Canvas from './Canvas';
import DemoCanvas from './DemoCanvas';

//const dataURL = canvas.toDataURL();

type MessagesType = {
	author: string;
	content: string;
}

const Joonistame = () => {
	const history = useHistory();
	const { user } = useAuth();
	const [socket, setSocket] = useState<any>({});
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState<MessagesType[]>([]);

	useEffect(() => {
		const _socket = new WebSocket('ws://127.0.0.1:8000', user?.username);
		_socket.onopen = () => console.log('WebSocket connection established.');
		_socket.onclose = () => console.log('WebSocket connection closed.');
		_socket.onerror = (error: any) => console.error(error.message);
		_socket.onmessage = ({ data: serverData }) => {
			const data = JSON.parse(serverData);
			console.log(data);
			
			if (data.dataType === 1) {
				const _messages = [...messages];
				_messages.push(data);
				setMessages(_messages);
			}
		};
		setSocket(_socket);

		const unlisten = history.listen(() => _socket.close());
		return () => unlisten();
	}, [user, history, messages]);

	// useEffect(() => {
	//     if (socket.readyState === 1) {
	//       window.onbeforeunload = () => true;
	//     } else {
	//       window.onbeforeunload = undefined;
	//     };
	// }, [socket.readyState]);

	// eslint-disable-next-line
	const reconnect = () => {
		if (socket) socket.close();
		const _socket = new WebSocket('ws://127.0.0.1:8000', user.pool.clientId);
		setSocket(_socket);
	};

	const handleOnChangeMessage = (e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value);
	const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.keyCode === 13) return (e: React.MouseEvent) => handleSendMessage(e);
	};

	const handleSendMessage = (e: React.MouseEvent) => {
		e.preventDefault();

		if (socket.readyState === 0) return;
		if (message.trim() === '') return;

		const _message = JSON.stringify({ message, dataType: 1 })

		socket.send(_message);
		setMessage('');
	};

	return (
		<div className='joonistame-page'>
			<Prompt
				when={socket.readyState === 1}
				message='Are you sure you want to leave?'
			/>
			<DemoCanvas socket={socket} user={user.username} />
			<div className='joonistame-message-container'>
				<div className='messages-container'>
					{messages.map((message, index) => (
						<div
							className={
								message.author === 'SERVER_USER-JOINED'
									? 'SERVER_USER-JOINED message'
									: message.author === 'SERVER_USER-LEFT'
									? 'SERVER_USER-LEFT message'
									: 'message'
							}
							key={index}
						>
							{message.author === 'SERVER_USER-JOINED' ||
							message.author === 'SERVER_USER-LEFT' ? null : (
								<h4 className='message-author'>{message.author}</h4>
							)}
							<div className='message-content'>{message.content}</div>
						</div>
					))}
				</div>
				<div className='message-input-container'>
					<input
						type='text'
						value={message}
						onChange={handleOnChangeMessage}
						onKeyDown={handleOnKeyDown}
						placeholder='Say something'
					/>
					<button onClick={handleSendMessage}>Send</button>
				</div>
			</div>
		</div>
	);
};

export default Joonistame;
