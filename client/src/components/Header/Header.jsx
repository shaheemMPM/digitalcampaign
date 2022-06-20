import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

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
			<Link to='/'>
				<Toolbar>
					<img
						className='insight-logo'
						src={insightLogoInverted}
						alt='insight plus'
					/>
					<Typography variant='h6' color='#221e1e' noWrap>
						INSIGHT PLUS
					</Typography>
				</Toolbar>
			</Link>
		</AppBar>
	);
};

export default Header;
