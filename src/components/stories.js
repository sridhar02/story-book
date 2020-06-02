import React, { useState, useEffect } from "react";
// import { useHistory } from "react-router-dom";

import Axios from "axios";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Typography,Divider } from "@material-ui/core";

import Navbar from "./navbar";

function UserTable({ stories }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell>Summary</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Complexity</TableCell>
            <TableCell>Estimated Hours</TableCell>
            <TableCell>Cost</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stories &&
            stories.map((story) => (
              <TableRow key={story.id}>
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
  return (
    <>
      <Typography variant="h6">Admin Stories</Typography>
      <UserTable stories={stories} />
    </>
  );
}

function UserStories({ stories }) {
  return (
    <div>
      <Typography variant="h6">User Stories</Typography>
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

  console.log(role);
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
