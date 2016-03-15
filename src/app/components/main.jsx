
import React from 'react';
import Dropzone from 'react-dropzone';
import request from 'superagent';
import RaisedButton from 'material-ui/lib/raised-button';
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import MIFUComponent from './MIFUComponent';

import { connect } from 'react-redux';
import { changeTab } from '../ducks/mainDuck';

const imgPath = require('./logo.png');

const containerStyle = {
  textAlign: 'center',
  paddingTop: 10,
};

const divStyle = {
  textAlign: 'center',
  display: 'inline-block',
  paddingLeft: 20,
  paddingRight: 20,
};

const Main = React.createClass({

  handleTabChange(value) {
    if (typeof value !== 'object') {
      this.props.dispatch(changeTab(value));
    }
  },

  render() {

    const self = this;
    const { tabValue } = this.props;

    return (
      <div>
        <img src={imgPath} alt='header' />
        <div style={containerStyle}><h1>SMART Iso</h1></div>
        <Tabs value={tabValue} onChange={this.handleTabChange}>
          <Tab label='Instrum Status Initialisation' value='MIFUinit' >
            <MIFUComponent type='MIFUinit' />
          </Tab>
          <Tab label='Instrum Status update' value='MIFUupdate' >
            <MIFUComponent type='MIFUupdate' />
          </Tab>
          <Tab label='Global Iso status' value='IsoStatus' >
            <MIFUComponent type='IsoStatus' />
          </Tab>
          <Tab label='Single Iso status' value='SingleIsoStatus' >
            <MIFUComponent type='SingleIsoStatus' />
          </Tab>
        </Tabs>
      </div>

    );
  },
});

const mapStateToProps = function(state) {
  return {
    tabValue: state.main.tabValue,
  };
};

export default connect(mapStateToProps)(Main);
