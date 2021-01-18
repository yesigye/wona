import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import propTypes from "prop-types";

// Day Js
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
// Material ui
import Grid from "@material-ui/core/Grid";
import MuiLink from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";

import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

//Icons
import BugReportIcon from "@material-ui/icons/BugReport";
// Redux
import { connect } from "react-redux";
import { getDoctor } from "../redux/actions/doctorActions";
// Components
import Slots from "../components/slots";
import SignupForm from "../components/signupForm";
import MtnMomoButton from "../components/payment/mtnMomoButton";
import CreditCardButton from "../components/payment/card/creditCardButton";
import Toast from "../components/Toast"
// Utility functions
import { getParams } from "../utils/urls";
import Skeleton from "@material-ui/lab/Skeleton";

const moreStyles = {
  paper: {
    padding: "1.2rem 15px",
  },
  card: {
    display: "flex",
    marginBottom: "1rem",
  },
  image: {
    maxWidth: "100%",
  },
  content: {
    padding: "20px",
    objectFit: "cover",
  },
  feedbackLink: {
    display: "block",
    textAlign: "right",
    marginTop: 20,
  },
  slotsContainer: {
    "&:not(:last-child)": {
      marginBottom: 20,
    },
  },
  marginlessDivider: {
    margin: "0 !important",
  },
};
const styles = (theme) => ({
  ...theme.custom,
  ...moreStyles,
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  CheckboxSecodaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    marginTop: "10px",
  },
  accordionHeader: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    boxShadow: "none",
    margin: 0,
    padding: "1.2rem 15px",
  },
  table: {
    "& .MuiTableCell-root": {
      fontSize: theme.typography.fontSize
    }
  },
  displayBlock: {
    display: "block",
  },
  payAirtel: {
    ...theme.custom.payBlock,
    backgroundColor: "#dc3545",
    color: "#ffffff",
  },
  cardBlock: {
    ...theme.custom.payBlock,
    boxShadow: "none",
    padding: "1.2rem 15px",
    border: "1px solid #ccc",
    marginTop: 20
  }
});

/**
 * Doctor's view page
 * 
 * @version 1.0.1
 * @author [ignatius yesigye](https://github.com/yesigye)
 */
export class doctor extends Component {
  constructor(){
    super();
    this.state = {
      doctor: {},
      expanded: "panel1",
      bookDisplayDate: "",
      isDateSelected: false,
      appointment: {}
    };
    dayjs.extend(relativeTime);
  }

  componentDidMount() {
    // const { doctors, doctor } = this.props.data;
    const { id } = this.props.match.params;
    const { doctor } = this.props;
    
    if(Object.keys(doctor).length > 0 && id === doctor.doctorId) {
      // Doctor already in redux state.
      this.setState({ doctor: doctor })
    } else {
      this.props.getDoctor(id);
    }

    /**
     * Next: (Scenario) User has already set booking date
     * then refreshed browser or another component triggers
     * a component re-rendering
      */
    // Extract date timestamp from url
    // TODO: change the date to relay on Redux not URI
    const { date } = getParams(this.props.location.search);
    if (date) {
      // Set state to
      // reflect the booking date
      // display the next tab panel
      this.setState({
        isDateSelected: true,
        urlDate: date,
        bookDisplayDate: dayjs.unix(date).format("h:mma dddd, MMM D"),
        expanded: "panel2",
        appointment: {
          ...this.state.appointment,
          date: date,
          doctor: {
            avatar: this.state.doctor.avatar,
            handle: this.state.doctor.firstName + " " + this.state.doctor.lastName,
            department: this.state.doctor.department
          },
        }
      });
    }
  }
  
  componentDidUpdate(prevProps, prevState) {
    const prevDoc = prevProps.doctor;
    const newDoc = this.props.doctor;
    console.log(prevDoc)
    const prevDocId = Object.keys(prevDoc).length ? prevDoc.doctorId : '';
    const newDocId = newDoc && Object.keys(newDoc).length ? newDoc.doctorId : '';
    // Doctor data has changed. Update react state.
    (prevDocId !== newDocId) && this.setState({doctor: this.props.doctor});
    
    // Capture user after they logged in
    if(!prevState.appointment.user && this.props.user.authenticated) {
      const user = this.props.user.credentials;
      console.log("updated", prevState.appointment.user)
      this.setState({
        appointment: {
          ...this.state.appointment,
          user: {
            avatar: user.avatar,
            handle: user.firstName + " " + user.lastName
          }
        }
      });
    }
  }
  
