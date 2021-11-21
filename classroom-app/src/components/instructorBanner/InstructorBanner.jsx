import React from "react";
import auth from "../../auth/AuthHelper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Divider from "@mui/material/Divider";

const Instructorbanner = ({ match }) => {
  return (
    <Box sx={{ width: "100%", marginTop: 5 }}>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={6}>
          <CardMedia
            component="img"
            height="450"
            image={require("../../assets/images/prof3.jpeg").default}
            alt="Paella dish"
            sx={{ width: "100%" }}
          />
        </Grid>
        <Grid item xs={6}>
          <Typography
            variant="h4"
            gutterBottom
            component="div"
            sx={{ color: "black", fontWeight: "bold" }}
          >
            Become an instructor
          </Typography>

          <Typography variant="body1" gutterBottom>
            Instructors from around the world teach millions of students on
            Mern-Learn. We provide the tools and skills to teach what you love.
          </Typography>
          {console.log(auth)}

          {auth.isAuthenticated().user ? (
            <Stack spacing={2} direction="row" sx={{ marginTop: 2 }}>
              <Link
                href={`/user/edit/${auth.isAuthenticated().user._id}`}
                underline="none"
              >
                <Button sx={{ backgroundColor: "#000000" }} variant="contained">
                  Start teaching today
                </Button>
              </Link>
            </Stack>
          ) : (
            <Stack spacing={2} direction="row" sx={{ marginTop: 2 }}>
              <Link href="/signup" underline="none">
                <Button sx={{ backgroundColor: "#000000" }} variant="contained">
                  Start teaching today
                </Button>
              </Link>
            </Stack>
          )}
        </Grid>
      </Grid>
      <Divider sx={{ marginTop: 5 }} />
    </Box>
  );
};

export default Instructorbanner;
