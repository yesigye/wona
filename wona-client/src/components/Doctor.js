import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
// Material ui
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

const styles = {
  card: {
    display: "flex",
    marginBottom: "1rem",
  },
  image: {
    minWidth: 100,
  },
  content: {
    padding: "20px",
    objectFit: "cover",
  },
};

export class Doctor extends Component {
  render() {
    dayjs.extend(relativeTime);
    const {
      classes,
      doctor: {
        doctorId,
        avatar,
        firstName,
        lastName,
        department,
        createdAt,
        location,
      },
    } = this.props;
    return (
      <Card className={classes.card}>
        <CardMedia image={avatar} title={firstName} className={classes.image} />
        <CardContent className={classes.content}>
          <Typography
            variant="h6"
            color="primary"
            component={Link}
            to={`/doctor/${doctorId}/${firstName}-${lastName}-${department}`}
          >
            Dr. {firstName + " " + lastName}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {department}
          </Typography>
          <Typography variant="body2">{location.address}</Typography>
          <Typography variant="body2" color="textSecondary">
            {dayjs(createdAt).fromNow()}
          </Typography>
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(Doctor);
