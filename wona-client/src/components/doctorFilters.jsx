import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";

// Material UI
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

// Components
import Profile from "./Profile";

// Theme. spread is from "../utils.theme"
const styles = (theme) => ({
  ...theme.custom,
  title: {
    flexGrow: 1,
  },
  appBar: {
    fontWeight: 400,
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

export class DoctorFilters extends Component {
  render() {
    const { classes } = this.props;
    return (
      <AppBar elevation={0} className={classes.appBar}>
        <Container maxWidth="lg">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              <span className="logo" style={{width:50,height:20}}></span>
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
        </Container>
      </AppBar>
    );
  }
}

export default withStyles(styles)(DoctorFilters);
