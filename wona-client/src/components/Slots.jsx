import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
// Day Js
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import weekday from "dayjs/plugin/weekday";
// Material ui
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
// Icons
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
// Components
import TabPanel from "./TabPanel";
// Utility functions
import theme from "../utils/theme";
import {
  formatTimeSlots,
  militaryTimeToStandard,
  nextOpenSlot,
} from "../utils/timeFunctions";

const styles = {
  header: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  card: {
    display: "flex",
    marginBottom: "1rem",
  },
  content: {
    padding: "20px",
    objectFit: "cover",
  },
  slotsContainer: {
    maxHeight: 340,
    overflow: "auto",
    padding: 20,
    margin: -20,
    marginTop: 0,
  },
  periodsContainer: {
    "&:not(:last-child)": {
      marginBottom: 20,
    },
  },
  noBorder: {
    border: 0,
    boxShadow: "none",
  },
};

export class Slots extends Component {
  state = {
    slotDateRange: [],
    showingSlotDay: 0,
    showingDate: "",
    dateTimestamp: "",
  };

  componentWillReceiveProps(nextProps) {
    // Update state from prop if not already updated
    if (nextProps.selectedDate && !this.state.dateTimestamp) {
      // Difference between today and the booking date(sent via props)
      const dateDiff = dayjs.unix(nextProps.selectedDate).diff(Date(), "day");
      console.log(dateDiff);
      this.setState({
        dateTimestamp: nextProps.selectedDate,
        showingSlotDay: dateDiff ? dateDiff + 1 : dateDiff,
      });
    }
    // TODO: Let the max number come from docotor settings
    // Show booking slots up to 20 days in future
    const maxSlotDaysShowing = 20;
    let bookDates = [];
    for (let i = 0; i < maxSlotDaysShowing; i++) {
      bookDates.push(dayjs().add(i, "day"));
    }
    this.setState({ slotDateRange: bookDates });
  }

  handleTabChange = (e, num) => {
    this.setState({ showingSlotDay: num });
  };
  handleButtonChange = (date) => {
    if (date === undefined) return false;
    this.setState({
      showingDate: date,
      dateTimestamp: "" + dayjs(date).unix(),
    });
    this.props.handleBooking(date);
  };

  render() {
    dayjs.extend(relativeTime);
    dayjs.extend(weekday);

    const { classes, doctor } = this.props;
    const { showingSlotDay, slotDateRange } = this.state;

    let doctorSlots = formatTimeSlots(
      doctor.slots,
      slotDateRange,
      doctor.booked
    );

    const renderTimeHtml = (time, slotDate) => {
      const formatedDate = slotDate.format("YYYY-MM-DD") + " " + time;
      const unixTime = "" + dayjs(formatedDate).unix();
      const selected = this.state.dateTimestamp === unixTime;

      return (
        <Grid item sm={3} xs={4} key={time}>
          <Button
            fullWidth
            size="small"
            variant={selected ? "contained" : "outlined"}
            color="secondary"
            onClick={() =>
              this.handleButtonChange(
                slotDate.format("YYYY-MM-DD") + " " + time
              )
            }
          >
            {militaryTimeToStandard(time)}
          </Button>
        </Grid>
      );
    };
    // Render Html for a slot time period
    const renderPeriod = (title, period, slotDate) => {
      return (
        period.length > 0 && (
          <div className={classes.periodsContainer}>
            <Typography variant="overline">
              {title + " ("}
              <Typography
                component={"span"}
                variant="caption"
                color="textSecondary"
                className="text-lower"
              >
                {period.length} slots
              </Typography>
              {")"}
            </Typography>
            <Grid container spacing={1} className="mt1">
              {period.map((time) => renderTimeHtml(time, slotDate))}
            </Grid>
          </div>
        )
      );
    };
    // Rearrange slots into time period categories
    const renderContentHtml = (slot) => {
      if (slot.total === 0) {
        if (doctor.slots) {
          if (slot.date.diff(dayjs(), "day") === 0) {
            // no slots for Today. Show user next available slot
            let nextSlot = nextOpenSlot(doctor.slots, slot.date);
            return (
              <React.Fragment>
                <Typography variant="body1" color="textSecondary">
                  <CalendarTodayIcon
                    fontSize="small"
                    className="icon-preText"
                  />
                  Next available date:{" "}
                  {slot.date.add(nextSlot.index, "day").format("ddd MMM, D")}
                </Typography>
                <Button
                  variant="outlined"
                  color="secondary"
                  className="mt2"
                  onClick={() =>
                    this.handleTabChange(undefined, nextSlot.index)
                  }
                >
                  show slots
                </Button>
              </React.Fragment>
            );
          }
        }
        return (
          <Typography color="textSecondary">No available slots</Typography>
        );
      }

      return (
        <React.Fragment>
          {renderPeriod("Morning", slot.period.morning, slot.date)}
          {renderPeriod("Afternoon", slot.period.afternoon, slot.date)}
          {renderPeriod("Evening", slot.period.evening, slot.date)}
          {renderPeriod("Night", slot.period.night, slot.date)}
        </React.Fragment>
      );
    };
    // Header text for slot days
    const renderHeader = (slot, index) => {
      let activeIndex = parseInt(slot.date.format("d"));
      let headerColor = activeIndex === index ? "secondary" : "inherit";
      let headerText = "";

      switch (index) {
        case 0:
          headerText = "Today";
          break;
        case 1:
          headerText = "Tomorrow";
          break;
        default:
          headerText = slot.date.format("ddd MMM, D");
          break;
      }

      return (
        <React.Fragment>
          <Typography variant="overline" color={headerColor}>
            {headerText}
          </Typography>
          <Typography variant="caption" color="primary" className="text-lower">
            {slot.total + " "}
            slots available
          </Typography>
        </React.Fragment>
      );
    };

    return (
      <Card className={classes.noBorder}>
        {!doctorSlots ? (
          <Typography>No available slots</Typography>
        ) : (
          <React.Fragment>
            <Tabs
              value={showingSlotDay}
              onChange={this.handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
            >
              {doctorSlots.map((slot, i) => (
                <Tab label={renderHeader(slot, i)} key={i} />
              ))}
            </Tabs>
            <div className={classes.slotsContainer}>
              {doctorSlots.map((slot, i) => {
                return (
                  <TabPanel value={showingSlotDay} index={i} key={i}>
                    {renderContentHtml(slot)}
                  </TabPanel>
                );
              })}
            </div>
          </React.Fragment>
        )}
      </Card>
    );
  }
}

export default withStyles(styles)(Slots);
