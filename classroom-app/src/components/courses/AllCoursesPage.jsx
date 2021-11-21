import React, { useState, useEffect } from "react";
import auth from "../../auth/AuthHelper";
import { experimentalStyled as styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { listPublished } from "../../api/Api-Course";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import { listEnrolled, listCompleted } from "../../api/Api-Enrollment";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const Allcoursespage = () => {
  const jwt = auth.isAuthenticated();
  const [courses, setCourses] = useState([]);
  const [enrolled, setEnrolled] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    listEnrolled({ t: jwt.token }, signal).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        console.log(`-- user enrolled courses ---`);
        console.log(data);
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
        console.log(`--- all published courses ---`);
        console.log(data);
        setCourses(data);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, []);
  return (
    <>
      <Box sx={{ flexGrow: 1, marginTop: 4, backgroundColor: "#f5f5f5" }}>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 2, sm: 8, md: 12 }}
        >
          <Grid item xs={2} sm={4} md={4}>
            <CardMedia
              component="img"
              height="450"
              image={require("../../assets/images/c1.jpeg").default}
              alt="Paella dish"
              sx={{ maxWidth: "100%" }}
            />
          </Grid>
          <Grid item xs={2} sm={4} md={4}>
            <CardMedia
              component="img"
              height="450"
              image={require("../../assets/images/c4.jpeg").default}
              alt="Paella dish"
              sx={{ maxWidth: "100%" }}
            />
          </Grid>
          <Grid item xs={2} sm={4} md={4}>
            <CardMedia
              component="img"
              height="450"
              image={require("../../assets/images/c2.jpeg").default}
              alt="Paella dish"
              sx={{ maxWidth: "100%" }}
            />
          </Grid>
        </Grid>
      </Box>
      <Divider sx={{ marginTop: 5 }} />

      <Grid
        container
        spacing={0}
        align="center"
        justify="center"
        direction="column"
        sx={{ marginTop: 5 }}
      >
        <Grid
          item
          style={{
            backgroundColor: "#f5f5f5",
            height: "100%",
          }}
        >
          <Typography
            variant="subtitle1"
            gutterBottom
            component="div"
            sx={{ fontSize: 20, paddingTop: 5, paddingBottom: 5 }}
          >
            Ready to learn and acquire great and intensive knowledge. Choose any
            course you want, understand the description and start learning today
          </Typography>{" "}
        </Grid>
        <Divider sx={{ marginTop: 5 }} />
      </Grid>

      <Box sx={{ flexGrow: 1, marginTop: 4 }}>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 2, sm: 12, md: 12 }}
        >
          {courses.map((c, i) => (
            <Grid item xs={2} sm={4} md={4} key={i} justify="center">
              {" "}
              <Link href={`/teach/course/${c._id}`} underline="none">
                <Card
                  sx={{ maxWidth: 350, marginLeft: 2, marginRight: 2 }}
                  key={i}
                >
                  {console.log(`----- value of c is -----`)}
                  {console.log(c)}
                  <CardMedia
                    component="img"
                    height="140"
                    src={`${process.env.REACT_APP_API}/api/courses/photo/${c._id}?w=248&fit=crop&auto=format`}
                    alt="green iguana"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {c.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {`${c.description.substring(0, 100)}...`}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">
                      {c.lessons.length > 1
                        ? `${c.lessons.length} Lessons`
                        : `${c.lessons.length} Lesson`}{" "}
                    </Button>
                    <Button size="small">
                      View more
                      {/* {enrolled.course._id && `enrolled`} */}
                    </Button>
                  </CardActions>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default Allcoursespage;
