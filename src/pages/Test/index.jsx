import React from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import AddressForm from '../../components/AddressForm';
import Copyright from '../../components/CopyRight';

import insightLogoInverted from '../../images/insight_inverted.png';

import './index.scss';

const theme = createTheme();

const Test = () => {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<AppBar
				position='absolute'
				color='default'
				elevation={0}
				sx={{
					position: 'relative',
					borderBottom: (t) => `1px solid ${t.palette.divider}`,
				}}
			>
				<Toolbar>
					<img
						className='insight-logo'
						src={insightLogoInverted}
						alt='insight'
					/>
					<Typography variant='h6' color='inherit' noWrap>
						INSIGHT
					</Typography>
				</Toolbar>
			</AppBar>
			<Container component='main' maxWidth='sm' sx={{ mb: 4 }}>
				<Paper
					variant='outlined'
					sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
				>
					<Typography component='h1' variant='h4' align='center'>
						Checkout
					</Typography>
					<React.Fragment>
						<AddressForm />

						<Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
							<Button
								variant='contained'
								onClick={() => {
									console.log('test');
								}}
								sx={{ mt: 3, ml: 1 }}
							>
								Button Text
							</Button>
						</Box>
					</React.Fragment>
				</Paper>
				<Copyright />
			</Container>
		</ThemeProvider>
	);
};

export default Test;
