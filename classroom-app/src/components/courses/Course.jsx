import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import CardMedia from "@mui/material/CardMedia";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import auth from "../../auth/AuthHelper";
import { read, update } from "../../api/Api-Course";
import { Redirect } from "react-router";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import CardContent from "@mui/material/CardContent";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
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
import { CardHeader } from "@material-ui/core";
import { NewLesson } from "../allComponents/AllComponents";
import { DeleteCourse } from "../allComponents/AllComponents";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { enrollmentStats } from "../../api/Api-Enrollment";
import { Enroll } from "../allComponents/AllComponents";

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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Course = ({ match }) => {
  const [stats, setStats] = useState({});
  const [course, setCourse] = useState({ instructor: {} });
  const [values, setValues] = useState({
    redirect: false,
    error: "",
  });
  const [open, setOpen] = useState(false);
  const jwt = auth.isAuthenticated();
  const [snackOpen, setSnackOpen] = useState(false);
  const [dense, setDense] = useState(false);
  const [secondary, setSecondary] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    read({ courseId: match.params.courseId }, signal).then((data) => {
      //   console.log(data);
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        console.log(data);
        setCourse(data);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.courseId]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    enrollmentStats(
      { courseId: match.params.courseId },
      { t: jwt.token },
      signal
    ).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setStats(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.courseId]);

  const removeCourse = (course) => {
    setValues({ ...values, redirect: true });
  };

  const addLesson = (course) => {
    setCourse(course);
  };

  const clickPublish = () => {
    if (course.lessons.length > 0) {
      setOpen(true);
    }
  };

  const publish = () => {
    let courseData = new FormData();
    courseData.append("published", true);

    update(
      { courseId: match.params.courseId },
      { t: jwt.token },
      courseData
    ).then((data) => {
      console.log(`-- publishing lesson  ${data}`);
      if (data && data.error) {
        setValues({ ...values, error: data.error });
        setSnackOpen(true);
      } else {
        setCourse({ ...course, published: true });
        setOpen(false);
      }
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (values.redirect) {
    return <Redirect to={`/teach/courses`} />;
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
                      primary={course.name}
                      secondary={
                        <div>
                          <Link
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
                      primary={course.category}
                      secondary={secondary ? "Secondary text" : null}
                    />
                  </ListItem>

                  <Divider variant="inset" component="li" />

                  {auth.isAuthenticated().user &&
                    auth.isAuthenticated().user._id ===
                      course.instructor._id && (
                      <ListItem>
                        {course.published && (
                          <>
                            <ListItemIcon>
                              <PeopleAltIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary={`${stats.totalEnrolled} enrolled`}
                              secondary={secondary ? "Secondary text" : null}
                            />

                            <ListItemIcon>
                              <AssignmentTurnedInIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary={`${stats.totalCompleted} completed`}
                              secondary={secondary ? "Secondary text" : null}
                            />
                          </>
                        )}
                      </ListItem>
                    )}
                </List>
                {auth.isAuthenticated().user &&
                  auth.isAuthenticated().user._id === course.instructor._id && (
                    <Stack sx={{ marginTop: 3 }} direction="row" spacing={2}>
                      <Link
                        href={`/teach/course/edit/${course._id}`}
                        underline="none"
                      >
                        <Button variant="contained" color="success">
                          Edit Course
                        </Button>
                      </Link>

                      {!course.published ? (
                        <>
                          <Button
                            variant="contained"
                            color="warning"
                            onClick={clickPublish}
                          >
                            {course.lessons.length === 0
                              ? `Add  1 lesson `
                              : `Publish`}
                          </Button>

                          <DeleteCourse
                            course={course}
                            onRemove={removeCourse}
                          />
                        </>
                      ) : (
                        <Button variant="contained" color="warning">
                          Published
                        </Button>
                      )}

                      {/* <DeleteUser userId={user._id} /> */}
                    </Stack>
                  )}
              </Grid>
            </Item>
            <Item sx={{ marginTop: 5 }}>
              <Div sx={{ marginTop: 5 }}>{"Course Description"}</Div>
              <Box gridColumn="span 6">
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {course.description}
                  </Typography>
                  {course.published && (
                    <div>
                      <Enroll courseId={course._id} />
                    </div>
                  )}
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
                      Lessons
                    </Typography>
                  }
                  subheader={
                    <Typography variant="body2">
                      {course.lessons && course.lessons.length} lessons
                    </Typography>
                  }
                  action={
                    auth.isAuthenticated().user &&
                    auth.isAuthenticated().user._id === course.instructor._id &&
                    !course.published && (
                      <NewLesson courseId={course._id} addLesson={addLesson} />
                    )
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
                            </ListItemAvatar>
                            <ListItemText primary={lessons.title} />
                          </ListItem>
                          <Divider variant="inset" component="li" />
                        </span>
                      );
                    })}
                </List>
              </Box>
            </Item>

            <div>
              <div>
                <Dialog
                  open={open}
                  TransitionComponent={Transition}
                  keepMounted
                  onClose={handleClose}
                  aria-describedby="alert-dialog-slide-description"
                >
                  <DialogTitle>{"Publish Course  "}</DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                      Publishing your course will be deployed live and be
                      available for students to enroll and start learning. Make
                      sure all the lessons are added, organized and ready to be
                      published
                      <Box
                        component="div"
                        sx={{
                          marginTop: 2,
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="394"
                          image={require("../../assets/images/q3.jpeg").default}
                          alt="Paella dish"
                        />
                      </Box>
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Stack direction="row" spacing={2}>
                      <Button
                        onClick={publish}
                        variant="contained"
                        color="error"
                      >
                        Confirm
                      </Button>
                      <Button
                        onClick={handleClose}
                        variant="contained"
                        color="warning"
                      >
                        Cancel
                      </Button>
                    </Stack>
                  </DialogActions>
                </Dialog>
              </div>
            </div>
          </Grid>
          <Grid item xs={6}>
            <Item>4</Item>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Course;
