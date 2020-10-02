import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import propTypes from "prop-types";
import logo from "../images/logo.png";

// Day Js
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
// Material ui
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import LocationCityIcon from "@material-ui/icons/LocationCity";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";

// Redux
import { connect } from "react-redux";
import { getDoctor } from "../redux/actions/dataActions";
// Components
import Slots from "../components/Slots";
import theme from "../utils/theme";

const styles = (theme) => ({
  ...theme.custom,
  header: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  card: {
    display: "flex",
    marginBottom: "1rem",
    border: 0,
  },
  image: {
    minWidth: 100,
  },
  content: {
    padding: "20px",
    objectFit: "cover",
  },
  largeIcon: {
    fontSize: 100,
    color: "#ccc",
  },
  contentBetween: {
    display: "flex",
    justifyContent: "space-between",
  },
});

let doctorId;
let timestamp;

export class booking extends Component {
  componentDidMount() {
    const { doctors, doctor } = this.props.data;
    const { slug } = this.props.match.params;
    // Extract id and timestamp from url
    const segments = slug.split("-");
    this.doctorId = segments[0];
    this.timestamp = segments[1];

    // Check if doctor isn't in state but all doctors are in state
    if (Object.keys(doctor).length === 0 && doctors.length > 0) {
      // Get single doctor from state docotrs
      this.props.data.doctor = doctors.find(
        (doc) => doc.doctorId === this.doctorId
      );
    } else {
      this.props.getDoctor(this.doctorId);
    }
  }

  render() {
    const {
      classes,
      data: { doctor, loading },
      user,
    } = this.props;

    console.log(user);

    dayjs.extend(relativeTime);

    return !user.authenticated ? (
      <h1>Not logged in</h1>
    ) : (
      <Grid container spacing={2}>
        <Grid item sm={7} xs={12}>
          <Typography variant="h6">Appointment booking</Typography>
          <Divider />
        </Grid>
        <Grid item sm={5} xs={12}>
          <Card>
            <CardHeader
              title="Visit Details"
              className={classes.header}
              titleTypographyProps={{ variant: "body1" }}
            />
            <CardContent>
              <div className={classes.contentBetween}>
                <Typography>
                  <CalendarTodayIcon className="icon-preText"></CalendarTodayIcon>{" "}
                  {dayjs.unix(this.timestamp).format("h:mma on MMMM D, YYYY")}
                </Typography>
                <Typography>
                  <Link href="#">Change date</Link>
                </Typography>
              </div>
              <Divider />

              <Card variant="outlined" className={classes.card}>
                <CardMedia
                  image={doctor.avatar}
                  title={doctor.firstName}
                  className={classes.image}
                />
                <CardContent className={classes.content}>
                  <Typography variant="outline">
                    Dr. {doctor.firstName + " " + doctor.lastName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {doctor.department}
                  </Typography>
                  <Typography variant="body2">
                    {doctor.location?.address}
                  </Typography>
                </CardContent>
              </Card>

              <Divider />

              <Card variant="outlined" className={classes.card}>
                <CardMedia
                  children={
                    <LocationCityIcon
                      size={130}
                      className={classes.largeIcon}
                    ></LocationCityIcon>
                  }
                  title={doctor.firstName}
                  className={classes.image}
                />
                <CardContent className={classes.content}>
                  <Typography variant="outline">
                    Dr. {doctor.firstName + " " + doctor.lastName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {doctor.department}
                  </Typography>
                  <Typography variant="body2">
                    {doctor.location && doctor.location.address}
                  </Typography>
                </CardContent>
              </Card>
            </CardContent>
            <CardActions>
              <Button size="small">Learn More</Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

booking.propTypes = {
  getDoctor: propTypes.func.isRequired,
  data: propTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  data: state.data,
});

export default connect(mapStateToProps, { getDoctor })(
  withStyles(styles)(booking)
);
