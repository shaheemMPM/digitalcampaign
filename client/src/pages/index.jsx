import React from "react";

import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";

import Copyright from "../components/CopyRight/CopyRight";
// import ResultsForms from '../components/ResultsForms/ResultsForms';
import AddressForm from "../components/AddressForm/AddressForm";

const Home = () => {
  return (
    <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
      <Paper
        variant="outlined"
        sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
      >
        {/* <ResultsForms /> */}
        <AddressForm />
      </Paper>
      <Copyright />
    </Container>
  );
};

export default Home;
