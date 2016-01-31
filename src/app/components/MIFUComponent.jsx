
import React from 'react';
import Dropzone from 'react-dropzone';
import request from 'superagent';
import RaisedButton from 'material-ui/lib/raised-button';
import Colors from 'material-ui/lib/styles/colors';

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

const dropZoneStyle = {
  height: 40,
  width: 200,
  border: 2,
  borderStyle: 'dashed',
  borderRadius: 10,
};

const dropZoneActiveStyle = {
  height: 40,
  width: 200,
  borderRadius: 10,
  backgroundColor: Colors.cyan800,
  color: 'white',
};

const MIFUComponent = React.createClass({

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

    let dropDivs = self.props.filesToUpload.map(function(fType) {
      let fName = '';
      let message = '';
      let style = dropZoneStyle;
      if (fType === 'vdb') {
        fName = 'VDB';
        message = 'Upload '+fName+' File Here';
        if (self.state.VDBLoaded === true) {
          style= dropZoneActiveStyle;
          message = fName+' File Uploaded !';
        }
      } else if (fType === 'spi') {
        fName = 'SPI';
        message = 'Upload '+fName+' File Here';
        if (self.state.SPILoaded === true) {
          style= dropZoneActiveStyle;
          message = fName+' File Uploaded !';
        }
      } else if (fType === 'pdms') {
        fName = 'PDMS';
        message = 'Upload '+fName+' File Here';
        if (self.state.PDMSLoaded === true) {
          style= dropZoneActiveStyle;
          message = fName+' File Uploaded !';
        }
      } else if (fType === 'pMIFU') {
        fName = 'previous MIFU';
        message = 'Upload '+fName+' File Here';
        if (self.state.previousMIFULoaded === true) {
          style= dropZoneActiveStyle;
          message = fName+' File Uploaded !';
        }
      }
      return (
        <div style={divStyle} key={fType}>
          <h2>{fName} File</h2>
          <Dropzone onDrop={function(files) {self.onDrop(files, fType)}} style={style}>
            <div>{message}</div>
          </Dropzone>
        </div>
      );
    });

    let MIFUbutton = '';

    if (self.state.VDBLoaded && self.state.SPILoaded && self.state.PDMSLoaded) {
      if ((self.props.filesToUpload.indexOf('pMIFU') === -1) || self.state.previousMIFULoaded)
      MIFUbutton = (
        <RaisedButton linkButton={true} href="http://localhost:8888/genMIFU" secondary={true} label="Download MIFU Report" />
      );
    };

    return (
      <div>
        <div style={containerStyle}><h1>Please upload your files</h1></div>
        {dropDivs}
        <div style={containerStyle}>
          {MIFUbutton}
        </div>
      </div>
    );
  },
});

export default MIFUComponent;
