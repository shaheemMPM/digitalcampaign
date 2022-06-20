import { Router } from 'express';
import fs from 'fs';
import AWS from 'aws-sdk';

import User from '../models/user';

const s3Bucket = new AWS.S3({
	accessKeyId: process.env.AWS_ID,
	secretAccessKey: process.env.AWS_SECRET,
	region: 'ap-south-1',
});

const router = Router();

router.get('/', (req, res) => {
	res.status(200).json({
		test: 'test endpoint',
	});
});

// router.get('/extract', async (req, res) => {
// 	const users = await User.find();

// 	const newUsers = [];
// 	for (let i = 0; i < users.length; i++) {
// 		const user = users[i];
// 		newUsers.push({
// 			sslcRegNo: user.sslcRegNo,
// 			fullName: user.fullName,
// 			mobile: user.mobile,
// 			school: user.school,
// 			batch: user.batch,
// 			momento: user.momento,
// 			time: new Date(user.updatedAt).toLocaleString(),
// 		});
// 	}

// 	fs.writeFile('users.json', JSON.stringify(newUsers), 'utf8', (err) => {
// 		if (err) {
// 			res.status(200).json({
// 				message: 'failed',
// 				err,
// 			});
// 		} else {
// 			res.status(200).json({
// 				message: 'success',
// 			});
// 		}
// 	});
// });

// router.get('/cleandb', async (req, res) => {
// 	try {
// 		await User.deleteMany();
// 		res.status(200).json({
// 			message: 'successfully cleaned db',
// 		});
// 	} catch (error) {
// 		res.status(500).json({
// 			message: 'db clean error',
// 			error,
// 		});
// 	}
// });

router.post('/form', async (req, res) => {
	const { fullName, sslcRegNo, mobile, school, batch, imageBinary } = req.body;

	const oldUser = await User.findOne({ sslcRegNo });

	const buf = Buffer.from(
		imageBinary.replace(/^data:image\/\w+;base64,/, ''),
		'base64'
	);
	const data = {
		Bucket: 'insightprimes0',
		Key: `momento/${sslcRegNo}`,
		Body: buf,
		ContentEncoding: 'base64',
		ContentType: 'image/jpeg',
	};

	try {
		await s3Bucket.upload(data).promise();
	} catch (error) {
		res.status(500).json({
			message: 'error in s3 upload',
			error,
		});
	}

	if (oldUser) {
		await User.findByIdAndUpdate(
			oldUser.id,
			{
				$set: {
					fullName,
					mobile,
					school,
					batch,
					momento: `https://insightprimes0.s3.ap-south-1.amazonaws.com/momento/${sslcRegNo}`,
				},
			},
			{ new: true }
		);
	} else {
		await new User({
			fullName,
			sslcRegNo,
			mobile,
			school,
			batch,
			momento: `https://insightprimes0.s3.ap-south-1.amazonaws.com/momento/${sslcRegNo}`,
		}).save();
	}

	res.status(200).json({
		message: 'form created/updated',
	});
});

export default router;
