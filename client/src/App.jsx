import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages';
import PageNotFound from './pages/404/PageNotFound';
import './App.scss';
import Header from './components/Header/Header';

function App() {
	return (
		<div className='app'>
			<BrowserRouter>
				<Header />
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='*' element={<PageNotFound />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
