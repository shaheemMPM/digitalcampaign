import React from 'react';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';

import Copyright from '../../components/CopyRight/CopyRight';

const PageNotFound = () => {
	return (
		<Container component='main' maxWidth='sm' sx={{ mb: 4 }}>
			<Paper
				variant='outlined'
				sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
			>
				<h1 style={{ textAlign: 'center', textTransform: 'uppercase' }}>
					Page Not Found
				</h1>
			</Paper>
			<Copyright />
		</Container>
	);
};

export default PageNotFound;
