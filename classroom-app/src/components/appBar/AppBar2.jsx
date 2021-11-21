import React from "react";
import { withRouter } from "react-router-dom";
import auth from "../../auth/AuthHelper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Logout from "@mui/icons-material/Logout";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";

const isActive = (history, path) => {
  if (history.location.path === path) {
    return { color: "#f57c00" };
  } else return { color: "#fffde7" };
};

const isPartActive = (history, path) => {
  if (history.location.pathname.includes(path))
    return { color: "#fffde7", backgroundColor: "#f57c00", marginRight: 10 };
  else
    return {
      color: "#616161",
      backgroundColor: "#fffde7",
      border: "1px solid #f57c00",
      marginRight: 10,
    };
};

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

const Appbar2 = withRouter(({ history }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            textAlign: "center",
            bgcolor: "secondary.main",
            color: "whitesmoke",
            flexGrow: 55,
          }}
        >
          <Link href="/" underline="none" sx={{ flexGrow: 1 }}>
            <Typography
              sx={{ minWidth: 100, flexGrow: 1, color: "whitesmoke" }}
            >
              Home
            </Typography>
          </Link>

          {auth.isAuthenticated() && (
            <Link
              underline="none"
              href={`/user/${auth.isAuthenticated().user._id}`}
              sx={{ flexGrow: 1 }}
            >
              <Typography
                sx={{ minWidth: 100, flexGrow: 1 }}
                style={isActive(
                  history,

                  `/user/${auth.isAuthenticated().user._id}`
                )}
              >
                Profile
              </Typography>
            </Link>
          )}

          <Link href="/about" underline="none" sx={{ flexGrow: 1 }}>
            <Typography
              sx={{ minWidth: 100, flexGrow: 1, color: "whitesmoke" }}
            >
              About
            </Typography>
          </Link>

          {auth.isAuthenticated() && (
            <Tooltip title="Actions">
              <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
                <Avatar
                  alt="profile-pic"
                  src={`${process.env.REACT_APP_API}/api/users/photo/${
                    auth.isAuthenticated().user._id
                  }`}
                  sx={{ width: 32, height: 32 }}
                >
                  M
                </Avatar>
              </IconButton>
            </Tooltip>
          )}
          {!auth.isAuthenticated() && (
            <Tooltip title="">
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 1, sm: 2, md: 4 }}
                sx={{ marginLeft: 3 }}
              >
                <Link href="/signup" underline="none">
                  <Button
                    style={isActive(history, "/signup")}
                    variant="contained"
                    // color="success"
                    sx={{ bgcolor: "primary.main" }}
                    size="small"
                  >
                    SignUp
                  </Button>
                </Link>
                <Link href="/signin" underline="none">
                  <Button
                    style={isActive(history, "/signin")}
                    variant="outlined"
                    color="warning"
                    size="small"
                  >
                    SignIn
                  </Button>
                </Link>
              </Stack>
            </Tooltip>
          )}
        </Box>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          {auth.isAuthenticated() && (
            <MenuItem>
              <Avatar
                alt="profile-pic"
                src={`${process.env.REACT_APP_API}/api/users/photo/${
                  auth.isAuthenticated().user._id
                }`}
              />
              <Link
                href={`/user/${auth.isAuthenticated().user._id}`}
                underline="none"
              >
                <Button
                  style={isActive(
                    history,

                    `/user/${auth.isAuthenticated().user._id}`
                  )}
                  variant="contained"
                  color="warning"
                >
                  My Profile
                </Button>
              </Link>
            </MenuItem>
          )}

          {auth.isAuthenticated() && auth.isAuthenticated().user.educator && (
            <MenuItem>
              <LocalLibraryIcon />
              <Link href="/teach/courses" underline="none">
                <Button
                  style={isPartActive(history, "/teach/")}
                  variant="contained"
                  color="primary"
                  sx={{ marginLeft: 1.5 }}
                >
                  Teach
                </Button>
              </Link>
            </MenuItem>
          )}

          <Divider />
          <MenuItem>
            <ListItemIcon>
              <PersonAdd fontSize="small" />
            </ListItemIcon>
            <Link href={`/users`} underline="none">
              <Button
                style={isActive(history, `/users`)}
                variant="contained"
                // color="#000000"
                sx={{ bgcolor: "#000000" }}
              >
                Students
              </Button>
            </Link>
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <LibraryBooksIcon fontSize="small" />
            </ListItemIcon>
            <Link underline="none" color="black" href={"/all-courses"}>
              <Button
                style={isActive(history, `/users`)}
                variant="contained"
                // color="#000000"
                sx={{ bgcolor: "#29b6f6" }}
              >
                All Course
              </Button>
            </Link>
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            <Link href="/signup" underline="none">
              <Button
                onClick={() => {
                  auth.clearJWT(() => history.push("/"));
                }}
                variant="contained"
                color="error"
              >
                Log-Out
              </Button>
            </Link>
          </MenuItem>
        </Menu>
      </ThemeProvider>
    </React.Fragment>
  );
});

export default Appbar2;
