import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import PageNotFound from './pages/404/PageNotFound';
import MovieDetail from './pages/movie/[imdbId]';
import './App.scss';

function App() {
	return (
		<div className='app'>
			<BrowserRouter>
				<Header />
				<div className='container'>
					<Routes>
						<Route path='/' element={<Home />} />
						<Route path='/movie/:imdbID' element={<MovieDetail />} />
						<Route element={<PageNotFound />} />
					</Routes>
				</div>
				<Footer />
			</BrowserRouter>
		</div>
	);
}

export default App;
