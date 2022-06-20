import React, { useRef, useState } from 'react';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Modal from '@mui/material/Modal';
import { makeStyles } from '@mui/styles';
import Swal from 'sweetalert2';

import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import { canvasPreview } from '../../utils/CanvasPreview';
import posterFrameSrc from '../../images/poster.png';
import momentoFrameSrc from '../../images/momento.png';

const useStyles = makeStyles((theme) => ({
	modal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	paper: {
		backgroundColor: '#ffffff',
		borderRadius: '15px',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
		display: 'flex',
		flexDirection: 'column',
	},
}));

const schoolNames = [
	{ value: 'select', label: 'Select your school' },
	{ value: 'AKMHSS KOTTUR', label: 'AKMHSS KOTTUR' },
	{ value: 'DUHSS PANAKKAD', label: 'DUHSS PANAKKAD' },
	{ value: 'GBHSS MANJERI', label: 'GBHSS MANJERI' },
	{ value: 'GBHSS MALAPPURAM', label: 'GBHSS MALAPPURAM' },
	{ value: 'GGHSS MALAPPURAM', label: 'GGHSS MALAPPURAM' },
	{ value: 'GGHSS MANJERI', label: 'GGHSS MANJERI' },
	{ value: 'GHSS IRUMBUZHI', label: 'GHSS IRUMBUZHI' },
	{ value: 'GHSS MAKKARAPARAMBA', label: 'GHSS MAKKARAPARAMBA' },
	{ value: 'GHSS MANKADA', label: 'GHSS MANKADA' },
	{ value: 'GHSS OTHUKKUNGAL', label: 'GHSS OTHUKKUNGAL' },
	{ value: 'GHSS POKKOTTUR', label: 'GHSS POKKOTTUR' },
	{ value: 'IKTHSS', label: 'IKTHSS' },
	{ value: 'MMETHSS', label: 'MMETHSS' },
	{ value: 'MSPHSS MALAPPURAM', label: 'MSPHSS MALAPPURAM' },
	{ value: 'PKMHSS EDARIKKODE', label: 'PKMHSS EDARIKKODE' },
	{ value: 'PMSAMA CHEMMANKADAV', label: 'PMSAMA CHEMMANKADAV' },
	{ value: 'ST GEMMAS', label: 'ST GEMMAS' },
	{ value: 'TSS VADAKKANGARA', label: 'TSS VADAKKANGARA' },
	{ value: 'VHMHSS MORAYUR', label: 'VHMHSS MORAYUR' },
	{ value: 'other', label: 'OTHER' },
];

const batchNames = [
	{ value: 'select', label: 'Select your batch' },
	{ value: 'S1', label: 'S1' },
	{ value: 'S2', label: 'S2' },
	{ value: 'S3', label: 'S3' },
	{ value: 'S4', label: 'S4' },
	{ value: 'S5', label: 'S5' },
	{ value: 'S6', label: 'S6' },
	{ value: 'other', label: 'OTHER' },
];

const centerAspectCrop = (mediaWidth, mediaHeight, aspect) => {
	return centerCrop(
		makeAspectCrop(
			{
				unit: '%',
				width: 90,
			},
			aspect,
			mediaWidth,
			mediaHeight
		),
		mediaWidth,
		mediaHeight
	);
};

