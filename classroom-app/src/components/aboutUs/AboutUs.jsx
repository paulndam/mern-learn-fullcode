import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import CardMedia from "@mui/material/CardMedia";
import { Footer } from "../allComponents/AllComponents";

const Aboutus = () => {
  return (
    <>
      <Box>
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
          >
            Mern-Learn
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="text.secondary"
            paragraph
          >
            Mern-Learn is an online learning and teaching marketplace with a
            variety of courses and plenty students. Learn programming,
            marketing, data science and more.A massive open online course
            provider aimed at professional adults and students.
          </Typography>
          <Stack
            sx={{ pt: 4 }}
            direction="row"
            spacing={2}
            justifyContent="center"
          >
            <Link href="/signup" underline="none">
              <Button variant="contained">Sign Up</Button>
            </Link>
            <Link href="/signup" underline="none">
              <Button variant="outlined">Become An Instructor</Button>
            </Link>
          </Stack>
        </Container>
      </Box>

      <Container sx={{ py: 8, marginTop: 5 }} maxWidth="xlg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={12} md={12} sx={{ width: "100%" }}>
            <CardMedia
              component="img"
              height="550"
              image={require("../../assets/images/edu1.jpeg").default}
              alt="Paella dish"
              sx={{ width: "100%" }}
            />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export default Aboutus;
