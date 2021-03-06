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
  const history = useHistory();
  const classes = useLoginStyles();

  const [email, setEmail] = useState("");
  const [isAdmin, setAdmin] = useState(false);
  const [password, setPassword] = useState("");

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
      const reg = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (reg.test(email) === true) {
        const response = await Axios.post(
          `${process.env.REACT_APP_BACKEND_API}/api/v1/signin`,
          payload
        );
        if (response.status === 200) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("role", response.data.role);
          history.push("/stories");
        }
      } else {
        alert("Please enter a vaild email address");
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className={classes.container}>
      {isLoggedIn && <Redirect to="/stories" />}
      <h1>Login to Story Book</h1>
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
