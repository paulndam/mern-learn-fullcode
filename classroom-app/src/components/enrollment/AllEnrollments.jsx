import React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import Link from "@mui/material/Link";
import { makeStyles } from "@mui/styles";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import ListSubheader from "@mui/material/ListSubheader";

const useStyles = makeStyles((theme) => ({
  title: {
    padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(
      2
    )}px`,
    color: theme.palette.openTitle,
  },
  media: {
    minHeight: 400,
  },
  container: {
    minWidth: "100%",
    paddingBottom: "14px",
  },
  gridList: {
    width: "100%",
    minHeight: 100,
    padding: "12px 0 10px",
  },
  tile: {
    textAlign: "center",
  },
  image: {
    height: "100%",
    width: "100%",
  },
  tileBar: {
    backgroundColor: "primary.main",
    textAlign: "left",
    width: "100%",
    height: 55,
  },
  tileTitle: {
    fontSize: "1.1em",
    marginBottom: "5px",
    color: "#fffde7",
    display: "block",
  },
  action: {
    margin: "0 10px",
  },
  progress: {
    color: "#ffb300",
  },
}));

const Allenrollments = (props) => {
  const classes = useStyles();

  return (
    <ImageList sx={{ width: "100%", height: 450 }}>
      <ImageListItem key="Subheader" cols={2}>
        <ListSubheader component="div"></ListSubheader>
      </ImageListItem>
      {props.enrollments.map((c, i) => (
        <ImageListItem key={i}>
          <Link underline="none" href={`/learn/${c._id}`}>
            <img
              className={classes.image}
              src={`${process.env.REACT_APP_API}/api/courses/photo/${c.course._id}`}
              srcSet={`${process.env.REACT_APP_API}/api/courses/photo/${c.course._id}`}
              alt={c.course.name}
              loading="lazy"
            />
          </Link>
          <ImageListItemBar
            className={classes.tileBar}
            sx={{ backgroundColor: "#b39ddb" }}
            title={
              <Link
                underline="none"
                href={`/learn/${c._id}`}
                sx={{ color: "white" }}
              >
                {c.course.name}
              </Link>
            }
            subtitle={<span>Category: {c.course.category}</span>}
            actionIcon={
              <>
                {c.completed ? (
                  <AssignmentTurnedInIcon color="success" />
                ) : (
                  <DonutLargeIcon className={classes.progress} />
                )}
              </>
            }
            position="below"
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
};

export default Allenrollments;
