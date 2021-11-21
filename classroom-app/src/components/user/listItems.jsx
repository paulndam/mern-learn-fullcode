import * as React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Link from "@mui/material/Link";
import HomeIcon from "@mui/icons-material/Home";
import GroupIcon from "@mui/icons-material/Group";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import auth from "../../auth/AuthHelper";
import LogoutIcon from "@mui/icons-material/Logout";
import { Redirect } from "react-router";
import Button from "@mui/material/Button";

export const mainListItems = (
  <div>
    <Link underline="none" href={"/"} sx={{ color: "black" }}>
      <ListItem button>
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary={"Home"} />
      </ListItem>
    </Link>
    <Link underline="none" href={"/users"} sx={{ color: "black" }}>
      <ListItem button>
        <ListItemIcon>
          <GroupIcon />
        </ListItemIcon>
        <ListItemText primary={"Students"} />
      </ListItem>
    </Link>
    <Link underline="none" href={"/all-courses"} sx={{ color: "black" }}>
      <ListItem button>
        <ListItemIcon>
          <LocalLibraryIcon />
        </ListItemIcon>
        <ListItemText primary={"All Courses"} />
      </ListItem>
    </Link>
    {auth.isAuthenticated() && auth.isAuthenticated().user.educator && (
      <Link underline="none" href="/teach/courses" sx={{ color: "black" }}>
        <ListItem button>
          <ListItemIcon>
            <LocalLibraryIcon />
          </ListItemIcon>
          <ListItemText primary={"My Courses"} />
        </ListItem>
      </Link>
    )}
    <ListItem button>
      <ListItemIcon>
        <LogoutIcon />
      </ListItemIcon>

      <Link href="/signup" underline="none" sx={{ color: "black" }}>
        <Button
          onClick={() => {
            auth.clearJWT(() => <Redirect to={"/"} />);
          }}
          variant="contained"
          color="error"
        >
          Log-Out
        </Button>
      </Link>
    </ListItem>
  </div>
);