  /**
   * Handles completion of appointment payment
   * 
   * @param {string} isPaid whether paid was made or not
   */
  handlePayment = (isPaid) => {
    console.log("appointment paid: status -", isPaid);
    if(! isPaid) {

      return null;
    }
    this.setState({
      appointment: {
        ...this.state.appointment,
        paid: true,
        status: "complete",
      }
    });
    console.log(this.state.appointment)
  }

  /**
   * Handles change in appointment date
   * 
   * @param {string} date booked date
   */
  handleDateChange = (date) => {
    this.setState({
      isDateSelected: true,
      bookDisplayDate: dayjs(date).format("h:mma dddd, MMM D"),
      appointment: {
        ...this.state.appointment,
        dueDate: date,
        status: 'pending'
      }
    });
    this.props.history.push("?date=" + dayjs(date).unix());
  };

  /**
   * Handles changes between accordion panel changes
   * 
   * @param {string} panel accordion panel to expand
   */
  handlePanelChange = (panel) => (event, isExpanded) => {
    this.setState({ expanded: isExpanded ? panel : false });
  };

  render() {
    const {
      classes,
      user,
    } = this.props;
    const { doctor } = this.state;
    const redirect = `${this.props.location.pathname}${this.props.location.search}`;
    if(doctor) doctor.fullname = `${doctor.firstName} ${doctor?.lastName}`;

    return (
      <Grid container spacing={2} className="mt2">
        <Grid item sm={7} xs={12}>
          <Paper className={classes.content}>
            <Grid container spacing={2}>
              <Grid item sm={4} xs={4}>
                <img
                  src="/images/user.png"
                  alt={doctor.firstName}
                  title={doctor.firstName}
                  className={classes.image}
                />
              </Grid>
              <Grid item sm={8} xs={8}>
                <Typography variant="h5">
                  {doctor.firstName ?
                    `Dr. ${doctor.firstName} ${doctor?.lastName}` :
                    <Skeleton variant="text"></Skeleton>
                  }
                </Typography>
                <div color="textSecondary">
                  {doctor.department ? doctor.department : <Skeleton variant="text"/>}
                </div>
                <Typography>{doctor.location?.address}</Typography>
                <Button variant="contained" color="primary" className="mt2">
                  Book an appointment
                </Button>
              </Grid>
            </Grid>
          </Paper>

          <Paper className={classes.content} style={{ margin: "20px 0" }}>
            <Typography variant="body1">
              <b>Experience</b>
            </Typography>
            <Divider />
            <Typography variant="body1">{doctor.bio}</Typography>
            <MuiLink className={classes.feedbackLink}>Give Feedback</MuiLink>
            <Divider />
            <Typography variant="body1">
              <BugReportIcon fontSize="small" className="icon-preText" />
              Specializes In
            </Typography>
            <ul>
              <Typography color="textSecondary">
                {doctor.specialities?.map((speciality, i) => (
                  <li key={i}>{speciality}</li>
                ))}
              </Typography>
            </ul>
            <Typography variant="body1">
              <BugReportIcon fontSize="small" className="icon-preText" />
              Diseases Treated
            </Typography>
            <ul>
              <Typography color="textSecondary">
                {doctor.diseases?.map((disease, i) => (
                  <li key={i}>{disease}</li>
                ))}
              </Typography>
            </ul>
            <Typography variant="body1">
              <BugReportIcon fontSize="small" className="icon-preText" />
              Training
            </Typography>
            <ul>
              <Typography color="textSecondary">
                {doctor.qualifications?.map((qualification, i) => (
                  <li key={i}>
                    {qualification.honor} at {qualification.institute},{" "}
                    {qualification.year}
                  </li>
                ))}
              </Typography>
            </ul>
          </Paper>
        </Grid>
        <Grid item sm={5} xs={12}>
          <Paper className={classes.accordionHeader}>
            <Typography>BOOK AN APPOINTMENT</Typography>
          </Paper>
          <Paper className={classes.paper}>
            <Typography variant="h5" color="secondary" align="center" gutterBottom={false}>
              Appointment Confirmed!
            </Typography>
            <Typography variant="body1" align="center" paragraph={true}>
              An email confirmation has been sent to your email
            </Typography>
            <Table className={classes.table} size="medium">
              <TableBody>
                <TableRow key={1}>
                  <TableCell variant="head">Date</TableCell>
                  <TableCell align="right">{this.state.bookDisplayDate}</TableCell>
                </TableRow>
                <TableRow key={2}>
                  <TableCell variant="head">Location</TableCell>
                  <TableCell align="right">Kampala <a href="#">View on Map</a> </TableCell>
                </TableRow>
                <TableRow key={3}>
                  <TableCell variant="head">Payment</TableCell>
                  <TableCell align="right" component="h6">USD 20</TableCell>
                </TableRow>
                <TableRow key={4}>
                  <TableCell variant="head">Payment Method</TableCell>
                  <TableCell align="right" component="h6">Mobile Money</TableCell>
                </TableRow>
                <TableRow key={5}>
                  <TableCell variant="head">Transaction ID</TableCell>
                  <TableCell align="right" component="h6">FS345643DC2433D</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Button variant="primary" fullWidth className={classes.cardBlock}>
                  <Typography variant="caption">Print</Typography>
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button variant="primary" fullWidth className={classes.cardBlock}>
                  <Typography variant="caption">Share</Typography>
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button variant="primary" fullWidth className={classes.cardBlock}>
                  <Typography variant="caption">to Google</Typography>
                </Button>
              </Grid>
            </Grid>
          </Paper>

          <div className={classes.root}>
            <Accordion
              expanded={this.state.expanded === "panel1"}
              onChange={this.handlePanelChange("panel1")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-label="Expand"
                aria-controls="additional-actions1-content"
                id="additional-actions1-header"
              >
                <FormControlLabel
                  aria-label="Date"
                  control={<Checkbox />}
                  checked={this.state.isDateSelected}
                  label="Date"
                />
                <Typography
                  className={classes.CheckboxSecodaryHeading}
                  color="textSecondary"
                >
                  {this.state.bookDisplayDate}
                </Typography>
              </AccordionSummary>
              <Divider className={classes.marginlessDivider}></Divider>
              <AccordionDetails>
                <Slots
                  doctor={doctor}
                  Component="Backdrop"
                  open={true}
                  selectedDate={this.state.urlDate}
                  handleBooking={this.handleDateChange.bind(this)}
                />
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={this.state.expanded === "panel2"}
              onChange={this.handlePanelChange("panel2")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-label="Expand"
                aria-controls="additional-actions1-content"
                id="additional-actions1-header"
              >
                <FormControlLabel
                  aria-label="Client"
                  control={<Checkbox />}
                  checked={user.authenticated}
                  label={user.authenticated ? "Client" : "Sign up to Continue"}
                />
                {user.authenticated && (
                  <Typography
                    className={classes.CheckboxSecodaryHeading}
                    color="textSecondary"
                  >
                    {user.credentials.firstName &&
                      user.credentials.firstName +
                        " " +
                        user.credentials.lastName}
                  </Typography>
                )}
              </AccordionSummary>
              <Divider className={classes.marginlessDivider}></Divider>
              {!user.authenticated && !user.loading && (
                <AccordionDetails>
                  <SignupForm redirect={redirect} />
                </AccordionDetails>
              )}
            </Accordion>
            <Accordion
              expanded={this.state.expanded === "panel3"}
              onChange={this.handlePanelChange("panel3")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-label="Expand"
                aria-controls="additional-actions1-content"
                id="additional-actions1-header"
              >
                <FormControlLabel
                  aria-label="Payment"
                  control={<Checkbox />}
                  checked={false}
                  label="Payment"
                />
                <Typography
                  className={classes.CheckboxSecodaryHeading}
                  color="primary"
                >
                  USD {('20'.toLocaleString('en-us', {
                    style: "currency",
                    currency: "USD",
                  }))}
                </Typography>
              </AccordionSummary>
              <AccordionDetails className={classes.displayBlock}>
                <Typography color="textSecondary">
                  SELECT A PAYMENT OPTION
                </Typography>
                <Divider></Divider>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <MtnMomoButton onPaid={this.handlePayment.bind(this)} />
                  </Grid>
                  <Grid item xs={4}>
                    <Paper className={classes.payAirtel}>
                      <Typography variant="body1">AIRTEL</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={4}>
                    <CreditCardButton />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </div>
        </Grid>
      </Grid>
    );
  }
}

doctor.propTypes = {
  getDoctor: propTypes.func.isRequired,
  UI: propTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  doctor: state.doctor.data,
  loading: state.doctor.loading,
  errors: state.doctor.errors,
});

export default connect(
  mapStateToProps,
  { getDoctor }
)(withStyles(styles)(doctor));
