import React, { Component } from "react";
import { Link } from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";
import propTypes from "prop-types";
// Redux stuff
import { connect } from "react-redux";
import { signupUser } from "../redux/actions/userActions";
// Material UI
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
// Components
import SignupForm from "../components/signupForm";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" to="/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const styles = (theme) => ({
  ...theme.custom,
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url("/images/appointment.svg")',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
    theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(6, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  section: {
    margin: theme.spacing(6, 4)
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

class Signup extends Component {
  render() {
    const {classes} = this.props;
    
    return (
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        {/* <Grid item xs={false} sm={4} md={7} className={classes.image} /> */}
        <Grid item xs={false} sm={4} md={7} component={Paper} elevation={1} square>
          <div className={classes.section}>
            <Grid container spacing={3}>
              <Grid item xs={3}>
                <img src="/images/appointment.svg" style={{ width:"100%" }} alt=""/>
              </Grid>
              <Grid item xs={7}>
                <Typography variant="h5">Book Appointments</Typography>
                <Typography variant="subtitle2">
                  Creating an account will give you access to the booking system.
                  Choose a date and time that suits both you and your doctor,
                  an appointment will be automatically added to the doctor's calendar
                  and they will be notified immediately.
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={3} className="mt2">
              <Grid item xs={7}>
                <Typography variant="h5">Doctors</Typography>
                <Typography variant="subtitle2">
                  Get anytime access to credible and professional physicians.
                  No more waiting around, meet the best healthcare providers from the
                  comfort of your location. Contact them about your challenges and have
                  them diagnose and prescribe treatment.
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <img src="/images/doc.svg" style={{ width:"100%" }} alt=""/>
              </Grid>
            </Grid>
            <Grid container spacing={3} className="mt2">
              <Grid item xs={3}>
                <img src="/images/data.svg" style={{ width:"100%" }} alt=""/>
              </Grid>
              <Grid item xs={7}>
                <Typography variant="h5">Stay Informed</Typography>
                <Typography variant="subtitle2">
                  Be the first to know and be Informed of events and new developments.
                  We shall notify you of any updates through your email address or directly
                  through your accounts page. 
                </Typography>
              </Grid>
            </Grid>
          </div>
        </Grid>
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={1} square>
          <div className={classes.paper}>
            <span className="logo"></span>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <SignupForm/>
          </div>
        </Grid>
      </Grid>
    );
  }
}

Signup.propTypes = {
  classes: propTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI,
});

export default connect(mapStateToProps)(
  withStyles(styles)(Signup)
);
