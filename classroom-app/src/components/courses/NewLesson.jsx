import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Slide from "@mui/material/Slide";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import auth from "../../auth/AuthHelper";
import { styled } from "@mui/material/styles";
import { newLesson } from "../../api/Api-Course";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import PropTypes from "prop-types";
import TextareaAutosize from "@mui/material/TextareaAutosize";

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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Newlesson = (props) => {
  const [open, setOpen] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);

  const [values, setValues] = useState({
    title: "",
    content: "",
    resourceUrl: "",
    error: "",
  });

  const handleChange = (name) => (e) => {
    setValues({ ...values, [name]: e.target.value });
  };

  const handleSubmit = () => {
    const jwt = auth.isAuthenticated();
    const lesson = {
      title: values.title || undefined,
      content: values.content || undefined,
      resourceUrl: values.resourceUrl || undefined,
    };

    newLesson(
      {
        courseId: props.courseId,
      },
      { t: jwt.token },
      lesson
    ).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
        setSnackOpen(true);
      } else {
        props.addLesson(data);
        setValues({
          ...values,
          title: "",
          content: "",
          resourceUrl: "",
          error: "",
        });
        setOpen(false);
      }
    });
  };

  const handleSnackClose = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackOpen(false);
  };

  const handlClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
            <Stack direction="row" spacing={2}>
              <Button
                onClick={handlClickOpen}
                variant="contained"
                // sx={{ mt: 3, mb: 2, bgcolor: "#f57c00" }}
                color="warning"
              >
                {"Add Lesson"}
              </Button>
            </Stack>

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

            <Dialog
              open={open}
              TransitionComponent={Transition}
              keepMounted
              onClose={handleClose}
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle>{"Add New Lesson  "}</DialogTitle>
              <DialogContent>
                <Box sx={{ mt: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        id="title"
                        label="Title"
                        name="title"
                        autoComplete="title"
                        value={values.title}
                        onChange={handleChange("title")}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        id="resourceUrl"
                        label="resourceUrl"
                        name="resourceUrl"
                        autoComplete="resourceUrl"
                        value={values.resourceUrl}
                        onChange={handleChange("resourceUrl")}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextareaAutosize
                        aria-label="minimum height"
                        minRows={4}
                        placeholder="brief description about content"
                        style={{ width: 550 }}
                        id="content"
                        label="content"
                        name="content"
                        autoComplete="content"
                        value={values.content}
                        onChange={handleChange("content")}
                      />
                    </Grid>
                  </Grid>

                  <DialogActions>
                    <Stack direction="row" spacing={2}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                      >
                        Add
                      </Button>

                      <Button
                        variant="contained"
                        color="error"
                        onClick={handleClose}
                      >
                        Cancel
                      </Button>
                    </Stack>
                  </DialogActions>
                </Box>
              </DialogContent>
            </Dialog>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
};

Newlesson.propTypes = {
  courseId: PropTypes.string.isRequired,
  addLesson: PropTypes.func.isRequired,
};

export default Newlesson;
