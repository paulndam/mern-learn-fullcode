import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import auth from "../../auth/AuthHelper";
import { read } from "../../api/Api-User";
import { Redirect } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import Grid from "@mui/material/Grid";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import EmailIcon from "@mui/icons-material/Email";
import DateRangeIcon from "@mui/icons-material/DateRange";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import { DeleteUser } from "../allComponents/AllComponents";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import Toolbar from "@mui/material/Toolbar";
import HomeIcon from "@mui/icons-material/Home";
import GroupIcon from "@mui/icons-material/Group";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import SchoolIcon from "@mui/icons-material/School";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import { listEnrolled, listCompleted } from "../../api/Api-Enrollment";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";

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
  color: "whitesmoke",
  fontSize: 18,
}));

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

const drawerWidth = 240;

const Profile = ({ match }, props) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [user, setUser] = useState({});
  const [enrolled, setEnrolled] = useState([]);
  const [redirectToSignIn, setRedirectToSignIn] = useState(false);
  //   const [values, setValues] = useState({ user });
  const jwt = auth.isAuthenticated();

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

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const photoUrl = user._id
    ? `${process.env.REACT_APP_API}/api/users/photo/${
        user._id
      }?${new Date().getTime()}`
    : `${process.env.REACT_APP_API}/api/users/defaultphoto`;

  if (redirectToSignIn) {
    return <Redirect to="/signin" />;
  }

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        <Link underline="none" href={"/"}>
          <ListItem button>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary={"Home"} />
          </ListItem>
        </Link>

        <Link underline="none" href={"/users"}>
          <ListItem button>
            <ListItemIcon>
              <GroupIcon />
            </ListItemIcon>
            <ListItemText primary={"Students"} />
          </ListItem>
        </Link>

        <Link underline="none" href={"/all-courses"}>
          <ListItem button>
            <ListItemIcon>
              <LocalLibraryIcon />
            </ListItemIcon>
            <ListItemText primary={"All Courses"} />
          </ListItem>
        </Link>

        {auth.isAuthenticated() && auth.isAuthenticated().user.educator && (
          <Link underline="none" href="/teach/courses">
            <ListItem button>
              <ListItemIcon>
                <LocalLibraryIcon />
              </ListItemIcon>
              <ListItemText primary={"Courses"} />
            </ListItem>
          </Link>
        )}
      </List>
      <Divider />
      <List>
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <ListItem>
        <ListItemAvatar>
          <Avatar alt="Remy Sharp" src={photoUrl} />
        </ListItemAvatar>
      </ListItem>
      <Divider />
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <div>
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gap={2}
        sx={{ marginTop: 10 }}
      >
        <Box gridColumn="span 8">
          <Box sx={{ display: "flex" }}>
            <CssBaseline />
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
          </Box>
        </Box>
        <Box gridColumn="span 8" sx={{ marginLeft: 60 }}>
          <Item>
            <Div>{"Profile"}</Div>

            <Grid item xs={12} md={6}>
              <Demo>
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
              </Demo>
            </Grid>
            {auth.isAuthenticated().user &&
              auth.isAuthenticated().user._id === user._id && (
                <Stack sx={{ marginTop: 3 }} direction="row" spacing={2}>
                  <Link href={`/user/edit/${user._id}`} underline="none">
                    <Button variant="contained" color="success">
                      Edit Account
                    </Button>
                  </Link>

                  <DeleteUser userId={user._id} />
                </Stack>
              )}
          </Item>

          <Item sx={{ marginTop: 5 }}>
            <Div sx={{ marginTop: 5 }}>{"About me"}</Div>
            <Box gridColumn="span 6">
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {user.about}
                </Typography>
              </CardContent>
            </Box>
          </Item>

          {auth.isAuthenticated() &&
            auth.isAuthenticated().user._id === user._id && (
              <Item sx={{ marginTop: 5 }}>
                <Div sx={{ marginTop: 5 }}>{"My Enrolled Courses"}</Div>
                <Box gridColumn="span 6">
                  <List
                    sx={{
                      width: "100%",
                      maxWidth: 360,
                      bgcolor: "background.paper",
                    }}
                  >
                    {enrolled.map((c, i) => (
                      <Link underline="none" href={`/learn/${c._id}`} key={i}>
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
                </Box>
              </Item>
            )}
        </Box>
      </Box>
    </div>
  );
};

export default Profile;
