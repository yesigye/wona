import React, { Component } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

// Redux
import { connect } from "react-redux";
import { editUserDetails } from "../../../redux/actions/userActions";

// Material UI
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";
// Card logos
import logoVisa from "./visa.svg"
import logoMastercard from "./mastercard.svg"

const styles = (theme) => ({
  ...theme.custom,
  creditCard: {
    borderRadius: 10,
    backgroundColor: "#cccccc",
    padding: 20,
  },
  input: {
    color: "#fff",
    fontSize: "2em",
    lineHeight: "2em",
    border: "none",
    background: "none",
    width: 100,
    outline: "none !important",
  },
  holder: {
    position: "relative",
  },
  cardImage: {
    height: 75,
  },
  invalid: {
    textDecoration: "line-through",
  },
  "::placeholder": {
    color: "#fff",
  },
  payCard: {
    ...theme.custom.payBlock,
    backgroundColor: "#949494",
    "&:hover": {
      backgroundColor: "#cccccc",
      borderColor: "#cccccc",
      boxShadow: "none",
    },
  },
});

const cardDefault = {
  name: '',
  date: '',
  image: "https://placehold.it/120x60.png?text=Card",
  numbers: [[], [], [], []],
  background: {}
};
const cardsBg = {
  visa: {
    background: "linear-gradient(135deg, #622774 0%, #c53364 100%)",
  },
  mastercard: {
    background: "linear-gradient(135deg, #65799b 0%, #5e2563 100%)",
  },
};

class creditCardButton extends Component {
  state = {
    phone: "",
    lastName: "",
    open: false,
    finished: false,
    errors: {},
    card: {...cardDefault}
  };

  mapUserDetailsToState = (credentials) => {
    this.setState({
      phone: credentials.phone ? credentials.phone : "",
    });
  };

  componentDidMount() {
    const { credentials } = this.props.user;
    this.mapUserDetailsToState(credentials);
  }

  /**
  * Detect where credit card is a visa or mastercard.
  * @param {Array} first4Digits - First 4 digits of credit card.
  */
  detectCardType = (first4Digits) => {
    const card = this.state.card;
    
    if (first4Digits.startsWith("4")) {
      card.image = logoVisa;
      card.background = cardsBg.visa;
      this.setState({card});
    } else {
      card.image = logoMastercard;
      card.background = cardsBg.mastercard;
      this.setState({card});
    }
  };

  /**
  * Returns the caret (cursor) position of a text field.
  * @param {Object} oField - DOM text field element.
  * @returns {Int} iCaretPos - Cursor position.
  */
  getCursorPosition = (oField) => {
    // Initialize
    var iCaretPos = 0;

    // IE Support
    if (document.selection) {
      // Set focus on the element
      oField.focus();
      // To get cursor position, get empty selection range
      var oSel = document.selection.createRange();
      // Move selection start to 0 position
      oSel.moveStart('character', -oField.value.length);
      // The caret position is selection length
      iCaretPos = oSel.text.length;
    } else if (oField.selectionStart || oField.selectionStart === '0') {
      // Firefox support
      iCaretPos = oField.selectionDirection ==='backward' ? oField.selectionStart : oField.selectionEnd;
    }

    // Return results
    return iCaretPos;
  }

  /**
  * Move cursor to the next input after an input limit has been met.
  * @param {Object} event - DOM event that triggered this function.
  */
  smartCursor = (event) => {
    const el = event.target;
    const id = Number(el.id.slice(-1));
    const nextId = el.id.substring(0, el.id.length - 1) + (id + 1);
  
    // On reaching max chars, focus on next input if any.
    (el.value.length === el.maxLength && id < 4) &&
      document.getElementById(nextId).focus();
  };
  
