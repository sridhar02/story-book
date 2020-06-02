import React, { useState } from "react";
import { useHistory, Redirect } from "react-router-dom";

import Axios from "axios";
import Checkbox from "@material-ui/core/Checkbox";
import { makeStyles, Button, TextField } from "@material-ui/core";

const useLoginStyles = makeStyles((theme) => ({
  container: {
    height: "80vh",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
  },
  form: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
  },
  spacing: {
    marginTop: theme.spacing(2),
  },
}));

function Login() {
  const classes = useLoginStyles();
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setAdmin] = useState(false);
  const [isLoggedIn] = useState(() => {
    if (
      localStorage.getItem("token") &&
      localStorage.getItem("token").length !== 0
    ) {
      return true;
    }
    return false;
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    let payload = {
      email,
      password,
      isAdmin,
    };
    try {
      const response = await Axios.post(
        "http://localhost:3000/api/v1/signin",
        payload
      );
      console.log(response);
      if (response.status === 200) {
        console.log(response.data);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
        history.push("/stories");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={classes.container}>
      {isLoggedIn && <Redirect to="/stories" />}
      <h1>Login to StoryBook</h1>
      <form onSubmit={handleSubmit}>
        <div className={classes.form}>
          <TextField
            label="Email"
            variant="outlined"
            className={classes.spacing}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <TextField
            type="password"
            label="Password"
            variant="outlined"
            className={classes.spacing}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <div className={classes.spacing}>
            <Checkbox
              color="default"
              name="Login as administrator"
              value={isAdmin}
              onChange={() => setAdmin(!isAdmin)}
            />
            <label> Login as administrator</label>
          </div>

          <div className={classes.spacing}>
            <Button type="submit" variant="contained" color="primary">
              Login
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
