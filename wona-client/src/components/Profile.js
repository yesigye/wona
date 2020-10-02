import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";
import { logoutUser } from "../redux/actions/userActions";

// Components
import EditUserDetails from "../components/EditUserDetails";

// Material UI
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Menu from "@material-ui/core/Menu";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import Skeleton from "@material-ui/lab/Skeleton";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import dayjs from "dayjs";

const styles = (theme) => {
  const customTheme = { ...theme.custom };
  customTheme.menuAvatar = {
    width: 80,
    height: 80,
    display: "inline-block",
  };
  customTheme.menuTitle = {
    margin: "10px auto 0px auto",
  };
  customTheme.editIcon = {
    background: "#fff",
    padding: 5,
    width: 20,
    height: 20,
    borderRadius: "100%",
  };

  return customTheme;
};

export class Profile extends Component {
  state = {
    auth: true,
    anchorEl: null,
  };

  handleChange = (event, checked) => {
    this.setState({ auth: checked });
  };

  handleMenu = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => this.setState({ anchorEl: null });

  handleSignout = () => {
    this.handleClose();
    this.props.logoutUser();
  };

  render() {
    const {
      classes,
      user: {
        credentials: { firstName, lastName, createdAt, avatar },
        loading,
        authenticated,
      },
    } = this.props;

    const { auth, anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return authenticated ? (
      // Authenticated user markup
      <div>
        <IconButton
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={this.handleMenu}
          color="inherit"
        >
          <Avatar src={avatar} className={classes.avatarSmall} />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={open}
          onClose={this.handleClose}
        >
          <Paper elevation={0} className={classes.avatarExpandedMenu}>
            <Avatar src={avatar} className={classes.menuAvatar} />
            <Typography className={classes.menuTitle}>
              {firstName + " " + lastName}
            </Typography>
            <Typography color="textSecondary" variant="body1">
              Joined {dayjs(createdAt).format("MMM YYYY")}
            </Typography>
            <div onClick={this.handleClose}>
              <EditUserDetails />
            </div>
            <Divider light />
            <Button onClick={this.handleSignout} variant="contained">
              Sign out
            </Button>
          </Paper>
        </Menu>
      </div>
    ) : (
      // Unauthenticated user markup
      <React.Fragment>
        <Button
          color="inherit"
          component={NavLink}
          activeClassName={classes.isActive}
          parttern="/login"
          excat="true"
          to="/login"
        >
          Login
        </Button>
        <Button
          color="inherit"
          component={NavLink}
          activeClassName={classes.isActive}
          parttern="/signup"
          excat="true"
          to="/signup"
        >
          Signup
        </Button>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapActionsToProps = { logoutUser };

Profile.propTypes = {
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(Profile));
