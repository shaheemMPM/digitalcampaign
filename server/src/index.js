import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import routes from './routes';
import { URL } from 'url';
import { resolve, join } from 'path';
import bodyParser from 'body-parser';

const app = express();

const __dirname = new URL('.', import.meta.url).pathname;

// Bodyparser Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

// Use Routes
app.use('/api', routes);

app.use('/public', express.static(join(__dirname, '../public')));
app.use(express.static(join(__dirname, '../../client/dist')));
app.get('*', (req, res) => {
	res.sendFile(resolve(__dirname, '../..', 'client', 'dist', 'index.html')); // index is in /server/src so 2 folders up
});

const isProduction = process.env.NODE_ENV === 'production';

// DB Config
const dbConnection = isProduction
	? process.env.MONGO_URI_PROD
	: process.env.MONGO_URI_DEV;

// Connect to Mongo
mongoose
	.connect(dbConnection, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('MongoDB Connected...');
		const PORT = process.env.PORT || 8000;
		app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
	})
	.catch((err) => {
		console.log('MongoDB Connection Failed\n', err);
	});
