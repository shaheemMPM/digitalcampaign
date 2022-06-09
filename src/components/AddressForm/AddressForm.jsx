import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const schoolNames = [
	{
		value: 'select',
		label: 'Select your school',
	},
	{
		value: 'FOHSS',
		label: 'FOHSS',
	},
	{
		value: 'GBHSS MPM',
		label: 'GBHSS MPM',
	},
	{
		value: 'GGHSS MPM',
		label: 'GGHSS MPM',
	},
	{
		value: 'GHSS IRUMBUZHI',
		label: 'GHSS IRUMBUZHI',
	},
	{
		value: 'GHSS MAKARAPARAMBA',
		label: 'GHSS MAKARAPARAMBA',
	},
	{
		value: 'GHSS OTHUKKUNGAL',
		label: 'GHSS OTHUKKUNGAL',
	},
	{
		value: 'GHSS PALLIPPURAM',
		label: 'GHSS PALLIPPURAM',
	},
	{
		value: 'IKTHSS CHERUKULAMBA',
		label: 'IKTHSS CHERUKULAMBA',
	},
	{
		value: 'ISLAHIYA',
		label: 'ISLAHIYA',
	},
	{
		value: 'MSP HSS',
		label: 'MSP HSS',
	},
	{
		value: 'MSPEMHSS',
		label: 'MSPEMHSS',
	},
	{
		value: 'PMSAMA CHEMMANKADAV',
		label: 'PMSAMA CHEMMANKADAV',
	},
	{
		value: 'ST. GEMMAS GIRLS HSS',
		label: 'ST. GEMMAS GIRLS HSS',
	},
	{
		value: 'TSS VADAKKANGARA',
		label: 'TSS VADAKKANGARA',
	},
	{
		value: 'other',
		label: 'OTHER',
	},
];

const batchNames = [
	{ value: 'select', label: 'Select your batch' },
	{ value: 'B1', label: 'B1' },
	{ value: 'B2', label: 'B2' },
	{ value: 'B3', label: 'B3' },
	{ value: 'B4', label: 'B4' },
	{ value: 'B5', label: 'B5' },
	{ value: 'B6', label: 'B6' },
	{ value: 'B7', label: 'B7' },
	{ value: 'B8', label: 'B8' },
	{ value: 'B9', label: 'B9' },
	{ value: 'B10', label: 'B10' },
	{ value: 'B11', label: 'B11' },
	{ value: 'B12', label: 'B12' },
	{ value: 'B13', label: 'B13' },
	{ value: 'B14', label: 'B14' },
	{ value: 'B15', label: 'B15' },
	{ value: 'B16', label: 'B16' },
	{ value: 'B17', label: 'B17' },
	{ value: 'other', label: 'OTHER' },
];

export default function AddressForm() {
	const [school, setSchool] = useState('select');
	const [batch, setBatch] = useState('select');
	const [fullName, setFullName] = useState('');
	const [sslcRegNo, setSslcRegNo] = useState('');
	const [mobile, setMobile] = useState('');
	const [othSchool, setOthSchool] = useState('');
	const [othBatch, setOthBatch] = useState('');
	const [errorMessage, setErrorMessage] = useState('');

	const handleSchoolChange = (event) => {
		setSchool(event.target.value);
		setOthSchool(event.target.value);
	};

	const handleBatchChange = (event) => {
		setBatch(event.target.value);
		setOthBatch(event.target.value);
	};

	const handleSubmit = () => {
		if (
			!fullName ||
			!sslcRegNo ||
			!mobile ||
			!othSchool ||
			othSchool === 'select' ||
			othSchool === 'other' ||
			!othBatch ||
			othBatch === 'select' ||
			othBatch === 'other'
		) {
			setErrorMessage('fill all required fields');
			return;
		}
		if (mobile.length !== 10 || isNaN(mobile)) {
			setErrorMessage('enter a valid mobile number');
			return;
		}
		console.log('data: ', {
			fullName,
			sslcRegNo,
			mobile,
			school: othSchool,
			batch: othBatch,
		});
	};

	return (
		<React.Fragment>
			<Snackbar
				open={!!errorMessage}
				autoHideDuration={2000}
				onClose={() => {
					setErrorMessage('');
				}}
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
			>
				<Alert
					severity='error'
					onClose={() => {
						setErrorMessage('');
					}}
					sx={{ width: '100%' }}
				>
					{errorMessage}
				</Alert>
			</Snackbar>
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
						label='SSLC Registration Number'
						fullWidth
						variant='standard'
						value={sslcRegNo}
						onChange={(e) => {
							setSslcRegNo(e.target.value);
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
						<input type='file' hidden />
					</Button>
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
		</React.Fragment>
	);
}
