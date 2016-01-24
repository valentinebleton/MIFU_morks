
import React from 'react';
import RaisedButton from 'material-ui/lib/raised-button';
import Dialog from 'material-ui/lib/dialog';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import LightRawTheme from 'material-ui/lib/styles/raw-themes/light-raw-theme';
import Colors from 'material-ui/lib/styles/colors';
import FlatButton from 'material-ui/lib/flat-button';
import Dropzone from 'react-dropzone';
import request from 'superagent';

const containerStyle = {
  textAlign: 'center',
  paddingTop: 10,
};

const GenMIFUButton = React.createClass({

  getInitialState() {
    return {
      MIFUAvailable: false,
    };
  },

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    if (nextProps.VDBLoaded && nextProps.SPILoaded && nextProps.PDMSLoaded && nextProps.previousMIFULoaded) {
      this.setState({MIFUAvailable: true});
    }
  },

  render() {

    const self = this;

    let MIFUDL = (
      <span></span>
    );

    if (this.state.MIFUAvailable) {
      MIFUDL = (
        <RaisedButton linkButton={true} href="http://localhost:8888/genMIFU" secondary={true} label="Download MIFU Report" />
      );
    }

    return (
      <div style={containerStyle}>
        {MIFUDL}
      </div>
    );
  },
});

export default GenMIFUButton;
