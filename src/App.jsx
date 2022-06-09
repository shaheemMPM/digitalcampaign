import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages';
import PageNotFound from './pages/404/PageNotFound';
import Test from './pages/Test';
import Crop from './pages/Crop';
import './App.scss';

function App() {
	return (
		<div className='app'>
			<BrowserRouter>
				{/* <Header /> */}
				{/* <div className='container'> */}
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/test' element={<Test />} />
					<Route path='/crop' element={<Crop />} />
					<Route path='*' element={<PageNotFound />} />
				</Routes>
				{/* </div> */}
				{/* <Footer /> */}
			</BrowserRouter>
		</div>
	);
}

export default App;
