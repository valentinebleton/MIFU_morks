
import React from 'react';
import RaisedButton from 'material-ui/lib/raised-button';
import Dialog from 'material-ui/lib/dialog';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import LightRawTheme from 'material-ui/lib/styles/raw-themes/light-raw-theme';
import Colors from 'material-ui/lib/styles/colors';
import FlatButton from 'material-ui/lib/flat-button';
import Dropzone from 'react-dropzone';
import request from 'superagent';

import GenMIFUButton from './genMIFUButton';

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

  getInitialState() {
    let req = request.get('http://localhost:8888/wipeAll');
    req.set('Access-Control-Allow-Origin', '*');
    req.end(function(err, response) {
      console.log(err);
    });

    return {
      VDBLoaded: false,
      SPILoaded: false,
      PDMSLoaded: false,
      previousMIFULoaded: false,
    };
  },

  onDropVDB(files) {
    this.onDrop(files, 'vdb');
  },

  onDropSPI(files) {
    this.onDrop(files, 'spi');
  },

  onDropPDMS(files) {
    this.onDrop(files, 'pdms');
  },

  onDropPMIFU(files) {
    this.onDrop(files, 'pMIFU');
  },

  onDrop(files, type) {
    let self = this;
    let req = request.post('http://localhost:8888/uploadSourceFile');
    req.set('Access-Control-Allow-Origin', '*');
    files.forEach(function(file) {
      req.attach('file', file, file.name);
    });
    req.end(function(err, response) {
      if (type === 'vdb') {
        self.setState({VDBLoaded: true});
      } else if (type === 'spi') {
        self.setState({SPILoaded: true});
      } else if (type === 'pdms') {
        self.setState({PDMSLoaded: true});
      } else if (type === 'pMIFU') {
        self.setState({previousMIFULoaded: true});
      }
    });
  },

  render() {

    const self = this;

    return (
      <div>
        <div style={containerStyle}><h1>Please upload your files</h1></div>
        <div style={containerStyle}>
          <div style={divStyle}>
            <h2>VDB File</h2>
            <Dropzone onDrop={self.onDropVDB}>
              <div>Upload VDB File Here</div>
            </Dropzone>
          </div>
          <div style={divStyle}>
            <h2>SPI File</h2>
            <Dropzone onDrop={self.onDropSPI}>
              <div>Upload SPI File Here</div>
            </Dropzone>
          </div>
        </div>
        <div style={containerStyle}>
          <div style={divStyle}>
            <h2>PDMS File</h2>
            <Dropzone onDrop={self.onDropPDMS}>
              <div>Upload PDMS File Here</div>
            </Dropzone>
          </div>
          <div style={divStyle}>
            <h2>Previous MIFU File</h2>
            <Dropzone onDrop={self.onDropPMIFU}>
              <div>Upload Previous MIFU File Here</div>
            </Dropzone>
          </div>
        </div>
        <GenMIFUButton VDBLoaded={self.state.VDBLoaded} SPILoaded={self.state.SPILoaded} PDMSLoaded={self.state.PDMSLoaded} previousMIFULoaded={self.state.previousMIFULoaded} />
      </div>
    );
  },
});

export default Main;
