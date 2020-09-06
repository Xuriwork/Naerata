import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const DrawingGame = () => {
	const { user } = useAuth();
	const [socket, setSocket] = useState({});
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

	useEffect(() => {
        const _socket = new WebSocket('ws://127.0.0.1:8000', user.username);
        setSocket(_socket);
    }, [user.username]);

    socket.onopen = () => console.log('WebSocket connection established.');
    socket.onclose = () => console.log('WebSocket connection closed.');
    socket.onerror = (error) => console.error(error.message);
    socket.onmessage = (message) => {
        const _messages = [...messages];
        const _message = JSON.parse(message.data);
        _messages.push(_message);
        setMessages(_messages);
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

		socket.send(message);
		setMessage('');
	};

	return (
		<div className='drawing-game-page'>
			<div className='drawing-game-message-container'>
				<div className='messages-container'>
					{messages.map((message, index) => (
						<div
							className={message.author === 'SERVER' ? 'SERVER message' : 'message'}
							key={index}
						>
							<h4 className='message-author'>{message.author}:</h4>
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

export default DrawingGame;
