import React from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import AddressForm from '../../components/AddressForm/AddressForm';
import Copyright from '../../components/CopyRight/CopyRight';
import Header from '../../components/Header/Header';

const Test = () => {
	return (
		<>
			<Header />
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
		</>
	);
};

export default Test;
