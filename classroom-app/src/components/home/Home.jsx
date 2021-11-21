import React, { useState, useEffect } from "react";
import Carousel from "react-material-ui-carousel";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@mui/styles";
import CardMedia from "@mui/material/CardMedia";
import auth from "../../auth/AuthHelper";
import { listPublished } from "../../api/Api-Course";
import { listEnrolled, listCompleted } from "../../api/Api-Enrollment";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import {
  AllCourses,
  Footer,
  AllEnrollments,
  CategoryBanner,
  InstructorBanner,
} from "../allComponents/AllComponents";

const Div = styled("div")(({ theme }) => ({
  ...theme.typography.button,
  backgroundColor: "#42a5f5",
  padding: theme.spacing(1),
  height: 150,
  marginTop: 45,
}));

const useStyles = makeStyles((theme) => ({
  card: {
    width: "100%",
    margin: "auto",
    // height: "50vh",
    marginTop: 20,
    marginBottom: theme.spacing(2),
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  extraTop: {
    marginTop: theme.spacing(12),
  },
  title: {
    padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(
      2
    )}px`,
    color: theme.palette.openTitle,
  },
  media: {
    minHeight: 400,
  },
  gridList: {
    width: "100%",
    minHeight: 200,
    padding: "16px 0 10px",
  },
  tile: {
    textAlign: "center",
  },
  image: {
    height: "100%",
  },
  tileBar: {
    backgroundColor: "rgba(0, 0, 0, 0.72)",
    textAlign: "left",
  },
  enrolledTitle: {
    color: "#efefef",
    marginBottom: 5,
  },
  action: {
    margin: "0 10px",
  },
  enrolledCard: {
    backgroundColor: "#eeeeee",
  },
  divider: {
    marginBottom: 16,
    backgroundColor: "rgb(157, 157, 157)",
  },
  noTitle: {
    color: "lightgrey",
    marginBottom: 12,
    marginLeft: 8,
  },
}));

const Home = () => {
  const classes = useStyles();

  const jwt = auth.isAuthenticated();
  const [courses, setCourses] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const items = [
    {
      img: require("../../assets/images/kids.jpeg").default,
    },
    {
      img: require("../../assets/images/l1.jpeg").default,
    },
    {
      img: require("../../assets/images/l2.jpeg").default,
    },
    {
      img: require("../../assets/images/l3.jpeg").default,
    },
    {
      img: require("../../assets/images/l6.jpeg").default,
    },
  ];

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    listEnrolled({ t: jwt.token }, signal).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setEnrolled(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    listPublished(signal).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setCourses(data);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, []);

  return (
    <div>
      <Carousel>
        {items.map((item, i) => (
          <Item key={i} {...item} />
        ))}
      </Carousel>

      <Div>{""}</Div>

      {auth.isAuthenticated().user && (
        <>
          <Card className={`${classes.card} ${classes.enrolledCard}`}>
            <Div
              sx={{
                backgroundColor: "#1b1b1b",
                height: 55,
                color: "whitesmoke",
                textAlign: "center",
                fontSize: 15,
              }}
            >
              {"Current Enorlled Courses"}
            </Div>
            {enrolled.length !== 0 ? (
              <AllEnrollments enrollments={enrolled} />
            ) : (
              <Typography variant="body1">No courses.</Typography>
            )}
          </Card>
        </>
      )}

      <Card className={`${classes.card} `}>
        <Div
          sx={{
            backgroundColor: "#1b1b1b",
            height: 55,
            color: "whitesmoke",
            textAlign: "center",
            fontSize: 15,
          }}
        >
          {"All Courses"}
        </Div>
        {courses.length !== 0 && courses.length !== enrolled.length ? (
          <AllCourses courses={courses} commonEnrollment={enrolled} />
        ) : (
          <Div>{"No new Courses available yet"}</Div>
        )}
      </Card>

      <CategoryBanner />
      <InstructorBanner />

      <Footer />
    </div>
  );
};

const Item = ({ img }) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={14} md={12}>
          <CardMedia
            component="img"
            height="500"
            image={img}
            alt="Paella dish"
            sx={{ marginTop: 1 }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
