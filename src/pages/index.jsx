import React, { useRef, useState } from 'react';
import './index.scss';
import frame from '../images/poster_template.png';

const Home = () => {
	const [name, setName] = useState('');
	const [image, setImage] = useState(null);

	const canvasRef = useRef(null);
	const frameImageRef = useRef(null);
	const userImageRef = useRef(null);

	const draw = () => {
		const canvas = canvasRef.current;
		const context = canvas.getContext('2d');
		const img = frameImageRef.current;
		const userImg = userImageRef.current;
		context.drawImage(img, 0, 0);
		context.drawImage(userImg, 111, 111, 405, 687);
		context.font = 'bold 130px monospace';
		context.textAlign = 'center';
		context.fillStyle = '#d75231';
		context.fillText(name, 870, 505);
	};

	return (
		<div className='home-body'>
			<h1>{name}</h1>
			{image && (
				<img
					ref={userImageRef}
					className='user-img'
					src={URL.createObjectURL(image)}
					alt='user image'
				/>
			)}
			<br />
			<input
				type='text'
				value={name}
				onChange={(e) => {
					setName(e.target.value);
				}}
			/>
			<br />
			<input
				type='file'
				accept='image/*'
				onChange={(e) => {
					setImage(e.target.files[0]);
				}}
			/>
			<br />
			<button onClick={draw}>Test</button>
			<br />
			<canvas ref={canvasRef} width='1280' height='908' />
			<br />
			<img
				ref={frameImageRef}
				src={frame}
				style={{ display: 'none' }}
				alt='poster frame'
			/>
		</div>
	);
};

export default Home;
