import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const DrawingGame = () => {
    const { user } = useAuth();
    const [game, setGame] = useState({});
	const [message, setMessage] = useState('');
    
    useEffect(() => {
        if (window['WebSocket']) {
            game.socket = new WebSocket('ws://127.0.0.1:8000', user.pool.clientId);
    
            game.socket.onopen = (e) => {
                console.log('WebSocket connection established.');
            };
    
            game.socket.onclose = (e) => {
                console.log('WebSocket connection closed.');
            };
    
            game.socket.onmessage = (e) => {
                console.log(e.data);
            };
        }
    }, []);
    
    const handleOnChangeMessage = (e) => setMessage(e.target.value);
	const handleSendMessage = (e) => {
        e.preventDefault();

        if (message.trim() === '') return;
        console.log(message);

        game.socket.send(message);
        setMessage('');
	};

	return (
		<div className='drawing-game-page'>
            <div className='message-input-container'>
			    <input type='text' value={message} onChange={handleOnChangeMessage} />
                <button onClick={handleSendMessage}>Send Message</button>
            </div>
		</div>
	);
};

export default DrawingGame;
