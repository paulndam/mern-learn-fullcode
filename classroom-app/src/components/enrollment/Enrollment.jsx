import React, { useState, useEffect } from "react";
import auth from "../../auth/AuthHelper";
import { read, complete } from "../../api/Api-Enrollment";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import { ListItemSecondaryAction } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { makeStyles } from "@mui/styles";
import InfoIcon from "@mui/icons-material/Info";
import Avatar from "@mui/material/Avatar";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import Link from "@mui/material/Link";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import HomeIcon from "@mui/icons-material/Home";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import GroupIcon from "@mui/icons-material/Group";

const useStyles = makeStyles((theme) => ({
  //   root: theme.mixins.gutters({
  //     maxWidth: 800,
  //     margin: "auto",
  //     marginTop: theme.spacing(12),
  //     marginLeft: 250,
  //   }),
  heading: {
    marginBottom: theme.spacing(3),
    fontWeight: 200,
  },
  flex: {
    display: "flex",
    marginBottom: 20,
  },
  card: {
    padding: "24px 40px 20px",
  },
  subheading: {
    margin: "10px",
    color: theme.palette.openTitle,
  },
  details: {
    margin: "16px",
  },
  sub: {
    display: "block",
    margin: "3px 0px 5px 0px",
    fontSize: "0.9em",
  },
  avatar: {
    color: "#9b9b9b",
    border: "1px solid #bdbdbd",
    background: "none",
  },
  media: {
    height: 180,
    display: "inline-block",
    width: "100%",
    marginLeft: "16px",
  },
  icon: {
    verticalAlign: "sub",
  },
  category: {
    color: "#5c5c5c",
    fontSize: "0.9em",
    padding: "3px 5px",
    backgroundColor: "#dbdbdb",
    borderRadius: "0.2em",
    marginTop: 5,
  },
  action: {
    margin: "8px 24px",
    display: "inline-block",
  },
  drawer: {
    width: 240,
    flexShrink: 0,
  },
  drawerPaper: {
    width: 240,
    backgroundColor: "#616161",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  toolbar: theme.mixins.toolbar,
  selectedDrawer: {
    backgroundColor: "#e9e3df",
  },
  unselected: {
    backgroundColor: "#ffffff",
  },
  check: {
    color: "#38cc38",
  },
  subhead: {
    fontSize: "1.2em",
  },
  progress: {
    textAlign: "center",
    color: "#dfdfdf",
    "& span": {
      color: "#fffde7",
      fontSize: "2.15em",
    },
  },
  para: {
    whiteSpace: "pre-wrap",
  },
}));

const drawerWidth = 240;

const Enrollment = ({ match }, props) => {
  const classes = useStyles();

  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [enrollment, setEnrollment] = useState({
    course: { instructor: [] },
    lessonStatus: [],
  });
  const [values, setValues] = useState({
    error: "",
    drawer: -1,
  });
  const [totalComplete, setTotalComplete] = useState(0);
  const jwt = auth.isAuthenticated();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    read(
      { enrollmentId: match.params.enrollmentId },
      { t: jwt.token },
      signal
    ).then((data) => {
      console.log(data);
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        totalCompleted(data.lessonStatus);
        setEnrollment(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.enrollmentId]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const totalCompleted = (lessons) => {
    let count = lessons.reduce((total, lessonStatus) => {
      return total + (lessonStatus.complete ? 1 : 0);
    }, 0);
    setTotalComplete(count);
    return count;
  };

  const selectDrawer = (i) => (e) => {
    setValues({ ...values, drawer: i });
  };

  const markComplete = () => {
    if (!enrollment.lessonStatus[values.drawer].complete) {
      const lessonStatus = enrollment.lessonStatus;
      lessonStatus[values.drawer].complete = true;
      let count = totalCompleted(lessonStatus);

      let updatedData = {};
      updatedData.lessonStatusId = lessonStatus[values.drawer]._id;
      updatedData.complete = true;

      if (count === lessonStatus.length) {
        updatedData.courseCompleted = Date.now();
      }

      complete(
        {
          enrollmentId: match.params.enrollmentId,
        },
        {
          t: jwt.token,
        },
        updatedData
      ).then((data) => {
        if (data && data.error) {
          setValues({ ...values, error: data.error });
        } else {
          setEnrollment({ ...enrollment, lessonStatus: lessonStatus });
        }
      });
    }
  };

  const imageUrl = enrollment._id
    ? `${process.env.REACT_APP_API}/api/courses/photo/${
        enrollment.course._id
      }?${new Date().getTime()}`
    : `${process.env.REACT_APP_API}/api/courses/defaultPhoto`;

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        <ListItem button>
          <ListItemIcon>
            <Link href="/">
              <HomeIcon />
            </Link>
          </ListItemIcon>
          <ListItemText primary={"Home"} />
        </ListItem>

        <ListItem button>
          <ListItemIcon>
            <Link href="/users">
              <GroupIcon />
            </Link>
          </ListItemIcon>
          <ListItemText primary={"Students"} />
        </ListItem>

        {auth.isAuthenticated() && auth.isAuthenticated().user.educator && (
          <ListItem button>
            <ListItemIcon>
              <Link href="/teach/courses">
                <LocalLibraryIcon />
              </Link>
            </ListItemIcon>
            <ListItemText primary={"Courses"} />
          </ListItem>
        )}
      </List>
      <List>
        <ListItem
          button
          onClick={selectDrawer(-1)}
          className={
            values.drawer === -1 ? classes.selectedDrawer : classes.unselected
          }
        >
          <ListItemIcon>
            <InfoIcon />
          </ListItemIcon>
          <ListItemText primary={"Course Overview"} />
        </ListItem>
      </List>
      <Divider />
      <List className={classes.unselected}>
        <ListSubheader component="div" className={classes.subhead}>
          Lessons
        </ListSubheader>
        {enrollment.lessonStatus.map((lesson, i) => (
          <ListItem
            button
            key={i}
            onClick={selectDrawer(i)}
            className={
              values.drawer === i ? classes.selectedDrawer : classes.unselected
            }
          >
            <ListItemAvatar>
              <Avatar className={classes.avatar}>{i + 1}</Avatar>
            </ListItemAvatar>
            <ListItemText primary={enrollment.course.lessons[i].title} />
            <ListItemSecondaryAction>
              {lesson.complete ? (
                <CheckCircleIcon className={classes.check} />
              ) : (
                <RadioButtonUncheckedIcon />
              )}
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem>
          <ListItemText
            primary={
              <div className={classes.progress}>
                {console.log(`--total complete`)}
                {console.log(totalComplete)}
                {/* <span>{totalComplete}</span> out of{" "}
                <span>{enrollment.lessonStatus.length}</span> completed */}
                <Box component="div" display="inline">
                  {totalComplete} out of {enrollment.lessonStatus.length}{" "}
                  completed
                </Box>
              </div>
            }
          />
        </ListItem>
      </List>
      <Divider />
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Course Overview
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {values.drawer === -1 && (
          <Card className={classes.card}>
            <CardHeader
              title={enrollment.course.name}
              subheader={
                <div>
                  <Link
                    to={`/user/${enrollment.course.instructor._id}`}
                    className={classes.sub}
                  >
                    By {enrollment.course.instructor.name}
                  </Link>
                  <span className={classes.category}>
                    {enrollment.course.category}
                  </span>
                </div>
              }
              action={
                totalComplete === enrollment.lessonStatus.length && (
                  <span className={classes.action}>
                    <Button variant="contained" color="secondary">
                      <CheckCircleIcon /> &nbsp; Completed
                    </Button>
                  </span>
                )
              }
            />
            <div className={classes.flex}>
              <CardMedia
                className={classes.media}
                image={imageUrl}
                title={enrollment.course.name}
              />
              <div className={classes.details}>
                <Typography variant="body1" className={classes.subheading}>
                  {enrollment.course.description}
                  <br />
                </Typography>
              </div>
            </div>
            <Divider />
            <div>
              <CardHeader
                title={
                  <Typography variant="h6" className={classes.subheading}>
                    Lessons
                  </Typography>
                }
                subheader={
                  <Typography variant="body1" className={classes.subheading}>
                    {enrollment.course.lessons &&
                      enrollment.course.lessons.length}{" "}
                    lessons
                  </Typography>
                }
                action={
                  auth.isAuthenticated().user &&
                  auth.isAuthenticated().user._id ===
                    enrollment.course.instructor._id && (
                    <span className={classes.action}></span>
                  )
                }
              />
              <List>
                {enrollment.course.lessons &&
                  enrollment.course.lessons.map((lesson, i) => {
                    return (
                      <span key={i}>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar>{i + 1}</Avatar>
                          </ListItemAvatar>
                          <ListItemText primary={lesson.title} />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                      </span>
                    );
                  })}
              </List>
            </div>
          </Card>
        )}
        {values.drawer !== -1 && (
          <>
            <Typography variant="h5" className={classes.heading}>
              {enrollment.course.name}
            </Typography>
            <Card className={classes.card}>
              <CardHeader
                title={enrollment.course.lessons[values.drawer].title}
                action={
                  <Button
                    onClick={markComplete}
                    variant={
                      enrollment.lessonStatus[values.drawer].complete
                        ? "contained"
                        : "outlined"
                    }
                    color="warning"
                  >
                    {enrollment.lessonStatus[values.drawer].complete
                      ? "Completed"
                      : "Mark as complete"}
                  </Button>
                }
              />
              <CardContent>
                <Typography variant="body1" className={classes.para}>
                  {enrollment.course.lessons[values.drawer].content}
                </Typography>
              </CardContent>
              <CardActions>
                <Link
                  href={enrollment.course.lessons[values.drawer].resourceUrl}
                  underline="none"
                >
                  <Button variant="contained" color="primary">
                    Resource Link
                  </Button>
                </Link>
              </CardActions>
            </Card>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Enrollment;
