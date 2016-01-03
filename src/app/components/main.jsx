/** In this file, we create a React component which incorporates components provided by material-ui */

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

const Main = React.createClass({

  getInitialState() {
    return {
      VDBLoaded: false,
      SPILoaded: false,
      PDMSLoade: false,
      previousMIFULoaded: false,
      MIFUExists: true,
    };
  },

  onDrop(files) {
    let self = this;
    let req = request.post('http://localhost:8888/uploadSourceFile');
    req.set('Access-Control-Allow-Origin', '*');
    files.forEach(function(file) {
      req.attach('file', file, file.name);
    });
    req.end(function(err, response) {
      self.setState({open: true});
    });
  },

  render() {

    const self = this;

    let MIFUDL = (
      <span></span>
    );

    if (this.state.MIFUExists) {
      MIFUDL = (
        <RaisedButton linkButton={true} href="http://localhost:8888/genMIFU" secondary={true} label="Download MIFU Report" />
      );
    }

    return (
      <div style={containerStyle}>
        <h1>Upload your files !!!</h1>
        <h2>VDB File</h2>
        <Dropzone onDrop={self.onDrop}>
          <div>Upload VDB File Here</div>
        </Dropzone>
        <h2>SPI File</h2>
        <Dropzone onDrop={self.onDrop}>
          <div>Upload SPI File Here</div>
        </Dropzone>
        <h2>PDMS File</h2>
        <Dropzone onDrop={self.onDrop}>
          <div>Upload PDMS File Here</div>
        </Dropzone>
        <h2>Previous MIFU File</h2>
        <Dropzone onDrop={self.onDrop}>
          <div>Upload Previous MIFU File Here</div>
        </Dropzone>
        {MIFUDL}
      </div>
    );
  },
});

export default Main;