export default function AddressForm() {
	const classes = useStyles();
	const imgRef = useRef(null);
	const cropCanvasRef = useRef(null);
	const posterCanvasRef = useRef(null);
	const momentoCanvasRef = useRef(null);
	const posterFrameImageRef = useRef(null);
	const momentoFrameImageRef = useRef(null);

	const [school, setSchool] = useState('select');
	const [batch, setBatch] = useState('select');
	const [fullName, setFullName] = useState('');
	const [examRegNo, setExamRegNo] = useState('');
	const [mobile, setMobile] = useState('');
	const [othSchool, setOthSchool] = useState('');
	const [othBatch, setOthBatch] = useState('');
	const [cropModalOpen, setCropModalOpen] = useState(false);
	const [imgSrc, setImgSrc] = useState('');
	const [crop, setCrop] = useState();
	const [completedCrop, setCompletedCrop] = useState();
	const [isLoading, setIsLoading] = useState(false);

	const onSelectFile = (e) => {
		if (e.target.files && e.target.files.length > 0) {
			setCrop(undefined); // Makes crop preview update between images.
			const reader = new FileReader();
			reader.addEventListener('load', () => {
				setCropModalOpen(true);
				setImgSrc(reader.result.toString() || '');
			});
			reader.readAsDataURL(e.target.files[0]);
		}
	};

	const onImageLoad = (e) => {
		const { width, height } = e.currentTarget;
		setCrop(centerAspectCrop(width, height, 1));
	};

	const handleSchoolChange = (event) => {
		setSchool(event.target.value);
		setOthSchool(event.target.value);
	};

	const handleBatchChange = (event) => {
		setBatch(event.target.value);
		setOthBatch(event.target.value);
	};

	const resetAll = () => {
		setSchool('select');
		setBatch('select');
		setFullName('');
		setExamRegNo('');
		setMobile('');
		setOthSchool('');
		setOthBatch('');
		setCropModalOpen(false);
		setImgSrc('');
		setCrop(undefined);
		setCompletedCrop(undefined);
		setIsLoading(false);
	};

	const handleSubmit = () => {
		if (
			!fullName ||
			!examRegNo ||
			!mobile ||
			!othSchool ||
			othSchool === 'select' ||
			othSchool === 'other' ||
			!othBatch ||
			othBatch === 'select' ||
			othBatch === 'other' ||
			!completedCrop
		) {
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: `fill all required fields`,
			});
			return;
		}
		if (mobile.length !== 10 || isNaN(mobile)) {
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: `enter a valid mobile number`,
			});
			return;
		}

		setIsLoading(true);

		// Poster download
		const canvas = posterCanvasRef.current;
		const context = canvas.getContext('2d');
		context.drawImage(cropCanvasRef.current, 549, 375, 469, 469);
		context.drawImage(posterFrameImageRef.current, 0, 0);

		context.font = '100px TimesNewRoman';
		context.textAlign = 'center';
		context.fillStyle = '#ffffff';
		context.fillText(fullName.toUpperCase(), 783, 965);

		const link = document.createElement('a');
		link.download = 'insight_poster.png';
		link.href = canvas.toDataURL('image/png');

		// Momento upload
		const mCanvas = momentoCanvasRef.current;
		const mContext = mCanvas.getContext('2d');
		mContext.drawImage(cropCanvasRef.current, 310, 489, 496, 496);
		mContext.drawImage(momentoFrameImageRef.current, 0, 0);

		mContext.font = 'bold 80px TimesNewRoman';
		mContext.textAlign = 'center';
		mContext.fillStyle = '#ff0000';
		mContext.fillText(fullName.toUpperCase(), 557.5, 1130);

		const momentoImage = mCanvas.toDataURL('image/png');

		axios
			.post('/api/form', {
				fullName,
				examRegNo,
				mobile,
				school: othSchool,
				batch: othBatch,
				imageBinary: momentoImage,
			})
			.then((response) => {
				console.log(response);
				link.click();
				Swal.fire({
					icon: 'success',
					title: 'Success',
					text: `Successfully uploaded form! thank you`,
				}).then(() => {
					resetAll();
				});
			})
			.catch((error) => {
				Swal.fire({
					icon: 'error',
					title: 'Oops...',
					text: `Sorry form upload failed, try again!\n\n${error.message}`,
				}).then(() => {
					setIsLoading(false);
				});
				console.log(error);
			});
	};

	const onCropHandler = async () => {
		setCropModalOpen(false);
		canvasPreview(imgRef.current, cropCanvasRef.current, completedCrop, 1, 0);
	};

	return (
		<React.Fragment>
			{isLoading ? (
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<CircularProgress />
				</div>
			) : (
				<React.Fragment>
					<Typography variant='h6' gutterBottom>
						Fill the form
					</Typography>
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<TextField
								required
								id='fullName'
								name='fullName'
								label='Full name'
								fullWidth
								variant='standard'
								value={fullName}
								onChange={(e) => {
									setFullName(e.target.value);
								}}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								required
								id='regNo'
								name='regNo'
								label='Exam Registration Number'
								fullWidth
								variant='standard'
								value={examRegNo}
								onChange={(e) => {
									setExamRegNo(e.target.value);
								}}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								required
								id='mobile'
								name='mobile'
								type='tel'
								label='Mobile Number'
								fullWidth
								variant='standard'
								InputProps={{
									startAdornment: (
										<InputAdornment position='start'>+91</InputAdornment>
									),
								}}
								value={mobile}
								onChange={(e) => {
									setMobile(e.target.value);
								}}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								required
								id='school'
								select
								label='School Name'
								value={school}
								onChange={handleSchoolChange}
								fullWidth
								helperText='Please select your school name'
							>
								{schoolNames.map((schoolName) => (
									<MenuItem key={schoolName.value} value={schoolName.value}>
										{schoolName.label}
									</MenuItem>
								))}
							</TextField>
						</Grid>
						{school === 'other' ? (
							<Grid item xs={12}>
								<TextField
									required
									id='othSchool'
									name='othSchool'
									label='Specify School Name'
									fullWidth
									variant='standard'
									value={othSchool}
									onChange={(e) => {
										setOthSchool(e.target.value);
									}}
								/>
							</Grid>
						) : null}
						<Grid item xs={12}>
							<TextField
								required
								id='batch'
								select
								label='Batch Name'
								value={batch}
								onChange={handleBatchChange}
								fullWidth
								helperText='Please select your batch name'
							>
								{batchNames.map((batchName) => (
									<MenuItem key={batchName.value} value={batchName.value}>
										{batchName.label}
									</MenuItem>
								))}
							</TextField>
						</Grid>
						{batch === 'other' ? (
							<Grid item xs={12}>
								<TextField
									required
									id='othBatch'
									name='othBatch'
									label='Specify Batch Name'
									fullWidth
									variant='standard'
									value={othBatch}
									onChange={(e) => {
										setOthBatch(e.target.value);
									}}
								/>
							</Grid>
						) : null}
						<Grid item xs={12}>
							<Button variant='contained' color='warning' component='label'>
								Upload Image*
								<input
									type='file'
									onChange={onSelectFile}
									accept='image/*'
									hidden
								/>
							</Button>
						</Grid>
						<Grid item xs={12}>
							<div>
								{Boolean(completedCrop) && (
									<canvas
										ref={cropCanvasRef}
										style={{
											display: cropModalOpen ? 'none' : 'block',
											objectFit: 'contain',
											width: '150px',
											height: '150px',
										}}
									/>
								)}
							</div>
						</Grid>
					</Grid>
					<Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
						<Button
							variant='contained'
							onClick={handleSubmit}
							sx={{ mt: 3, ml: 1 }}
						>
							SUBMIT
						</Button>
					</Box>
					<Modal
						aria-labelledby='transition-modal-title'
						aria-describedby='transition-modal-description'
						className={classes.modal}
						open={cropModalOpen}
						onClose={(_, reason) => {
							if (reason && reason === 'backdropClick') return;
							setCropModalOpen(false);
						}}
						disableEscapeKeyDown
					>
						<div className={classes.paper}>
							{Boolean(imgSrc) && (
								<ReactCrop
									crop={crop}
									onChange={(_, percentCrop) => setCrop(percentCrop)}
									onComplete={(c) => setCompletedCrop(c)}
									aspect={1}
								>
									<img
										style={{ maxHeight: '70vh' }}
										ref={imgRef}
										alt='Crop me'
										src={imgSrc}
										onLoad={onImageLoad}
									/>
								</ReactCrop>
							)}
							<Button
								color='error'
								variant='contained'
								onClick={() => {
									setCropModalOpen(false);
									setImgSrc('');
									setCrop(undefined);
									setCompletedCrop(undefined);
								}}
								sx={{ mt: 3, ml: 1 }}
							>
								CANCEL
							</Button>
							<Button
								variant='contained'
								onClick={onCropHandler}
								sx={{ mt: 1, ml: 1 }}
							>
								CROP
							</Button>
						</div>
					</Modal>
					<canvas
						ref={posterCanvasRef}
						style={{ display: 'none' }}
						width='1566'
						height='1655'
					/>
					<canvas
						ref={momentoCanvasRef}
						style={{ display: 'none' }}
						width='1115'
						height='1655'
					/>
					<img
						src={posterFrameSrc}
						alt='poster frame'
						ref={posterFrameImageRef}
						style={{ display: 'none' }}
					/>
					<img
						src={momentoFrameSrc}
						alt='momento frame'
						ref={momentoFrameImageRef}
						style={{ display: 'none' }}
					/>
				</React.Fragment>
			)}
		</React.Fragment>
	);
}
