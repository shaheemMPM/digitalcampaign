import React from 'react';
import Slider from 'react-slick';
import { useSelector } from 'react-redux';
import { SliderSettings } from '/src/common/settings';
import { getAllMovies, getAllShows } from '/src/redux/movies/movieSlice';
import MovieCard from '/src/components/MovieCard/MovieCard';
import './MovieListing.scss';

const MovieListing = () => {
	const movies = useSelector(getAllMovies);
	const shows = useSelector(getAllShows);

	const renderMovies =
		movies.Response === 'True' ? (
			movies.Search.map((movie, index) => (
				<MovieCard key={index} data={movie} />
			))
		) : (
			<div className='movies-error'>
				<h3>{movies.Error}</h3>
			</div>
		);

	const renderShows =
		shows.Response === 'True' ? (
			shows.Search.map((movie, index) => <MovieCard key={index} data={movie} />)
		) : (
			<div className='shows-error'>
				<h3>{shows.Error}</h3>
			</div>
		);

	return (
		<div className='movie-wrapper'>
			<div className='movie-list'>
				<h2>Movies</h2>
				<div className='movie-container'>
					<Slider {...SliderSettings}>{renderMovies}</Slider>
				</div>
			</div>
			<div className='show-list'>
				<h2>Shows</h2>
				<div className='movie-container'>
					<Slider {...SliderSettings}>{renderShows}</Slider>
				</div>
			</div>
		</div>
	);
};

export default MovieListing;
