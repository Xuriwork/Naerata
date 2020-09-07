import React, { useEffect, useRef, useState } from 'react';
import ColorPalette from './ColorPalette';

const Canvas = () => {
	const canvasContainerRef = useRef();
	const canvasRef = useRef();
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
	}, []);

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

	}, [canvasContainer, inMemoryCanvas, inMemoryContext]);

	const handleDraw = (e) => {
		if (!isDrawing) return;
		const canvas = canvasRef.current;
		const context = canvasRef.current.getContext('2d');
		context.lineWidth = 6;
		context.lineCap = 'round';
		context.strokeStyle = brushColor;

		const canvasCalculations = canvas.getBoundingClientRect();

		const offsetX = canvasCalculations.left;
		const offsetY = canvasCalculations.top;

		const mouseX = parseInt(e.clientX - offsetX);
		const mouseY = parseInt(e.clientY - offsetY);

		context.lineTo(mouseX, mouseY);
		context.stroke();
		context.beginPath();
		context.moveTo(mouseX, mouseY);
	};

	const startDrawing = (e) => {
		setIsDrawing(true);
		handleDraw(e);
	};

	const finishDrawing = () => {
		const context = canvasRef.current.getContext('2d');
		setIsDrawing(false);
		context.beginPath();
	};

	return (
		<div ref={canvasContainerRef} className='canvas-container'>
			<ColorPalette setBrushColor={setBrushColor} />
			<canvas
				ref={canvasRef}
				onMouseDown={startDrawing}
				onMouseUp={finishDrawing}
				onMouseMove={handleDraw}
				height={400}
				width={400}
			></canvas>
		</div>
	);
};

export default Canvas;