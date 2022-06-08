import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import insightLogoInverted from '../../images/insight_inverted.png';

import './Header.scss';

const Header = () => {
	return (
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
				<img className='insight-logo' src={insightLogoInverted} alt='insight' />
				<Typography variant='h6' color='inherit' noWrap>
					INSIGHT
				</Typography>
			</Toolbar>
		</AppBar>
	);
};

export default Header;
