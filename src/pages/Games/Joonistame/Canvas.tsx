import React, { useEffect, useRef, useState } from 'react';
import ColorPalette from './ColorPalette';

type CanvasProps = {
	canvasRef: any;
	socket: any;
};

type PaintDataType = { 
	dataType: number; 
	brushColor: string; 
	x: number; 
	y: number;
};

const Canvas = ({ canvasRef, socket }: CanvasProps) => {
	const canvasContainerRef = useRef<HTMLDivElement>(null);
	const [brushColor, setBrushColor] = useState('#444444');
	const [isDrawing, setIsDrawing] = useState(false);

	useEffect(() => {
		const canvasContainer = canvasContainerRef.current;
		const canvas = canvasRef.current;
		canvas.width = canvasContainer?.clientWidth;
		canvas.height = canvasContainer?.clientHeight;
	}, [canvasRef]);

	const handleDraw = (e: MouseEvent) => {
		if (!isDrawing) return;
		const canvas = canvasRef.current;

		const canvasCalculations = canvas.getBoundingClientRect();
		const offsetX = canvasCalculations.left;
		const offsetY = canvasCalculations.top;
		const mouseX = parseInt(String(e.clientX - offsetX));
		const mouseY = parseInt(String(e.clientY - offsetY));

		const paintData: PaintDataType = {
			dataType: 0,
			brushColor,
			x: mouseX,
			y: mouseY,
		};


		const data = JSON.stringify(paintData);
		socket.send(data);
	};

	const startLine = (e: MouseEvent) => {
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
				onMouseDown={() => startLine}
				onMouseUp={finishLine}
				onMouseMove={() => handleDraw}
				height={400}
				width={400}
			></canvas>
		</div>
	);
};

export default Canvas;
