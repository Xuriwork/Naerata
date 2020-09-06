import React from 'react';
import { useAuth } from '../../context/AuthContext';

const DrawingGame = () => {
	const { user } = useAuth();

	let websocketGame = {};
    console.log(websocketGame);

	if (window['WebSocket']) {
        websocketGame.socket = new WebSocket('ws://127.0.0.1:8000', user.pool.clientId);

		websocketGame.socket.onopen = (e) => {
			console.log('WebSocket connection established.');
		};

		websocketGame.socket.onclose = (e) => {
			console.log('WebSocket connection closed.');
        };
        
        websocketGame.socket.onmessage = (e) => {
            console.log(e.data);
        };
	}

	return <div>Test</div>;
};

export default DrawingGame;
