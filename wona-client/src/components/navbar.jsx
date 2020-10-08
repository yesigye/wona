import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";

// Material UI
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

// Components
import Profile from "./Profile";

// Theme. spread is from "../utils.theme"
import logo from "../images/logo.png";
const styles = (theme) => ({
  ...theme.custom,
  title: {
    flexGrow: 1,
  },
  appBar: {
    backgroundColor: "#fff",
    color: "#888",
    borderBottom: "1px solid #e4e6e7",
  },
  logo: {
    height: 40,
    maxWidth: 160,
    verticalAlign: "bottom",
  },
});

export class Navbar extends Component {
  render() {
    const { classes } = this.props;
    return (
      <AppBar elevation={0} className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <img src={logo} className={classes.logo} alt="logo" />
            WONA
          </Typography>
          <Button
            color="inherit"
            component={NavLink}
            activeClassName={classes.isActive}
            exact={true}
            to="/"
          >
            Home
          </Button>
          <Button
            color="inherit"
            component={NavLink}
            activeClassName={classes.isActive}
            parttern="/doctors"
            to="/doctors"
          >
            Doctors
          </Button>

          <Profile />
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(Navbar);
