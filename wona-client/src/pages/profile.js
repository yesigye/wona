import React, { Component } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

// Redux
import { connect } from "react-redux";
import { uploadPhoto } from "../redux/actions/userActions";

// Components
import Signup from "../components/signup";

// Material UI
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import Edit from "@material-ui/icons/CameraAlt";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import Skeleton from "@material-ui/lab/Skeleton";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Badge from "@material-ui/core/Badge";
import Tooltip from "@material-ui/core/Tooltip";
import dayjs from "dayjs";

const styles = (theme) => {
  const customTheme = { ...theme.custom };
  customTheme.menuAvatar = {
    width: 80,
    height: 80,
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
  customTheme.progress = {
    position: "absolute",
    width: 20,
    height: 20,
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    margin: "auto",
    color: "#fff",
  };

  return customTheme;
};

export class profile extends Component {
  handlePhotoChange = (event) => {
    const image = event.target.files[0];
    const formData = new FormData();
    formData.append("image", image, image.name);
    this.props.uploadPhoto(formData);
  };

  handleEditPhoto = () => document.getElementById("photoInput").click();

  render() {
    const {
      classes,
      user: {
        credentials: { firstName, lastName, createdAt, avatar },
        loading,
      },
    } = this.props;

    return (
      <Grid container>
        <Grid item sm={8} xs={12}>
          Dashbord.......
        </Grid>
        <Grid item sm={4} xs={12}>
          <Paper className={classes.avatarExpandedMenu}>
            <Tooltip title="Change photo" placement="bottom">
              <IconButton color="inherit" onClick={this.handleEditPhoto}>
                <Badge
                  overlap="circle"
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  badgeContent={
                    <Edit color="primary" className={classes.editIcon} />
                  }
                >
                  <Avatar src={avatar} className={classes.menuAvatar} />
                  {loading && (
                    <CircularProgress size={20} className={classes.progress} />
                  )}
                </Badge>
              </IconButton>
            </Tooltip>
            <input
              type="file"
              id="photoInput"
              hidden
              onChange={this.handlePhotoChange}
            />
            {firstName || lastName ? (
              <Typography className={classes.menuTitle}>
                {firstName + " " + lastName}
              </Typography>
            ) : (
              <Skeleton variant="text" />
            )}
            <Typography color="textSecondary">
              Joined {dayjs(createdAt).format("MMM YYYY")}
            </Typography>
            <hr />
            <Button onClick={this.handleClose} variant="contained">
              Sign out
            </Button>
            <Signup />
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapActionsToProps = { uploadPhoto };

profile.propTypes = {
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  uploadPhoto: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(profile));
