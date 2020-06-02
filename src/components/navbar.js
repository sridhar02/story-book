import React from "react";
import { useHistory } from "react-router-dom";

import { Button, makeStyles, Typography } from "@material-ui/core";

const useNavbarStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "space-between",
    [theme.breakpoints.down("sm")]: {
      // ustifyContent: "none",
      display: "block",
      marginTop: theme.spacing(1),
    },
  },
  spacing: {
    margin: theme.spacing(2, 0, 3, 0),
  },
}));

export default function Navbar() {
  const classes = useNavbarStyles();
  const history = useHistory();

  const newStory = () => {
    history.push("/new");
  };

  const handleSignout = () => {
    localStorage.removeItem("token");
    history.push("/");
  };

  return (
    <div className={classes.container}>
      <Typography variant="h4">Story Book</Typography>
      <div className={classes.spacing}>
        <Button variant="contained" onClick={newStory}>
          +Create new Story
        </Button>
        <Button onClick={handleSignout}>Logout</Button>
      </div>
    </div>
  );
}
