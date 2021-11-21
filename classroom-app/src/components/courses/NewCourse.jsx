import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import auth from "../../auth/AuthHelper";
import { Redirect } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { create } from "../../api/Api-Course";

const Div = styled("div")(({ theme }) => ({
  ...theme.typography.button,
  backgroundColor: "#43a047",
  padding: theme.spacing(1),
}));

const Input = styled("input")({
  display: "none",
});

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const label = { inputProps: { "aria-label": "Switch demo" } };

const theme = createTheme({
  palette: {
    primary: {
      light: "#1769aa",
      main: "#2196f3",
      dark: "#4dabf5",
      contrastText: "#fffde7",
    },
    secondary: {
      light: "#484848",
      main: "#000000",
      dark: "#000000",
      contrastText: "#ffcc00",
    },

    contrastThreshold: 3,
    tonalOffset: 0.2,
    openTitle: "#455a64",
    protectedTitle: "#f57c00",
    type: "light",
  },
});

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const Newcourse = () => {
  const [snackOpen, setSnackOpen] = useState(false);
  const [values, setValues] = useState({
    name: "",
    description: "",
    image: "",
    error: "",
    redirect: false,
    category: "",
    id: "",
  });

  const jwt = auth.isAuthenticated();

  const handleChange = (name) => (event) => {
    const value = name === "image" ? event.target.files[0] : event.target.value;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = () => {
    let courseData = new FormData();
    values.name && courseData.append("name", values.name);
    values.description && courseData.append("description", values.description);
    values.category && courseData.append("category", values.category);
    values.image && courseData.append("image", values.image);

    create(
      {
        userId: jwt.user._id,
      },
      { t: jwt.token },
      courseData
    ).then((data) => {
      console.log(data);
      if (data && data.error) {
        setValues({ ...values, error: data.error });
        setSnackOpen(true);
      } else {
        setValues({ ...values, err: "", redirect: true });
      }
    });
  };

  const handleSnackClose = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackOpen(false);
  };

  if (values.redirect) {
    return <Redirect to={`/teach/courses`} />;
  }

  const photoUrl = values.id
    ? `${process.env.REACT_APP_API}/api/courses/photo/${
        values.id
      }?${new Date().getTime()}`
    : `${process.env.REACT_APP_API}/api/courses/defaultphoto`;

  return (
    <div>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Div sx={{ marginBottom: 5 }}>{"Add Course"}</Div>

            <Avatar src={photoUrl} sx={{ m: 1, bgcolor: "primary.main" }} />

            {values.error && (
              <Stack spacing={2} sx={{ width: "100%" }}>
                <Snackbar
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  open={snackOpen}
                  autoHideDuration={6000}
                  onClose={handleSnackClose}
                >
                  <Alert
                    onClose={handleSnackClose}
                    severity="error"
                    sx={{ width: "100%" }}
                  >
                    {values.error}
                  </Alert>
                </Snackbar>
              </Stack>
            )}

            <Box sx={{ mt: 3 }}>
              <Stack
                sx={{ marginBottom: 3 }}
                direction="row"
                alignItems="center"
                spacing={2}
              >
                <label htmlFor="contained-button-file">
                  <Input
                    accept="image/*"
                    onChange={handleChange("image")}
                    id="contained-button-file"
                    type="file"
                  />
                  <Button variant="contained" component="span">
                    Upload Picture
                  </Button>
                </label>

                <span sx={{ marginLeft: "10px" }}>
                  {values.image ? values.image.name : ""}
                </span>
              </Stack>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="name"
                    label="Course Name"
                    name="name"
                    autoComplete="family-name"
                    value={values.name}
                    onChange={handleChange("name")}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="category"
                    label="Category"
                    name="category"
                    autoComplete="category"
                    value={values.category}
                    onChange={handleChange("category")}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextareaAutosize
                    aria-label="minimum height"
                    minRows={3}
                    placeholder="brief description about course"
                    style={{ width: 400 }}
                    id="description"
                    label="description"
                    name="description"
                    value={values.description}
                    onChange={handleChange("description")}
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, bgcolor: "primary.main" }}
                onClick={handleSubmit}
              >
                Add Course
              </Button>
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, bgcolor: "secondary.main" }}
              onClick={""}
            >
              Cancel
            </Button>
          </Box>
          <Copyright sx={{ mt: 5 }} />
        </Container>
      </ThemeProvider>
    </div>
  );
};

export default Newcourse;
