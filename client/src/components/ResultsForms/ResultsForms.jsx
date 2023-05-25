import React, { useRef, useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Modal from "@mui/material/Modal";
import { makeStyles } from "@mui/styles";
import Swal from "sweetalert2";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import "./ResultsForms.scss";

import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import { canvasPreview } from "../../utils/CanvasPreview";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: "#ffffff",
    borderRadius: "15px",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    display: "flex",
    flexDirection: "column",
  },
}));

const batchNames = [
  { value: "select", label: "Select your batch" },
  { value: "S1", label: "S1" },
  { value: "S2", label: "S2" },
  { value: "S3", label: "S3" },
  { value: "S4", label: "S4" },
  { value: "S5", label: "S5" },
  { value: "S6", label: "S6" },
  { value: "other", label: "OTHER" },
];

const centerAspectCrop = (mediaWidth, mediaHeight, aspect) => {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
};

export default function ResultsForms() {
  const classes = useStyles();
  const imgRef = useRef(null);
  const cropCanvasRef = useRef(null);

  const [batch, setBatch] = useState("select");
  const [examRegNo, setExamRegNo] = useState("");
  const [mobile, setMobile] = useState("");
  const [othBatch, setOthBatch] = useState("");
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [isResultFetching, setIsResultFetching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);

  const [dob, setDob] = React.useState(new Date("2000-04-11"));

  const handleDobChange = (newValue) => {
    setDob(newValue);
  };

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setCropModalOpen(true);
        setImgSrc(reader.result.toString() || "");
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1));
  };

  const handleBatchChange = (event) => {
    setBatch(event.target.value);
    setOthBatch(event.target.value);
  };

  const resetAll = () => {
    setBatch("select");
    setExamRegNo("");
    setMobile("");
    setOthBatch("");
    setCropModalOpen(false);
    setImgSrc("");
    setCrop(undefined);
    setCompletedCrop(undefined);
    setDob(new Date("2000-04-11"));
    setResults(null);
    setIsLoading(false);
  };

  const getDdMmYyyy = (date) => {
    const givenDate = new Date(date);
    let dd = String(givenDate.getDate());
    if (dd.length != 2) dd = "0" + dd;
    let mm = String(givenDate.getMonth() + 1);
    if (mm.length != 2) mm = "0" + mm;
    const yyyy = givenDate.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const fetchResults = () => {
    if (!examRegNo || !dob) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "fill all Exam register number and DOB fields",
      });
      return;
    }
    setIsResultFetching(true);
    axios
      .get("/api/results", {
        params: {
          regNo: examRegNo,
          dob: getDdMmYyyy(dob),
        },
      })
      .then((response) => {
        console.log(response.data);
        if (!response.data.studentName) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `Sorry fetch result failed, check your inputs and try again!`,
          }).then(() => {
            setIsResultFetching(false);
          });
          return;
        }
        setResults(response.data);
        setIsResultFetching(false);
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Sorry fetch result failed, check your inputs and try again!\n\n${error.message}`,
        }).then(() => {
          setIsResultFetching(false);
        });
        console.log(error);
      });
  };

  const handleSubmit = () => {
    if (
      !examRegNo ||
      !mobile ||
      !othBatch ||
      othBatch === "select" ||
      othBatch === "other" ||
      !completedCrop
    ) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: `fill all required fields`,
      });
      return;
    }
    if (mobile.length !== 10 || isNaN(mobile)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `enter a valid mobile number`,
      });
      return;
    }

    setIsLoading(true);

    // Phto upload
    const cropCanvas = cropCanvasRef.current;
    const croppedImage = cropCanvas.toDataURL("image/png");

    axios
      .post("/api/form", {
        examRegNo,
        dob: getDdMmYyyy(dob),
        mobile,
        batch: othBatch,
        imageBinary: croppedImage,
        ...results,
      })
      .then((response) => {
        console.log(response);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: `Successfully uploaded form! thank you`,
        }).then(() => {
          resetAll();
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Sorry form upload failed, try again!\n\n${error.message}`,
        }).then(() => {
          setIsLoading(false);
        });
        console.log(error);
      });
  };

  const onCropHandler = async () => {
    setCropModalOpen(false);
    canvasPreview(imgRef.current, cropCanvasRef.current, completedCrop, 1, 0);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {isLoading ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </div>
      ) : (
        <div className="form-root">
          <Typography variant="h6" gutterBottom>
            Fill the form
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <TextField
                required
                id="regNo"
                name="regNo"
                label="Exam Registration Number"
                fullWidth
                variant="standard"
                value={examRegNo}
                onChange={(e) => {
                  setExamRegNo(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <MobileDatePicker
                label="Date of Birth"
                inputFormat="dd/MM/yyyy"
                value={dob}
                onChange={handleDobChange}
                renderInput={(params) => <TextField {...params} />}
              />
            </Grid>
          </Grid>
          <div className="result-button-wrapper">
            <LoadingButton
              loading={isResultFetching}
              variant="contained"
              onClick={fetchResults}
              sx={{ mt: 3, ml: 1 }}
            >
              GET RESULTS
            </LoadingButton>
          </div>
          {results && (
            <table>
              <tbody>
                <tr>
                  <th>Name</th>
                  <td>{results.studentName}</td>
                </tr>
                <tr>
                  <th>Name of father</th>
                  <td>{results.fatherName}</td>
                </tr>
                <tr>
                  <th>Name of mother</th>
                  <td>{results.motherName}</td>
                </tr>
                <tr>
                  <th>School code</th>
                  <td>{results.schoolCode}</td>
                </tr>
                <tr>
                  <th>Group name</th>
                  <td>{results.groupName}</td>
                </tr>
                <tr>
                  <th colSpan={2}>Subjects</th>
                </tr>
                {Object.keys(results.subjects).map((sub) => {
                  return (
                    <tr key={`sub-${sub}`}>
                      <th>{sub}</th>
                      <td>{results.subjects[sub]}</td>
                    </tr>
                  );
                })}
                <tr>
                  <th>Percentage</th>
                  <td>{Math.round(results.percentage * 100) / 100} %</td>
                </tr>
              </tbody>
            </table>
          )}
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                disabled={!results}
                required
                id="mobile"
                name="mobile"
                type="tel"
                label="Mobile Number"
                fullWidth
                variant="standard"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">+91</InputAdornment>
                  ),
                }}
                value={mobile}
                onChange={(e) => {
                  setMobile(e.target.value);
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                disabled={!results}
                required
                id="batch"
                select
                label="Batch Name"
                value={batch}
                onChange={handleBatchChange}
                fullWidth
                helperText="Please select your batch name"
              >
                {batchNames.map((batchName) => (
                  <MenuItem key={batchName.value} value={batchName.value}>
                    {batchName.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {batch === "other" ? (
              <Grid item xs={12}>
                <TextField
                  disabled={!results}
                  required
                  id="othBatch"
                  name="othBatch"
                  label="Specify Batch Name"
                  fullWidth
                  variant="standard"
                  value={othBatch}
                  onChange={(e) => {
                    setOthBatch(e.target.value);
                  }}
                />
              </Grid>
            ) : null}
            <Grid item xs={12}>
              <Button
                disabled={!results}
                variant="contained"
                color="warning"
                component="label"
              >
                Upload Image*
                <input
                  type="file"
                  onChange={onSelectFile}
                  accept="image/*"
                  hidden
                />
              </Button>
            </Grid>
            <Grid item xs={12}>
              <div>
                {Boolean(completedCrop) && (
                  <canvas
                    ref={cropCanvasRef}
                    style={{
                      display: cropModalOpen ? "none" : "block",
                      objectFit: "contain",
                      width: "150px",
                      height: "150px",
                    }}
                  />
                )}
              </div>
            </Grid>
          </Grid>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              disabled={!results}
              variant="contained"
              onClick={handleSubmit}
              sx={{ mt: 3, ml: 1 }}
            >
              SUBMIT
            </Button>
          </Box>
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={cropModalOpen}
            onClose={(_, reason) => {
              if (reason && reason === "backdropClick") return;
              setCropModalOpen(false);
            }}
            disableEscapeKeyDown
          >
            <div className={classes.paper}>
              {Boolean(imgSrc) && (
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={1}
                >
                  <img
                    style={{ maxHeight: "70vh" }}
                    ref={imgRef}
                    alt="Crop me"
                    src={imgSrc}
                    onLoad={onImageLoad}
                  />
                </ReactCrop>
              )}
              <Button
                color="error"
                variant="contained"
                onClick={() => {
                  setCropModalOpen(false);
                  setImgSrc("");
                  setCrop(undefined);
                  setCompletedCrop(undefined);
                }}
                sx={{ mt: 3, ml: 1 }}
              >
                CANCEL
              </Button>
              <Button
                variant="contained"
                onClick={onCropHandler}
                sx={{ mt: 1, ml: 1 }}
              >
                CROP
              </Button>
            </div>
          </Modal>
        </div>
      )}
    </LocalizationProvider>
  );
}
