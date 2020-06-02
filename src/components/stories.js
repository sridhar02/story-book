import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useHistory, Redirect } from "react-router-dom";

import Table from "@material-ui/core/Table";
import Paper from "@material-ui/core/Paper";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import NativeSelect from "@material-ui/core/NativeSelect";
import TableContainer from "@material-ui/core/TableContainer";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import { Typography, Divider, makeStyles, Button } from "@material-ui/core";

import Navbar from "./navbar";

const useStoriesStyles = makeStyles((theme) => ({
  text: {
    textAlign: "center",
    padding: theme.spacing(2),
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
    fontSize: "18px",
  },
  status: {
    backgroundColor: "#333",
    color: "white",
    borderRadius: "10px",
  },
}));

const Id = "id";
const Complexity = " Complexity";

function UserTable({ stories, role, setStories }) {
  const history = useHistory();
  const classes = useStoriesStyles();
  const [type, setType] = useState("All");
  const [complexity, setComplexity] = useState("");

  const openStory = (story) => {
    history.push(`/story/${story.id}`);
  };

  const filterdArray =
    stories &&
    (type === "All" ? stories : stories.filter((story) => story.type === type));
  // setStories(stories.sort((a, b) => (a.id > b.id ? 1 : -1)));
  // console.log(stories);

  // console.log(stories.sort((a, b) => (a.id > b.id ? 1 : -1)));

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableHeadCell}>
              Id
              <Button onClick={() => filterdArray()}>
                <ImportExportIcon />{" "}
              </Button>
            </TableCell>
            <TableCell className={classes.tableHeadCell}>Summary</TableCell>
            <TableCell className={classes.tableHeadCell}>Description</TableCell>
            <TableCell className={classes.tableHeadCell}>
              Type
              <div>
                <NativeSelect
                  id="select"
                  value={type}
                  onChange={(event) => setType(event.target.value)}
                >
                  <option value="All">All</option>
                  <option value={"enhancement"}>enhancement</option>
                  <option value={"bugfix"}>bugfix</option>
                  <option value={"development"}>development</option>
                </NativeSelect>
              </div>
            </TableCell>
            <TableCell className={classes.tableHeadCell}>
              Complexity
              <Button>
                <ImportExportIcon />
              </Button>
            </TableCell>
            <TableCell className={classes.tableHeadCell}>
              Estimated Hours
            </TableCell>
            <TableCell className={classes.tableHeadCell}>Cost</TableCell>
            {role === "Admin" && (
              <TableCell className={classes.tableHeadCell}>status</TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {filterdArray &&
            filterdArray.map((story) => (
              <TableRow
                key={story.id}
                onClick={() => openStory(story)}
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
                {role === "Admin" && (
                  <TableCell>
                    <Button className={classes.status}>Pending</Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function UserStories({ stories, role, setStories }) {
  const classes = useStoriesStyles();

  return (
    <div>
      {role === "user" ? (
        <Typography className={classes.text} variant="h6">
          User Stories
        </Typography>
      ) : (
        <Typography className={classes.text} variant="h6">
          Admin Stories
        </Typography>
      )}
      <Divider />
      <UserTable stories={stories} role={role} setStories={setStories} />
    </div>
  );
}

export default function Stories() {
  const [role, setRole] = useState("");
  const [stories, setStories] = useState("");

  const [isLoggedIn] = useState(() => {
    if (
      localStorage.getItem("token") &&
      localStorage.getItem("token").length !== 0
    ) {
      return true;
    }
    return false;
  });

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
      {isLoggedIn === false && <Redirect to="/" />}
      <Navbar />
      <Divider />
      <UserStories stories={stories} role={role} setStories={setStories} />
    </>
  );
}
