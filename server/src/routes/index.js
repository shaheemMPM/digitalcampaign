import { Router } from "express";
// import puppeteer from "puppeteer";
// import fs from "fs";
import AWS from "aws-sdk";

import User from "../models/user";

const s3Bucket = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
  region: "ap-south-1",
});

const router = Router();

// const scrape = async ({ regNo, dob, mode = "hse" }) => {
//   const browser = await puppeteer.launch({});
//   const page = await browser.newPage();

//   const dobParam = dob.split("/").join("%2F");

//   await page.goto(
//     `https://results.kite.kerala.gov.in/${mode}/result_schemeI.html?regno=${regNo}&date1=${dobParam}&Submit=Submit`
//   );
//   const studentData = await page.evaluate(() => {
//     const trimmedString = (str) => {
//       if (!str) return "";
//       return str.trim();
//     };

//     // get student name
//     const studentName = trimmedString(
//       document.getElementById("name").innerText.split(":")[1]
//     );

//     // get father's name
//     const fatherName = trimmedString(
//       document.getElementById("fname").innerText.split(":")[1]
//     );

//     // get mother's name
//     const motherName = trimmedString(
//       document.getElementById("mname").innerText.split(":")[1]
//     );

//     // get school code
//     const schoolCode = trimmedString(
//       document.getElementById("school").innerText.split(":")[1]
//     );

//     // get group name
//     const groupName = trimmedString(
//       document.getElementById("group_name").innerText.split(":")[1]
//     );

//     // get subject names
//     const subjectNameCells = document.getElementsByClassName("cell1");
//     const subjects = {};
//     for (let i = 0; i < subjectNameCells.length; i++) {
//       subjects[subjectNameCells[i].innerText] = document.getElementById(
//         `TP${i + 1}_TOT`
//       ).innerText;
//     }
//     return {
//       studentName,
//       fatherName,
//       motherName,
//       schoolCode,
//       groupName,
//       subjects,
//     };
//   });

//   const percentage =
//     (Object.values(studentData.subjects)
//       .map((val) => parseInt(val))
//       .reduce((partialSum, a) => partialSum + a, 0) *
//       100) /
//     1200;

//   browser.close();

//   return { ...studentData, percentage };
// };

router.get("/", async (_req, res) => {
  res.status(200).json({
    test: "digital campaign says: Hello",
  });
});

// router.get('/results', async (req, res) => {
// 	const { regNo, dob, mode } = req.query;
// 	const studentData = await scrape({ regNo, dob, mode });

// 	res.status(200).json(studentData);
// });

// const getSubjects = (subjects) => {
// 	const jsonSubjects = JSON.parse(subjects);
// 	const subjectNames = Object.keys(jsonSubjects);
// 	const subjectValues = Object.values(jsonSubjects);
// 	let subjectString = '';
// 	for (let i = 0; i < subjectNames.length; i++) {
// 		subjectString += subjectNames[i] + ' - ' + subjectValues[i] + '\n';
// 	}
// 	return subjectString;
// };

// router.get("/extract", async (req, res) => {
//   const users = await User.find();

//   const newUsers = [];
//   for (let i = 0; i < users.length; i++) {
//     const user = users[i];
//     newUsers.push({
//       examRegNo: user.examRegNo,
//       studentName: user.studentName,
//       firstLanguage: user.firstLanguage,
//       english: user.english,
//       physics: user.physics,
//       chemistry: user.chemistry,
//       bioCs: user.bioCs,
//       maths: user.maths,
//       total: user.total,
//       mobile: user.mobile,
//       batch: user.batch,
//       photo: user.photo,
//       time: new Date(user.updatedAt).toLocaleString(),
//     });
//   }

//   fs.writeFile("users.json", JSON.stringify(newUsers), "utf8", (err) => {
//     if (err) {
//       res.status(200).json({
//         message: "failed",
//         err,
//       });
//     } else {
//       res.status(200).json({
//         message: "success",
//       });
//     }
//   });
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

router.post("/form", async (req, res) => {
  const {
    examRegNo,
    studentName,
    schoolName,
    grade,
    // firstLanguage,
    // english,
    // physics,
    // chemistry,
    // bioCs,
    // maths,
    // mobile,
    // batch,
    imageBinary,
  } = req.body;

  // const total =
  //   Number(firstLanguage) +
  //   Number(english) +
  //   Number(physics) +
  //   Number(chemistry) +
  //   Number(bioCs) +
  //   Number(maths);

  console.log("Response came from: ", examRegNo);

  const oldUser = await User.findOne({ examRegNo });

  const buf = Buffer.from(
    imageBinary.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );
  const data = {
    Bucket: "digitalcampaing",
    Key: `photo/${examRegNo}.png`,
    Body: buf,
    ContentEncoding: "base64",
    ContentType: "image/jpeg",
  };

  try {
    await s3Bucket.upload(data).promise();
  } catch (error) {
    res.status(500).json({
      message: "error in s3 upload",
      error,
    });
  }

  if (oldUser) {
    await User.findByIdAndUpdate(
      oldUser.id,
      {
        $set: {
          examRegNo,
          studentName,
          schoolName,
          grade,
          // firstLanguage,
          // english,
          // physics,
          // chemistry,
          // bioCs,
          // maths,
          // total,
          // mobile,
          // batch,
          photo: `https://insightprimes0.s3.ap-south-1.amazonaws.com/photo/${examRegNo}.png`,
        },
      },
      { new: true }
    );
  } else {
    await new User({
      examRegNo,
      studentName,
      schoolName,
      grade,
      // firstLanguage,
      // english,
      // physics,
      // chemistry,
      // bioCs,
      // maths,
      // total,
      // mobile,
      // batch,
      photo: `https://insightprimes0.s3.ap-south-1.amazonaws.com/photo/${examRegNo}.png`,
    }).save();
  }

  res.status(200).json({
    message: "form created/updated",
  });
});

export default router;