  /**
  * Advance cursor to the next input after current input limit has been met.
  * @param {Object} event - DOM event that triggered this function.
  */
  smartTyping = (event) => {
    const el = event.target;
    const index = Number(el.id.slice(-1)) - 1;
    const card = this.state.card;
    const numbers = this.state.card.numbers;
    const cursorPosition = this.getCursorPosition(event.target);
    const allowedKeys = [37,38,39,40];
    
    if (el.value.length === el.maxLength) {
      // End of the char limit on input
      return;
    }

    if (event.keyCode === 8) {
      // On backspace, remove digit relative to cursor position.
      const i = cursorPosition ? cursorPosition - 1: 0;
      numbers[index].length && numbers[index].splice(i, 1);
      card.numbers = numbers;
      this.setState({ card });
      return;
    }
    
    if (!allowedKeys.includes(event.keyCode)) {
      // Disable non-integer key functionality and terminate.
      if (!event.key.match(/^[0-9]+$/)) return event.preventDefault();
  
      // Replace a digit if there are 4 numbers already. 
      const deleteCount = numbers[index].length === 4 ? 1 : 0;
      // Insert typed digit using cursor position as index. 
      numbers[index].splice(cursorPosition, deleteCount, event.key);
      card.numbers = numbers;
      this.setState({ card });
  
      setTimeout(() => {
        if (index === 0 && cursorPosition === 0) {
          // Detect card type after typing first char of first input
          this.detectCardType(el.value);
        }
        // Delay digit masking to give user glimpse of what they type. 
        // Mask every last letter with #.
        if (index < 3) el.value = el.value.slice(0, -1) + "#";
      }, 100);
    }
  };

  /**
  * Vaidate card name contains at least 2 names each over 2 letters.
  * @param {Object} event - DOM event that triggered this function.
  */
  validateCardHolderName = (event) => {
    const errors = this.state.errors;
    const arr = event.target.value.split(" ");
    
    if(arr.length >= 2 && arr[0].length > 2 && arr[1].length > 2) {
      errors.name = "";
    }else {
      errors.name = "Enter at least 2 names each over 2 letters.";
    }
    this.setState({ errors });
  };

  /**
  * Vaidate card expiry date.
  * @param {Object} event - DOM event that triggered this function.
  */
  validateCardExpiryDate = (event) => {
    const arr = event.target.value.split("/");
    const date = new Date(event.target.value);
    const today = new Date();
    const errors = this.state.errors;

    if(arr.length !== 2 && arr[0] !== 2 && arr[1] !== 2) {
      // Date should have 2 chars each for month & year
      errors.date = "Invalid date";
    }else if(![...arr[0], ...arr[1]].join('').match(/^[0-9]+$/)) {
      // Date should only have integers
      errors.date = "Invalid date";
    }else {
      // Change a 2 to a 4 digit year using a 50 year offset
      arr[1] = (arr[1] > 50 ? "19" : "20") + arr[1];
      date.setFullYear(arr[1], arr[0], -1);
  
      if( ! date instanceof Date) {
        errors.date = "Invalid date";
      }else if(date.setHours(0, 0, 0, 0) <= today.setHours(0, 0, 0, 0)) {
        errors.date = "Expired date";
      } else {
        errors.date = "";
      }
    }
    
    this.setState({ errors });
  };

  /**
  * Vaidate card number using Luhn algorithm.
  * @returns {Boolean}
  */
  validateCardNumber = () => {
    const numbers = this.state.card.numbers.flat();
    const errors = this.state.errors;

    if (numbers.length !== 16) {
      errors.message = "Card number must be 16 numbers long.";
      return false;
    }
    if (!numbers.join("").match(/^[0-9]+$/)) {
      errors.message = "Card number can only contain integers.";
      return false;
    }

    // Type cast card numbers to integers
    const digits = numbers.map((x) => {
      return parseInt(x, 10);
    });
    // From second to last, loop through every other digit
    for (let i = digits.length - 2; i >= 0; i -= 2) {
      const doubled = digits[i] * 2;
      // replace digit with its double or
      // the dobule - 9 for digits bigger that 9
      digits[i] = doubled > 9 ? doubled - 9 : doubled;
    }
    const sum = digits.reduce((a, b) => a + b, 0);

    if(sum % 10 === 0) {
      errors.message = "";
      return true;
    } else {
      errors.message = "This card number is invalid.";
      return false;
    }
  };

  handleSubmit = (event) => {
    const card = this.state.card;
    const errors = this.state.errors;
    errors.numbers = false; 
    
    if(card.name.trim() === "") {
      errors.name = "Enter the name on your card."; 
    }
    if(card.date.trim() === "") {
      errors.date = "Enter date."; 
    }
    if(card.numbers.find(a => a.length !== 4)) {
      // Check for missing digits in card number
      errors.numbers = true;
    } else {
      if(!this.validateCardNumber() && !errors.numbers) {
        errors.numbers = true;
      } else {
        console.log("processing payment")
      }
    }
    

    this.setState({ errors });
  };

