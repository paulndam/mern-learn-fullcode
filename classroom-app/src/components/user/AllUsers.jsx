import React, { useState, useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { list } from "../../api/Api-User";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import CardMedia from "@mui/material/CardMedia";
import Carousel from "react-material-ui-carousel";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const Allusers = () => {
  const [user, setUsers] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    list(signal).then((data) => {
      console.log(`Fetching all users`);
      console.log(data);
      if (data && data.error) {
        console.log(`Error fetching all users`);
        console.log(data.error);
      } else {
        setUsers(data);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, []);

  const items = [
    {
      img: require("../../assets/images/s1.jpeg").default,
    },
    {
      img: require("../../assets/images/s2.jpeg").default,
    },

    {
      img: require("../../assets/images/s3.jpeg").default,
    },
  ];

  return (
    <>
      <Grid
        container
        spacing={0}
        align="center"
        justify="center"
        direction="column"
        style={{ backgroundColor: "teal", marginTop: 20 }}
      >
        <Grid item style={{ backgroundColor: "yellow" }}>
          <h2>Today we learn. Tomorrow we lead together</h2>
          <i>
            <p>
              Get to know your fellow mates in the platform. Check out their
              profiles and reach out to them if needed. Here goes and old saying
              "Two heads are better than one."
            </p>
            <p>
              Thanks to <a href="/">Mern-Learn</a> for improving upon my
              original!
            </p>
          </i>
        </Grid>
      </Grid>

      <Box component="div" sx={{ flexGrow: 1 }}>
        <Box sx={{ width: "100%", marginTop: 10, marginLeft: 20 }}>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid item xs={6}>
              <Item>
                <Carousel>
                  {items.map((item, i) => (
                    <ItemCarousel key={i} {...item} />
                  ))}
                </Carousel>
              </Item>
            </Grid>
            <Grid item xs={6}>
              <List
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  bgcolor: "background.paper",
                }}
              >
                {user.map((u, i) => (
                  <Link href={`/user/${u._id}`} key={i} underline="none">
                    <ListItem
                      alignItems="flex-start"
                      secondaryAction={
                        <IconButton edge="end" aria-label="delete">
                          <DoubleArrowIcon />
                        </IconButton>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar
                          alt="Remy Sharp"
                          src="/static/images/avatar/1.jpg"
                        >
                          <AssignmentIndIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={u.name}
                        secondary={
                          <React.Fragment>
                            <Typography
                              sx={{ display: "inline" }}
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {u.email}
                            </Typography>
                            {
                              " — I'll be in your neighborhood doing errands this…"
                            }
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </Link>
                ))}
              </List>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

const ItemCarousel = ({ img }) => {
  return (
    <CardMedia
      component="img"
      height="494"
      image={img}
      alt="Paella dish"
      style={{ marginTop: 30, minHeight: 500 }}
    />
  );
};

export default Allusers;
