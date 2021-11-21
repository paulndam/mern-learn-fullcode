import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import auth from "../../auth/AuthHelper";
import { Redirect } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
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
import IconButton from "@mui/material/IconButton";
import { listByInstructor } from "../../api/Api-Course";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const Div = styled("div")(({ theme }) => ({
  ...theme.typography.button,
  backgroundColor: "#0091ea",
  color: "white",
  padding: theme.spacing(1),
}));

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

const drawerWidth = 240;

const Mycourses = (props) => {
  const { window } = props;
  const [courses, setCourses] = useState([]);
  const [redirectToSignin, setRedirectToSignin] = useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const jwt = auth.isAuthenticated();

  const [dense, setDense] = useState(false);
  const [secondary, setSecondary] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    listByInstructor({ userId: jwt.user._id }, { t: jwt.token }, signal).then(
      (data) => {
        if (data.error) {
          setRedirectToSignin(true);
        } else {
          setCourses(data);
        }
      }
    );
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  if (redirectToSignin) {
    return <Redirect to="/signin" />;
  }

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

        <ListItem button>
          <ListItemIcon>
            <Link href="/teach/courses">
              <LocalLibraryIcon />
            </Link>
          </ListItemIcon>
          <ListItemText primary={"Courses"} />
        </ListItem>
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
      {courses.map((course, i) => {
        return (
          <Link underline="none" href={`/teach/course/${course._id}`} key={i}>
            <ListItem>
              <ListItemAvatar>
                <Avatar
                  alt="Remy Sharp"
                  src={`${process.env.REACT_APP_API}/api/courses/photo/${
                    course._id
                  }?${new Date().getTime()}`}
                />
              </ListItemAvatar>
            </ListItem>
            <Divider />
          </Link>
        );
      })}
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
          <Stack
            sx={{ marginTop: 3, marginBottom: 5 }}
            direction="row"
            spacing={2}
          >
            <Link href={`/teach/course/new`} underline="none">
              <Button variant="contained" color="success">
                Add A Course
              </Button>
            </Link>
          </Stack>

          <Item>
            <Div>{"Courses I Teach"}</Div>

            <Grid item xs={12} md={6}>
              <Demo>
                <List dense={dense}>
                  {courses.map((course, i) => {
                    return (
                      <Link
                        href={`/teach/course/${course._id}`}
                        key={i}
                        underline="none"
                      >
                        <ListItem
                          secondaryAction={
                            <IconButton edge="end" aria-label="delete">
                              <Avatar
                                alt="Remy Sharp"
                                src={`${
                                  process.env.REACT_APP_API
                                }/api/courses/photo/${
                                  course._id
                                }?${new Date().getTime()}`}
                              />
                            </IconButton>
                          }
                        >
                          <ListItemIcon>
                            <SchoolIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={course.name}
                            secondary={secondary ? "Secondary text" : null}
                          />
                        </ListItem>
                        <Divider variant="inset" component="li" />

                        <Divider variant="inset" component="li" />
                      </Link>
                    );
                  })}
                </List>
              </Demo>
            </Grid>
          </Item>
          {courses.map((course, i) => {
            return (
              <Link
                href={`/teach/course/${course._id}`}
                key={i}
                underline="none"
              >
                <Item sx={{ marginTop: 5 }}>
                  <Div
                    sx={{ marginTop: 5 }}
                  >{`${course.name} Course Description`}</Div>
                  <Box gridColumn="span 6">
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        {course.description}
                      </Typography>
                    </CardContent>
                  </Box>
                </Item>
              </Link>
            );
          })}
        </Box>
      </Box>
    </div>
  );
};

export default Mycourses;
