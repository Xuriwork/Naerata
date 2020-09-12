import React from 'react';
import { useHistory } from 'react-router';

const Games = () => {
	const history = useHistory();

    const handlePickGame = () => {
        history.push('/games/joonistame')
    };

	return (
		<div className='games-component'>
			<h1>All Games</h1>
			<div className='games-container'>
				<div className='game-card' onClick={handlePickGame}>
					Joonistame
				</div>
			</div>
		</div>
	);
};

export default Games;
