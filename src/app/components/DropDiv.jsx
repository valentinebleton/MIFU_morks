
import React from 'react';
import Dropzone from 'react-dropzone';
import request from 'superagent';
import RaisedButton from 'material-ui/lib/raised-button';
import Colors from 'material-ui/lib/styles/colors';

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

const DropDiv = React.createClass({

  onDrop(files, type) {
    let self = this;
    let req = request.post('http://localhost:8888/uploadSourceFile');
    req.set('Access-Control-Allow-Origin', '*');
    files.forEach(function(file) {
      req.attach('file', file, file.name);
    });
    req.end(function(err, response) {
      self.props.onDropCB(type);
    });
  },

  render() {

    const self = this;

    let fName = '';
    let message = '';
    let style = dropZoneStyle;
    if (this.props.fType === 'vdb') {
      fName = 'VDB';
      message = 'Upload '+fName+' File Here';
      if (self.props.loadingState.vdb === true) {
        style= dropZoneActiveStyle;
        message = fName+' File Uploaded !';
      }
    } else if (this.props.fType === 'spi') {
      fName = 'SPI';
      message = 'Upload '+fName+' File Here';
      if (self.props.loadingState.spi === true) {
        style= dropZoneActiveStyle;
        message = fName+' File Uploaded !';
      }
    } else if (this.props.fType === 'pdms') {
      fName = 'PDMS';
      message = 'Upload '+fName+' File Here';
      if (self.props.loadingState.pdms === true) {
        style= dropZoneActiveStyle;
        message = fName+' File Uploaded !';
      }
    } else if (this.props.fType === 'pMIFU') {
      fName = 'prev. inst. status';
      message = 'Upload '+fName+' File Here';
      if (self.props.loadingState.pMIFU === true) {
        style= dropZoneActiveStyle;
        message = fName+' File Uploaded !';
      }
    } else if (this.props.fType === 'bom') {
      fName = 'BOM';
      message = 'Upload '+fName+' File Here';
      if (self.props.loadingState.bom === true) {
        style= dropZoneActiveStyle;
        message = fName+' File Uploaded !';
      }
    } else if (this.props.fType === 'impactedIso') {
      fName = 'Impacted isos';
      message = 'Upload '+fName+' File Here';
      if (self.props.loadingState.impactedIso === true) {
        style= dropZoneActiveStyle;
        message = fName+' File Uploaded !';
      }
    }

    return (
      <div style={divStyle}>
        <h2>{fName} File</h2>
        <Dropzone onDrop={function(files) {self.onDrop(files, self.props.fType)}} style={style}>
          <div>{message}</div>
        </Dropzone>
      </div>
    );
  },
});

export default DropDiv;