  handleOpen = () => {
    this.setState({ open: true });
    this.mapUserDetailsToState(this.props.user.credentials);
  };

  handleClose = () => {
    this.setState({
      card: {...cardDefault},
      errors: {},
      open: false
    })
  };

  handleCloseAlert = () => this.setState({ finished: false });

  handleChange = (event) => {
    const card = this.state.card;
    card[event.target.name] = event.target.value;
    this.setState({ card });
  };

  render() {
    const {
      classes,
      user: { loading },
      UI: { alerts },
    } = this.props;
    const { errors, card } = this.state;

    console.log(errors.length)

    return (
      <div>
        <Button fullWidth className={classes.payCard} onClick={this.handleOpen}>
          <Typography variant="body1">Card</Typography>
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="card-pay-form"
        >
          <DialogTitle id="card-pay-form">Authorize Payment</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please provide your credit card details.
            </DialogContentText>
            <div style={card.background} className={classes.creditCard}>
              <Typography align="right">
                <img className={classes.cardImage} src={card.image} alt="" />
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <TextField
                    required
                    fullWidth
                    variant="filled"
                    color="secondary"
                    size="small"
                    id="digit1"
                    autoComplete={false}
                    onKeyUp={this.smartCursor}
                    onKeyDown={this.smartTyping}
                    value={this.state.digit1}
                    inputProps={{ maxLength: 4 }}
                    error={errors.numbers}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    required
                    fullWidth
                    variant="filled"
                    color="secondary"
                    size="small"
                    id="digit2"
                    autoComplete={false}
                    onKeyUp={this.smartCursor}
                    onKeyDown={this.smartTyping}
                    value={this.state.digit2}
                    inputProps={{ maxLength: 4 }}
                    error={errors.numbers}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    required
                    fullWidth
                    variant="filled"
                    color="secondary"
                    size="small"
                    id="digit3"
                    autoComplete={false}
                    onKeyUp={this.smartCursor}
                    onKeyDown={this.smartTyping}
                    value={this.state.digit3}
                    inputProps={{ maxLength: 4 }}
                    error={errors.numbers}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    required
                    fullWidth
                    variant="filled"
                    color="secondary"
                    size="small"
                    id="digit4"
                    autoComplete={false}
                    onKeyUp={this.smartCursor}
                    onKeyDown={this.smartTyping}
                    value={this.state.digit4}
                    inputProps={{ maxLength: 4 }}
                    error={errors.numbers}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} className="mt2">
                <Grid item xs={9}>
                  <TextField
                    required
                    fullWidth
                    size="small"
                    variant="filled"
                    label="Name on Card"
                    id="name"
                    name="name"
                    autoComplete={false}
                    color="secondary"
                    onChange={this.handleChange}
                    onBlur={this.validateCardHolderName}
                    value={this.state.card.name}
                    error={Boolean(errors.name)}
                    helperText={errors.name}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    required
                    fullWidth
                    size="small"
                    variant="filled"
                    id="date"
                    label="Date"
                    placeholder="MM/YY"
                    name="date"
                    autoComplete="date"
                    color="secondary"
                    className={classes.textField}
                    onChange={this.handleChange}
                    onBlur={this.validateCardExpiryDate}
                    value={this.state.card.date}
                    error={Boolean(errors.date)}
                    helperText={errors.date}
                  />
                </Grid>
              </Grid>
            </div>
            <Typography align="center">
              {errors.message && (
                <Alert severity="error" variant="filled" className="mt2">
                  {errors.message}
                </Alert>
              )}
            </Typography>
          </DialogContent>
          
          <DialogActions>
            <Button
              variant="contained"
              onClick={this.handleClose}
              color="default"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={this.handleSubmit}
              color="primary"
              disabled={loading || errors.length > 0}
            >
              {loading && (
                <CircularProgress className="progress-center" size={20} />
              )}
              Pay
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI,
});

creditCardButton.propTypes = {
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  editUserDetails: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, { editUserDetails })(
  withStyles(styles)(creditCardButton)
);
