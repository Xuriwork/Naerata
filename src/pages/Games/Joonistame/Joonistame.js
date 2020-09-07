import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Prompt } from 'react-router';
import Canvas from './Canvas';

//const dataURL = canvas.toDataURL();

const Joonistame = ({ history }) => {
	const { user } = useAuth();
	const [socket, setSocket] = useState({});
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState([]);
	const canvasRef = useRef();

	useEffect(() => {
		const _socket = new WebSocket('ws://127.0.0.1:8000', user.username);
		setSocket(_socket);

		const unlisten = history.listen(() => _socket.close());
		return () => unlisten;
	}, [user.username, history]);

	// useEffect(() => {
	//     if (socket.readyState === 1) {
	//       window.onbeforeunload = () => true;
	//     } else {
	//       window.onbeforeunload = undefined;
	//     };
	// }, [socket.readyState]);

	const draw = (x, y, brushColor) => {
		const context = canvasRef.current.getContext('2d');

		context.lineWidth = 6;
		context.lineCap = 'round';
		context.strokeStyle = brushColor;

		context.lineTo(x, y);
		context.stroke();
		context.beginPath();
		context.moveTo(x, y);
	};

	socket.onopen = () => console.log('WebSocket connection established.');
	socket.onclose = () => console.log('WebSocket connection closed.');
	socket.onerror = (error) => console.error(error.message);
	socket.onmessage = ({ data: serverData }) => {
		const data = JSON.parse(serverData);
		if (data.dataType === 1) {
			const _messages = [...messages];
			_messages.push(data);
			setMessages(_messages);
		} else if (data.dataType === 0) {
			draw(data.x , data.y, data.brushColor);
		}
	};

	// eslint-disable-next-line
	const reconnect = () => {
		if (socket) socket.close();
		const _socket = new WebSocket('ws://127.0.0.1:8000', user.pool.clientId);
		setSocket(_socket);
	};

	const handleOnChangeMessage = (e) => setMessage(e.target.value);
	const handleOnKeyDown = (e) => {
		if (e.keyCode === 13) return handleSendMessage(e);
	};

	const handleSendMessage = (e) => {
		e.preventDefault();

		if (socket.readyState === 0) return;
		if (message.trim() === '') return;

		const _message = JSON.stringify({ message, dataType: 1 })

		socket.send(_message);
		setMessage('');
	};

	return (
		<div className='drawing-game-page'>
			<Prompt
				when={socket.readyState === 1}
				message='Are you sure you want to leave?'
			/>
			<Canvas socket={socket} canvasRef={canvasRef} />
			<div className='drawing-game-message-container'>
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
