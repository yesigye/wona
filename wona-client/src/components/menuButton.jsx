import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/styles';

import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';

const styles = (theme) => ({
  button: {
    textTransform: "inherit"
  },
  icon: {
    color: theme.palette.secondary.main,
    position: "relative",
    top: -1
  },
});

class MenuButton extends React.Component {
  state = {
    anchorEl: null
  };

  handleChange = (event, checked) => {
    this.setState({ auth: checked });
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes, title, variant, size } = this.props;
    const { auth, anchorEl } = this.state;
    const open = Boolean(anchorEl);
    const Wrapper = this.props.iconType;
    const listItems = this.props.items.map((link) =>
      <MenuItem onClick={this.handleClose} >{link}</MenuItem>
    );

    return (
      <div>
        <Button
          variant={variant}
          size={size}
          onClick={this.handleMenu}
          className={classes.button}
        >
          {title}
          {
            open ? <ArrowDropUpIcon className={classes.icon}/> : <ArrowDropDownIcon className={classes.icon}/>
          }
        </Button>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={open}
          onClose={this.handleClose}
        >
        {listItems}


        </Menu>
      </div>
    );
  }
}

export default withStyles(styles)(MenuButton);