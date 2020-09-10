import React, { useEffect, useState, useRef } from 'react';
import ColorPalette from './ColorPalette';

const Canvas = ({ user, socket }) => {
	const canvasRef = useRef(null);
	const canvasContainerRef = useRef();

	const [prevPos, setPrevPos] = useState({ offsetX: 0, offsetY: 0 });
	const [context, setContext] = useState(null);
	const [isPainting, setIsPainting] = useState(false);
	const [line, setLine] = useState([]);
	const [brushColor, setBrushColor] = useState('#444444');

	socket.onmessage = ({ data: serverData }) => {
		const data = JSON.parse(serverData);
		if (data.dataType === 0) {
			const { prevPos, currPos, strokeStyle } = data;
			paint(prevPos, currPos, strokeStyle);
		}
	};

	const onMouseDown = ({ nativeEvent }) => {
		const { offsetX, offsetY } = nativeEvent;
		setIsPainting(true);
		setPrevPos({ offsetX, offsetY });
	};

	const onMouseMove = ({ nativeEvent }) => {
		if (isPainting) {
			const { offsetX, offsetY } = nativeEvent;
			const offSetData = { offsetX, offsetY };

			const positionData = {
				start: { ...prevPos },
				stop: { ...offSetData },
			};

			setLine(line.concat(positionData));
			paint(prevPos, offSetData, brushColor);
		}
	};

	const endPaintEvent = () => {
		if (isPainting) {
			setIsPainting(false);
			sendPaintData();
		}
	};

	const paint = (prevPos, currPos, strokeStyle) => {
		const context = canvasRef.current.getContext('2d');

		const { offsetX, offsetY } = currPos;
		const { offsetX: x, offsetY: y } = prevPos;

		context.beginPath();
		context.strokeStyle = strokeStyle;
		context.moveTo(x, y);
		context.lineTo(offsetX, offsetY);
		context.stroke();
		setPrevPos({ offsetX, offsetY });
	};

	// const paint = (prevPos, currPos, strokeStyle) => {
	// 	const { offsetX, offsetY } = currPos;
	// 	const { offsetX: x, offsetY: y } = prevPos;

	// 	context.beginPath();
	// 	context.strokeStyle = strokeStyle;
	// 	context.moveTo(x, y);
	// 	context.lineTo(offsetX, offsetY);
	// 	context.stroke();
	// 	setPrevPos({ offsetX, offsetY });
	// };

	const sendPaintData = async () => {
		const paintData = {
			line,
			user,
			dataType: 0,
			strokeStyle: brushColor
		};
		const data = JSON.stringify(paintData);
		console.log(paintData);
		socket.send(data);
		setLine([]);
	};

	useEffect(() => {
		const canvas = canvasRef.current;
		const canvasContainer = canvasContainerRef.current;
		
		canvas.width = canvasContainer.clientWidth;
		canvas.height = canvasContainer.clientHeight;

		const _context = canvas.getContext('2d');
		_context.lineJoin = 'round';
		_context.lineCap = 'round';
		_context.lineWidth = 5;
		setContext(_context);
	}, [context]);

	return (
		<div ref={canvasContainerRef} className='canvas-container'>
			<ColorPalette setBrushColor={setBrushColor} />
			<canvas
				ref={canvasRef}
				style={{ background: '#afafaf' }}
				onMouseDown={onMouseDown}
				onMouseLeave={endPaintEvent}
				onMouseUp={endPaintEvent}
				onMouseMove={onMouseMove}
			/>
		</div>
	);
};
export default Canvas;
