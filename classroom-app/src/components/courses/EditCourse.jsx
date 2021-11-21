import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import CardMedia from "@mui/material/CardMedia";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import auth from "../../auth/AuthHelper";
import { read, update } from "../../api/Api-Course";
import { Redirect } from "react-router";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import SchoolIcon from "@mui/icons-material/School";
import CategoryIcon from "@mui/icons-material/Category";
import defaultCourseImage from "../../assets/images/s4.jpeg";
import { CardHeader } from "@material-ui/core";
import TextField from "@mui/material/TextField";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import IconButton from "@mui/material/IconButton";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import { ListItemSecondaryAction } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const Div = styled("div")(({ theme }) => ({
  ...theme.typography.button,
  backgroundColor: "#03a9f4",
  padding: theme.spacing(1),
  color: "white",
  fontSize: 18,
}));

const Input = styled("input")({
  display: "none",
});

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Editcourse = ({ match }) => {
  const [course, setCourse] = useState({
    name: "",
    description: "",
    image: "",
    category: "",
    instructor: {},
    lessons: [],
  });

  const [values, setValues] = useState({
    redirect: false,
    error: "",
  });
  const [snackOpen, setSnackOpen] = useState(false);
  const [dense, setDense] = useState(false);

  const handleSnackClose = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackOpen(false);
  };

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    read({ courseId: match.params.courseId }, signal).then((data) => {
      console.log(`----reading single course data---`);
      console.log(data);
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        data.image = "";
        setCourse(data);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.courseId]);

  const jwt = auth.isAuthenticated();

  const handleChange = (name) => (e) => {
    const value = name === "image" ? e.target.files[0] : e.target.value;
    setCourse({ ...course, [name]: value });
  };

  const handleLessonChange = (name, i) => (e) => {
    const lessons = course.lessons;
    lessons[i][name] = e.target.value;
    setCourse({ ...course, lessons: lessons });
  };

  const deleteLesson = (i) => (e) => {
    const lessons = course.lessons;
    lessons.splice(i, 1);
    setCourse({ ...course, lessons: lessons });
  };

  const moveUpLesson = (i) => (e) => {
    const lessons = course.lessons;
    const moveUpLesson = lessons[i];
    lessons[i] = lessons[i - 1];
    lessons[i - 1] = moveUpLesson;
    setCourse({ ...course, lessons: lessons });
  };

  const handleSubmit = () => {
    let courseData = new FormData();
    course.name && courseData.append("name", course.name);
    course.description && courseData.append("description", course.description);
    course.image && courseData.append("image", course.image);
    course.category && courseData.append("category", course.category);
    courseData.append("lessons", JSON.stringify(course.lessons));

    update(
      { courseId: match.params.courseId },
      { t: jwt.token },
      courseData
    ).then((data) => {
      if (data && data.error) {
        console.log(data.error);
        setValues({ ...values, error: data.error });
        setSnackOpen(true);
      } else {
        setValues({ ...values, redirect: true });
      }
    });
  };

  if (values.redirect) {
    return <Redirect to={`/teach/course/${course._id}`} />;
  }

  const imageUrl = course._id
    ? `${process.env.REACT_APP_API}/api/courses/photo/${
        course._id
      }?${new Date().getTime()}`
    : `https://t4.ftcdn.net/jpg/00/87/32/73/240_F_87327303_dSwSPAzvu7TlHIzkuBhHwVWfSJW3Somw.jpg`;

  return (
    <div>
      <Box sx={{ width: "100%", marginTop: 9 }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6}>
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
                <Button
                  variant="contained"
                  color="success"
                  component="span"
                  sx={{ marginLeft: 5 }}
                >
                  Change Picture
                </Button>
              </label>

              <span sx={{ marginLeft: "10px" }}>
                {course.image ? course.image.name : ""}
              </span>
            </Stack>
            <CardMedia
              component="img"
              height="494"
              image={imageUrl}
              alt="Paella dish"
              style={{ marginTop: 30, minHeight: 500 }}
            />
          </Grid>
          <Grid item xs={6}>
            <Item>
              <Div>{`${course.name} Course Information`}</Div>
              <Grid item xs={12} md={6}>
                <List dense={dense}>
                  <ListItem>
                    <ListItemIcon>
                      <SchoolIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <TextField
                          required
                          fullWidth
                          id="name"
                          label="Course Name"
                          name="name"
                          autoComplete="course-name"
                          value={course.name}
                          onChange={handleChange("name")}
                        />
                      }
                      secondary={
                        <div>
                          <Link
                            sx={{ marginBottom: 5 }}
                            underline="none"
                            href={`/user/${course.instructor._id}`}
                          >
                            Instructor : {course.instructor.name}
                          </Link>
                        </div>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />

                  <ListItem>
                    <ListItemIcon>
                      <CategoryIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <TextField
                          required
                          fullWidth
                          id="category"
                          label="Category"
                          name="category"
                          autoComplete="category"
                          value={course.category}
                          onChange={handleChange("category")}
                        />
                      }
                    />
                  </ListItem>

                  <Divider variant="inset" component="li" />
                </List>
                {auth.isAuthenticated().user &&
                  auth.isAuthenticated().user._id === course.instructor._id && (
                    <Stack sx={{ marginTop: 3 }} direction="row" spacing={2}>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={handleSubmit}
                      >
                        Save
                      </Button>
                    </Stack>
                  )}
              </Grid>
            </Item>
            <Item sx={{ marginTop: 5 }}>
              <Div sx={{ marginTop: 5 }}>{"Course Description"}</Div>
              <Box gridColumn="span 6">
                <CardContent>
                  <TextareaAutosize
                    aria-label="minimum height"
                    minRows={3}
                    placeholder="brief description about course"
                    style={{ width: 400 }}
                    id="description"
                    label="description"
                    name="description"
                    value={course.description}
                    onChange={handleChange("description")}
                  />
                </CardContent>
              </Box>
            </Item>
          </Grid>
          <Grid item xs={6}>
            <Item>
              <Div>{"Lessons"}</Div>
              <Box gridColumn="span 6">
                <CardHeader
                  title={
                    <Typography variant="h6" color="text.secondary">
                      Edit and Organize Lessons
                    </Typography>
                  }
                  subheader={
                    <Typography variant="body2">
                      {course.lessons && course.lessons.length} lessons
                    </Typography>
                  }
                />

                <List>
                  {course.lessons &&
                    course.lessons.map((lessons, i) => {
                      return (
                        <span key={i}>
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar>{i + 1}</Avatar>
                              {i !== 0 && (
                                <IconButton
                                  aria-label="up"
                                  color="primary"
                                  onClick={moveUpLesson(i)}
                                >
                                  <ArrowCircleUpIcon />
                                </IconButton>
                              )}
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <>
                                  <TextField
                                    required
                                    fullWidth
                                    id="title"
                                    label="Title"
                                    name="title"
                                    autoComplete="title"
                                    value={lessons.title}
                                    onChange={handleLessonChange("title", i)}
                                    sx={{ marginBottom: 3, width: 450 }}
                                  />
                                  <br />
                                  <TextField
                                    required
                                    fullWidth
                                    id="resourceUrl"
                                    label="resourceUrl"
                                    name="resourceUrl"
                                    autoComplete="resourceUrl"
                                    value={lessons.resourceUrl}
                                    onChange={handleLessonChange(
                                      "resourceUrl",
                                      i
                                    )}
                                    sx={{ marginBottom: 3, width: 450 }}
                                  />
                                  <br />
                                  <TextareaAutosize
                                    aria-label="minimum height"
                                    minRows={5}
                                    placeholder="brief description about content"
                                    style={{ width: 510 }}
                                    id="content"
                                    label="content"
                                    name="content"
                                    autoComplete="content"
                                    value={lessons.content}
                                    onChange={handleLessonChange("content", i)}
                                    sx={{ marginBottom: 3 }}
                                  />
                                </>
                              }
                            />
                            {!course.published && (
                              <ListItemSecondaryAction>
                                <IconButton
                                  edge="end"
                                  aria-label="up"
                                  color="error"
                                  onClick={deleteLesson(i)}
                                >
                                  <Button
                                    onClick={deleteLesson(i)}
                                    variant="contained"
                                    color="error"
                                  >
                                    <DeleteForeverIcon /> DELETE
                                  </Button>
                                </IconButton>
                              </ListItemSecondaryAction>
                            )}
                          </ListItem>
                          <Divider variant="inset" component="li" />
                        </span>
                      );
                    })}
                </List>
              </Box>
            </Item>
          </Grid>
          <Grid item xs={6}>
            <Item>4</Item>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Editcourse;
