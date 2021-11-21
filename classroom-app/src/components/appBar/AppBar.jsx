import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";
import { withRouter } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import auth from "../../auth/AuthHelper";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Switch from "@mui/material/Switch";
import MenuIcon from "@mui/icons-material/Menu";

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

const Appbar = withRouter(({ history }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar
            position="static"
            sx={{ bgcolor: "secondary.main", flexGrow: 2 }}
          >
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <HomeIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Mern-Learn
              </Typography>

              <Link
                underline="none"
                href="/"
                sx={{ flexGrow: 1, my: 1, mx: 1.5 }}
              >
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ color: "whitesmoke" }}
                >
                  Home
                </Typography>
              </Link>

              {!auth.isAuthenticated() && (
                <Stack direction="row" spacing={2}>
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
              )}

              {auth.isAuthenticated() && (
                <div>
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                  >
                    <Avatar
                      alt="profile-pic"
                      src={`${process.env.REACT_APP_API}/api/users/photo/${
                        auth.isAuthenticated().user._id
                      }`}
                    />
                  </IconButton>

                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleClose}>
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
                    <MenuItem onClick={handleClose}>
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
                    {auth.isAuthenticated().user.educator && (
                      <MenuItem onClick={handleClose}>Teach</MenuItem>
                    )}

                    <MenuItem onClick={handleClose}>
                      <Stack direction="row" spacing={2}>
                        <Link href="/signup" underline="none">
                          <Button
                            onClick={() => {
                              auth.clearJWT(() => history.push("/"));
                            }}
                            variant="contained"
                            // color="warning"
                            sx={{ bgcolor: "primary.main" }}
                          >
                            Log-Out
                          </Button>
                        </Link>
                      </Stack>
                    </MenuItem>
                  </Menu>
                </div>
              )}
            </Toolbar>
          </AppBar>
        </Box>
      </ThemeProvider>
    </>
  );

  // const renderMenu = (
  //   <Menu
  //     anchorEl={anchorEl}
  //     anchorOrigin={{
  //       vertical: "top",
  //       horizontal: "right",
  //     }}
  //     id={menuId}
  //     keepMounted
  //     transformOrigin={{
  //       vertical: "top",
  //       horizontal: "right",
  //     }}
  //     open={isMenuOpen}
  //     onClose={handleMenuClose}
  //   >
  //     <MenuItem onClick={handleMenuClose}>
  //       {auth.isAuthenticated() && (
  //         <Link
  //           href={`/user/${auth.isAuthenticated().user._id}`}
  //           underline="none"
  //         >
  //           <Button
  //             style={isActive(
  //               history,
  //               `/user/${auth.isAuthenticated().user._id}`
  //             )}
  //             variant="contained"
  //             color="warning"
  //           >
  //             My Profile
  //           </Button>
  //         </Link>
  //       )}
  //     </MenuItem>
  //   </Menu>
  // );

  // const mobileMenuId = "primary-search-account-menu-mobile";
  // const renderMobileMenu = (
  //   <Menu
  //     anchorEl={mobileMoreAnchorEl}
  //     anchorOrigin={{
  //       vertical: "top",
  //       horizontal: "right",
  //     }}
  //     id={mobileMenuId}
  //     keepMounted
  //     transformOrigin={{
  //       vertical: "top",
  //       horizontal: "right",
  //     }}
  //     open={isMobileMenuOpen}
  //     onClose={handleMobileMenuClose}
  //   >
  //     <MenuItem onClick={handleProfileMenuOpen}>
  //       <IconButton
  //         size="large"
  //         aria-label="account of current user"
  //         aria-controls="primary-search-account-menu"
  //         aria-haspopup="true"
  //         color="inherit"
  //       >
  //         <AccountCircle />
  //       </IconButton>
  //       <p>Profile</p>
  //     </MenuItem>
  //   </Menu>
  // );

  // return (
  //   <div>
  //     <ThemeProvider theme={theme}>
  //       <div>
  //         <Box sx={{ flexGrow: 2 }}>
  //           <AppBar position="static" sx={{ bgcolor: "secondary.main" }}>
  //             <Toolbar>
  //               <Link href="/" underline="none">
  //                 <IconButton
  //                   size="large"
  //                   edge="start"
  //                   color="inherit"
  //                   aria-label="menu"
  //                   sx={{ mr: 2 }}
  //                   style={isActive(history, "/")}
  //                 >
  //                   <HomeIcon />
  //                 </IconButton>
  //               </Link>
  //               <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
  //                 Mern-Learn
  //               </Typography>

  //               {auth.isAuthenticated() && (
  //                 <Link
  //                   href="/users"
  //                   underline="none"
  //                   sx={{ flexGrow: 0.1, color: "white", marginRight: 10 }}
  //                 >
  //                   Students
  //                 </Link>
  //               )}

  //               <Link
  //                 href="/about"
  //                 underline="none"
  //                 sx={{ flexGrow: 0.1, color: "white", marginRight: 10 }}
  //               >
  //                 About-Us
  //               </Link>

  //               <Link
  //                 href="/contact"
  //                 underline="none"
  //                 sx={{ flexGrow: 0.1, color: "white", marginRight: 10 }}
  //               >
  //                 Contact
  //               </Link>

  //               {auth.isAuthenticated() && (
  //                 <Link
  //                   href={`/user/${auth.isAuthenticated().user._id}`}
  //                   underline="none"
  //                   sx={{ flexGrow: 0.1, color: "white", marginRight: 10 }}
  //                 >
  //                   Profile
  //                 </Link>
  //               )}

  //               {!auth.isAuthenticated() && (
  //                 <Stack direction="row" spacing={2}>
  //                   <Link href="/signup" underline="none">
  //                     <Button
  //                       style={isActive(history, "/signup")}
  //                       variant="contained"
  //                       //   color="success"
  //                       sx={{ bgcolor: "primary.main" }}
  //                     >
  //                       Sign-Up
  //                     </Button>
  //                   </Link>
  //                   <Link href="/signin" underline="none">
  //                     <Button
  //                       style={isActive(history, "/signin")}
  //                       variant="outlined"
  //                       color="warning"
  //                     >
  //                       Sign-In
  //                     </Button>
  //                   </Link>
  //                 </Stack>
  //               )}

  //               {auth.isAuthenticated() && (
  //                 <>
  //                   <Typography variant="h6" sx={{ p: 2, pb: 0 }}>
  //                     Hello 👋🏻 {auth.isAuthenticated().user.name}
  //                     {console.log(auth.isAuthenticated())}
  //                   </Typography>

  //                   <Box
  //                     sx={{
  //                       display: { xs: "none", md: "flex", marginRight: 50 },
  //                     }}
  //                   >
  //                     <IconButton
  //                       size="large"
  //                       edge="end"
  //                       aria-label="account of current user"
  //                       aria-controls={menuId}
  //                       aria-haspopup="true"
  //                       onClick={handleProfileMenuOpen}
  //                       color="inherit"
  //                     >
  //                       <Avatar
  //                         alt="profile-pic"
  //                         src={`${process.env.REACT_APP_API}/api/users/photo/${
  //                           auth.isAuthenticated().user._id
  //                         }`}
  //                       />
  //                     </IconButton>
  //                   </Box>

  //                   {auth.isAuthenticated() &&
  //                     auth.isAuthenticated().user.educator && (
  //                       <Stack direction="row" spacing={2}>
  //                         <Link href="/teach/courses" underline="none">
  //                           <Button
  //                             style={isPartActive(history, "/teach/")}
  //                             variant="contained"
  //                             color="info"
  //                           >
  //                             Teach
  //                           </Button>
  //                         </Link>
  //                       </Stack>
  //                     )}

  //                   <Stack direction="row" spacing={2}>
  //                     <Link href="/signup" underline="none">
  //                       <Button
  //                         onClick={() => {
  //                           auth.clearJWT(() => history.push("/"));
  //                         }}
  //                         variant="contained"
  //                         color="warning"
  //                         // sx={{ bgcolor: "primary.main" }}
  //                       >
  //                         Log-Out
  //                       </Button>
  //                     </Link>
  //                   </Stack>
  //                 </>
  //               )}
  //             </Toolbar>
  //           </AppBar>
  //           {renderMobileMenu}
  //           {renderMenu}
  //         </Box>
  //       </div>
  //     </ThemeProvider>
  //   </div>
  // );
});

export default Appbar;
