import React from 'react';

const Games = ({ history }) => {

    const handlePickGame = () => {
        history.push('/games/drawing-game')
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
