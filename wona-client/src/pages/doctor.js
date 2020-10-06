import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import propTypes from "prop-types";
import avatar from "../images/user.jpg";

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

//Icons
import BugReportIcon from "@material-ui/icons/BugReport";
import StarIcon from "@material-ui/icons/Stars";
// Redux
import { connect } from "react-redux";
import { getDoctor } from "../redux/actions/dataActions";
// Components
import Slots from "../components/slots";
import Signup from "../components/signup";
// Utility functions
import { getParams } from "../utils/urls";

const moreStyles = {
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
  payBlock: {
    textAlign: "center",
    padding: "1.5rem 0.5rem",
    marginBottom: 20,
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
  displayBlock: {
    display: "block",
  },
  payMtn: {
    ...moreStyles.payBlock,
    backgroundColor: "#ffc107",
  },
  payAirtel: {
    ...moreStyles.payBlock,
    backgroundColor: "#dc3545",
    color: "#ffffff",
  },
});

const appointment = {};

export class doctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: "panel1",
      bookDisplayDate: "",
      isDateSelected: false,
    };
  }

  componentDidMount() {
    const { doctors, doctor } = this.props.data;
    const { id: doctorId } = this.props.match.params;
    // Check if doctor isn't in state but all doctors are in state
    if (Object.keys(doctor).length === 0 && doctors.length > 0) {
      // Get single doctor from state docotrs
      this.props.data.doctor = doctors.find((doc) => doc.doctorId === doctorId);
    } else {
      this.props.getDoctor(doctorId);
    }

    // Extract date timestamp from url
    const { date } = getParams(this.props.location.search);
    if (date) {
      // Set state to
      // reflect the booking date
      // display the next tab panel

      // TODO: change this behaviour to relay on Redux
      this.setState({
        isDateSelected: true,
        urlDate: date,
        bookDisplayDate: dayjs.unix(date).format("h:mma dddd, MMM D"),
        expanded: "panel2",
      });
    }
  }

  handleBooking = (date, event) => {
    this.setState({
      isDateSelected: true,
      bookDisplayDate: dayjs(date).format("h:mma dddd, MMM D"),
    });

    this.props.history.push("?date=" + dayjs(date).unix());

    // Set chosen appointment date
    appointment.dueDate = date;
    // Set logged in user as appointment user
    this.props.user.authenticated &&
      (appointment.this.props.user = {
        handle:
          this.props.user.credentials.firstName +
          " " +
          this.props.user.credentials.lastName,
        avatar: this.props.user.credentials.avatar,
      });

    console.log(appointment);
  };

  render() {
    const {
      classes,
      user,
      data: { doctor, loading },
    } = this.props;

    dayjs.extend(relativeTime);
    const handleChange = (panel) => (event, isExpanded) => {
      this.setState({ expanded: isExpanded ? panel : false });
    };

    return (
      <Grid container spacing={2}>
        <Grid item sm={7} xs={12}>
          <Paper className={classes.content}>
            <Grid container spacing={2}>
              <Grid item sm={4} xs={4}>
                <img
                  src={avatar}
                  title={doctor.firstName}
                  className={classes.image}
                />
              </Grid>
              <Grid item sm={8} xs={8}>
                <Typography variant="h5">
                  Dr. {doctor?.firstName + " " + doctor?.lastName}
                </Typography>
                <div color="textSecondary">{doctor.department}</div>
                <Typography>{doctor.location?.address}</Typography>
                <Button variant="contained" color="primary" className="mt2">
                  Book an appointment
                </Button>
              </Grid>
            </Grid>
          </Paper>

          <Paper className={["mt2", classes.content]}>
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
            <Typography color="textSecondary">
              <ul>
                {doctor.specialities?.map((speciality) => (
                  <li>{speciality}</li>
                ))}
              </ul>
            </Typography>
            <Typography variant="body1">
              <BugReportIcon fontSize="small" className="icon-preText" />
              Diseases Treated
            </Typography>
            <Typography color="textSecondary">
              <ul>
                {doctor.diseases?.map((disease) => (
                  <li>{disease}</li>
                ))}
              </ul>
            </Typography>
            <Typography variant="body1">
              <BugReportIcon fontSize="small" className="icon-preText" />
              Training
            </Typography>
            <Typography color="textSecondary">
              <ul>
                {doctor.qualifications?.map((qualification) => (
                  <li>
                    {qualification.honor} at {qualification.institute},{" "}
                    {qualification.year}
                  </li>
                ))}
              </ul>
            </Typography>
          </Paper>
        </Grid>
        <Grid item sm={5} xs={12}>
          <Paper className={classes.accordionHeader}>
            <Typography>BOOK AN APPOINTMENT</Typography>
          </Paper>
          <div className={classes.root}>
            <Accordion
              expanded={this.state.expanded === "panel1"}
              onChange={handleChange("panel1")}
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
                  handleBooking={this.handleBooking.bind(this)}
                />
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={this.state.expanded === "panel2"}
              onChange={handleChange("panel2")}
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
                  <Signup />
                </AccordionDetails>
              )}
            </Accordion>
            <Accordion
              expanded={this.state.expanded === "panel3"}
              onChange={handleChange("panel3")}
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
                  USD 20
                </Typography>
              </AccordionSummary>
              <AccordionDetails className={classes.displayBlock}>
                <Typography color="textSecondary">
                  SELECT A PAYMENT OPTION
                </Typography>
                <Divider></Divider>
                <Typography variant="h6">Mobile Money</Typography>
                <Grid container spacing={2}>
                  <Grid item sm={6} xs={6}>
                    <Paper className={classes.payMtn}>
                      <Typography variant="body1">MTN</Typography>
                    </Paper>
                  </Grid>
                  <Grid item sm={6} xs={6}>
                    <Paper className={classes.payAirtel}>
                      <Typography variant="body1">AIRTEL</Typography>
                    </Paper>
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
};

const mapStateToProps = (state) => ({
  user: state.user,
  data: state.data,
});

export default connect(mapStateToProps, { getDoctor })(
  withStyles(styles)(doctor)
);
