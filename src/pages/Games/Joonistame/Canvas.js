import React, { useEffect, useRef, useState } from 'react';
import ColorPalette from './ColorPalette';

const Canvas = ({ canvasRef, socket }) => {
	const canvasContainerRef = useRef();
	const [brushColor, setBrushColor] = useState('#444444');
	const [isDrawing, setIsDrawing] = useState(false);

	const inMemoryCanvas = document.createElement('canvas');
	const inMemoryContext = inMemoryCanvas.getContext('2d');

	const canvasContainer = canvasContainerRef.current;

	useEffect(() => {
		const canvasContainer = canvasContainerRef.current;
		const canvas = canvasRef.current;
		canvas.width = canvasContainer.clientWidth;
		canvas.height = canvasContainer.clientHeight;
	}, [canvasRef]);

	useEffect(() => {
		const resizeCanvas = () => {
			const canvas = canvasRef.current;
			const context = canvas.getContext('2d');
			inMemoryCanvas.width = canvas.width;
			inMemoryCanvas.height = canvas.height;
			inMemoryContext.drawImage(canvas, 0, 0);

			canvas.width = canvasContainer.clientWidth;
			canvas.height = canvasContainer.clientHeight;

			context.drawImage(inMemoryCanvas, 0, 0);
		};

		window.addEventListener('resize', resizeCanvas);

		return () => window.removeEventListener('resize', resizeCanvas);
	}, [canvasContainer, inMemoryCanvas, inMemoryContext, canvasRef]);

	const handleDraw = (e) => {
		if (!isDrawing) return;
		const canvas = canvasRef.current;

		const canvasCalculations = canvas.getBoundingClientRect();
		const offsetX = canvasCalculations.left;
		const offsetY = canvasCalculations.top;
		const mouseX = parseInt(e.clientX - offsetX);
		const mouseY = parseInt(e.clientY - offsetY);

		const paintData = {};

		paintData.dataType = 0;
		paintData.brushColor = brushColor;
		paintData.x = mouseX;
		paintData.y = mouseY;

		const data = JSON.stringify(paintData);
		socket.send(data);
	};

	const startLine = (e) => {
		setIsDrawing(true);
		handleDraw(e);
	};

	const finishLine = () => {
		const context = canvasRef.current.getContext('2d');
		setIsDrawing(false);
		context.beginPath();
	};

	return (
		<div ref={canvasContainerRef} className='canvas-container'>
			<ColorPalette setBrushColor={setBrushColor} />
			<canvas
				ref={canvasRef}
				onMouseDown={startLine}
				onMouseUp={finishLine}
				onMouseMove={handleDraw}
				height={400}
				width={400}
			></canvas>
		</div>
	);
};

export default Canvas;
