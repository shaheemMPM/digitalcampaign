import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

ReactDOM.createRoot(document.getElementById('root')).render(
	<StrictMode>
		<Provider store={store}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<App />
			</ThemeProvider>
		</Provider>
	</StrictMode>
);
