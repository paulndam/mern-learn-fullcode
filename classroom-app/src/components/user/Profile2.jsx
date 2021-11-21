import React, { useState, useEffect } from "react";
import auth from "../../auth/AuthHelper";
import { read } from "../../api/Api-User";
import { Redirect } from "react-router-dom";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { mainListItems } from "./listItems";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import EmailIcon from "@mui/icons-material/Email";
import DateRangeIcon from "@mui/icons-material/DateRange";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { DeleteUser } from "../allComponents/AllComponents";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import SchoolIcon from "@mui/icons-material/School";
import { listEnrolled, listCompleted } from "../../api/Api-Enrollment";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import CardContent from "@mui/material/CardContent";

const Div = styled("div")(({ theme }) => ({
  ...theme.typography.button,
  backgroundColor: "#03a9f4",
  padding: theme.spacing(1),
  color: "whitesmoke",
  fontSize: 16,
  textAlign: "center",
}));

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

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: "black",
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const mdTheme = createTheme();

const Profile2 = ({ match }, props) => {
  const [user, setUser] = useState({});
  const [enrolled, setEnrolled] = useState([]);
  const [redirectToSignIn, setRedirectToSignIn] = useState(false);
  const jwt = auth.isAuthenticated();
  const [open, setOpen] = useState(true);
  const [dense, setDense] = useState(false);
  const [secondary, setSecondary] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    read(
      {
        userId: match.params.userId,
      },
      { t: jwt.token },
      signal
    ).then((data) => {
      //   console.log(data);
      if (data && data.error) {
        setRedirectToSignIn(true);
      } else {
        console.log(`--- user data infor ---`);
        console.log(data);
        setUser(data);
        //   setValues({user:data})
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.userId, jwt.token]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    listEnrolled({ t: jwt.token }, signal).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        console.log(`--user enrolled courses ---`);
        console.log(data);
        setEnrolled(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const photoUrl = user._id
    ? `${process.env.REACT_APP_API}/api/users/photo/${
        user._id
      }?${new Date().getTime()}`
    : `${process.env.REACT_APP_API}/api/users/defaultphoto`;

  if (redirectToSignIn) {
    return <Redirect to="/signin" />;
  }

  return (
    <>
      <ThemeProvider theme={mdTheme}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <AppBar position="absolute" open={open}>
            <Toolbar
              sx={{
                pr: "24px", // keep right padding when drawer closed
              }}
            >
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer}
                sx={{
                  marginRight: "36px",
                  ...(open && { display: "none" }),
                }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                sx={{ flexGrow: 1 }}
              >
                Dashboard
              </Typography>
              <IconButton color="inherit">
                <Badge>
                  <Avatar alt="Remy Sharp" src={photoUrl} />
                </Badge>
              </IconButton>
            </Toolbar>
          </AppBar>
          <Drawer variant="permanent" open={open}>
            <Toolbar
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                px: [1],
              }}
            >
              <IconButton onClick={toggleDrawer}>
                <ChevronLeftIcon />
              </IconButton>
            </Toolbar>
            <Divider />
            <List>{mainListItems}</List>
            <Divider />
          </Drawer>

          <Box
            component="main"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "light"
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              flexGrow: 1,
              height: "100vh",
              overflow: "auto",
            }}
          >
            <Toolbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8} lg={9}>
                  <Paper
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      width: "100%",
                    }}
                  >
                    <Div>{"Profile"}</Div>
                    <Divider sx={{ marginTop: 2 }} />
                    <List dense={dense}>
                      <ListItem>
                        <ListItemIcon>
                          <SchoolIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={user.name}
                          secondary={secondary ? "Secondary text" : null}
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                      <ListItem>
                        <ListItemIcon>
                          <EmailIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={user.email}
                          secondary={secondary ? "Secondary text" : null}
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                      {user.educator && (
                        <ListItem>
                          <ListItemIcon>
                            <AccountBoxIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={user.educator && `Educator`}
                            secondary={secondary ? "Secondary text" : null}
                          />
                        </ListItem>
                      )}
                      <Divider variant="inset" component="li" />
                      <ListItem>
                        <ListItemIcon>
                          <DateRangeIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={`Joined on : ${new Date(
                            user.created
                          ).toDateString()}`}
                          secondary={secondary ? "Secondary text" : null}
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </List>

                    {auth.isAuthenticated().user &&
                      auth.isAuthenticated().user._id === user._id && (
                        <Stack
                          sx={{ marginTop: 3 }}
                          direction="row"
                          spacing={2}
                        >
                          <Link
                            href={`/user/edit/${user._id}`}
                            underline="none"
                          >
                            <Button variant="contained" color="success">
                              Edit
                            </Button>
                          </Link>

                          <DeleteUser userId={user._id} />
                        </Stack>
                      )}
                  </Paper>
                </Grid>

                <Grid item xs={12} md={8} lg={9}>
                  <Paper
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      width: "100%",
                    }}
                  >
                    <Div>{"About"}</Div>
                    <Divider sx={{ marginTop: 2 }} />
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        {user.about}
                      </Typography>
                    </CardContent>
                  </Paper>
                </Grid>

                {auth.isAuthenticated() &&
                  auth.isAuthenticated().user._id === user._id && (
                    <Grid item xs={12} md={8} lg={9}>
                      <Paper
                        sx={{
                          p: 2,
                          display: "flex",
                          flexDirection: "column",
                          height: "100%",
                          width: "100%",
                        }}
                      >
                        <Div>{"My Enrolled Courses"}</Div>
                        <Divider sx={{ marginTop: 2 }} />
                        <List
                          dense={dense}
                          sx={{
                            width: "100%",
                            maxWidth: 360,
                            bgcolor: "background.paper",
                          }}
                        >
                          {enrolled.map((c, i) => (
                            <Link
                              underline="none"
                              href={`/learn/${c._id}`}
                              key={i}
                            >
                              <ListItem>
                                <ListItemAvatar>
                                  <Avatar
                                    src={`${process.env.REACT_APP_API}/api/courses/photo/${c.course._id}`}
                                  />
                                </ListItemAvatar>
                                <ListItemText
                                  primary={c.course.name}
                                  secondary={
                                    //console.log(c.lessonStatus),
                                    c.completed ? (
                                      <>
                                        <AssignmentTurnedInIcon color="success" />
                                        <Typography
                                          variant="subtitle2"
                                          gutterBottom
                                          component="div"
                                        >
                                          Completed
                                        </Typography>
                                      </>
                                    ) : (
                                      <>
                                        <DonutLargeIcon color="warning" />
                                        <Typography
                                          variant="subtitle2"
                                          gutterBottom
                                          component="div"
                                        >
                                          Inprogress
                                        </Typography>
                                      </>
                                    )
                                  }
                                />
                              </ListItem>
                              <Divider variant="inset" component="li" />
                            </Link>
                          ))}
                        </List>
                      </Paper>
                    </Grid>
                  )}
              </Grid>
              <Copyright sx={{ pt: 4 }} />
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
    </>
  );
};

export default Profile2;
