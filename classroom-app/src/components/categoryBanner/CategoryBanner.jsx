import React from "react";
import { experimentalStyled as styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import Divider from "@mui/material/Divider";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const Div = styled("div")(({ theme }) => ({
  ...theme.typography.button,
  backgroundColor: "#42a5f5",
  padding: theme.spacing(1),
  fontFamily: "sans-serif",
  textAlign: "center",
  paddingTop: 25,
  paddingBottom: 25,
  fontSize: 20,
  height: 100,
  marginTop: 20,
}));

const Categorybanner = () => {
  return (
    <>
      <Div>{"Top Categories"}</Div>
      <Box sx={{ flexGrow: 1, marginTop: 10 }}>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 2, sm: 8, md: 12 }}
        >
          <Grid item xs={2} sm={4} md={4}>
            <Item>
              <Typography
                variant="h6"
                gutterBottom
                component="div"
                sx={{ color: "black" }}
              >
                Design
              </Typography>

              <CardMedia
                sx={{ height: "30vh" }}
                component="img"
                height="194"
                image={require("../../assets/images/design1.jpeg").default}
                alt="Paella dish"
              />
            </Item>
          </Grid>
          <Grid item xs={2} sm={4} md={4}>
            <Item>
              <Typography
                variant="h6"
                gutterBottom
                component="div"
                sx={{ color: "black" }}
              >
                Development
              </Typography>

              <CardMedia
                sx={{ height: "30vh" }}
                component="img"
                height="194"
                image={require("../../assets/images/develop1.jpeg").default}
                alt="Paella dish"
              />
            </Item>
          </Grid>
          <Grid item xs={2} sm={4} md={4}>
            <Item>
              <Typography
                variant="h6"
                gutterBottom
                component="div"
                sx={{ color: "black" }}
              >
                Marketing
              </Typography>

              <CardMedia
                sx={{ height: "30vh" }}
                component="img"
                height="194"
                image={require("../../assets/images/mark1.jpeg").default}
                alt="Paella dish"
              />
            </Item>
          </Grid>
          <Grid item xs={2} sm={4} md={4}>
            <Item>
              <Typography
                variant="h6"
                gutterBottom
                component="div"
                sx={{ color: "black" }}
              >
                IT & Software
              </Typography>

              <CardMedia
                sx={{ height: "30vh" }}
                component="img"
                height="194"
                image={require("../../assets/images/IT1.jpeg").default}
                alt="Paella dish"
              />
            </Item>
          </Grid>
          <Grid item xs={2} sm={4} md={4}>
            <Item>
              <Typography
                variant="h6"
                gutterBottom
                component="div"
                sx={{ color: "black" }}
              >
                Business
              </Typography>

              <CardMedia
                sx={{ height: "30vh" }}
                component="img"
                height="194"
                image={require("../../assets/images/business1.jpeg").default}
                alt="Paella dish"
              />
            </Item>
          </Grid>
          <Grid item xs={2} sm={4} md={4}>
            <Item>
              <Typography
                variant="h6"
                gutterBottom
                component="div"
                sx={{ color: "black" }}
              >
                Photography
              </Typography>

              <CardMedia
                sx={{ height: "30vh" }}
                component="img"
                height="194"
                image={require("../../assets/images/photo1.jpeg").default}
                alt="Paella dish"
              />
            </Item>
          </Grid>
        </Grid>
      </Box>
      <Divider sx={{ marginTop: 5 }} />
    </>
  );
};

export default Categorybanner;
