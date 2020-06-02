import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useHistory } from "react-router-dom";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Typography, Divider, makeStyles } from "@material-ui/core";

import Navbar from "./navbar";

const useStoriesStyles = makeStyles((theme) => ({
  text: {
    textAlign: "center",
    margin: theme.spacing(1),
  },
  selected: {
    backgroundColor: "#ccc !important",
  },
  tableRowSelected: {
    "&:hover": {
      cursor: "pointer",
      background: "#aaa",
    },
  },
  tableHeadCell: {
    fontWeight: "bold",
    fontSize:"18px"
  },
}));

function UserTable({ stories }) {
  const history = useHistory();
  const classes = useStoriesStyles();

  const openStory = (story) => {
    history.push(`/story/${story.id}`);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableHeadCell}>Id</TableCell>
            <TableCell className={classes.tableHeadCell}>Summary</TableCell>
            <TableCell className={classes.tableHeadCell}>Description</TableCell>
            <TableCell className={classes.tableHeadCell}>Type</TableCell>
            <TableCell className={classes.tableHeadCell}>Complexity</TableCell>
            <TableCell className={classes.tableHeadCell}>
              Estimated Hours
            </TableCell>
            <TableCell className={classes.tableHeadCell}>Cost</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stories &&
            stories.map((story) => (
              <TableRow
                key={story.id}
                onClick={() => openStory(story)}
                // selected={showButtons === i}
                className={classes.tableRowSelected}
                classes={{ selected: classes.selected }}
              >
                <TableCell>{story.id}</TableCell>
                <TableCell>{story.summary}</TableCell>
                <TableCell>{story.description}</TableCell>
                <TableCell>{story.type}</TableCell>
                <TableCell>{story.complexity}</TableCell>
                <TableCell>{story.estimatedHrs}</TableCell>
                <TableCell>{story.cost}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function AdminStories({ stories }) {
  const classes = useStoriesStyles();
  return (
    <>
      <Typography className={classes.text} variant="h6">
        Admin Stories
      </Typography>
      <UserTable stories={stories} />
    </>
  );
}

function UserStories({ stories }) {
  const classes = useStoriesStyles();
  return (
    <div>
      <Typography className={classes.text} variant="h6">
        User Stories
      </Typography>
      <UserTable stories={stories} />
    </div>
  );
}

export default function Stories() {
  const [role, setRole] = useState("");
  const [stories, setStories] = useState("");

  const fetchStories = async () => {
    const userToken = localStorage.getItem("token");
    try {
      const response = await Axios({
        method: "get",
        url: `http://localhost:3000/api/v1/stories`,
        headers: {
          Authorization: userToken,
        },
      });
      if (response.status === 200) {
        setStories(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStories();
    setRole(localStorage.getItem("role"));
  }, []);

  return (
    <>
      <Navbar />
      <Divider />
      {role === "Admin" ? (
        <AdminStories stories={stories} />
      ) : (
        <UserStories stories={stories} />
      )}
    </>
  );
}
