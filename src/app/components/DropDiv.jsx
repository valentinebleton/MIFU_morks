
import React from 'react';
import Dropzone from 'react-dropzone';
import request from 'superagent';

import { connect } from 'react-redux';
import { updateLoadingState } from '../ducks/mainDuck';
import { getListIsoAsync } from '../ducks/mainDuck';

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
  backgroundColor: 'blue',
  color: 'white',
};

const DropDiv = React.createClass({

  onDrop(files, type) {
    const self = this;
    let req = request.post('http://localhost:8888/uploadSourceFile');
    req.set('Access-Control-Allow-Origin', '*');
    files.forEach(function(file) {
      req.attach('file', file, file.name);
    });
    req.end(function(err, response) {
      self.props.dispatch(updateLoadingState(type));
      if (type === 'bom') {
        self.props.dispatch(getListIsoAsync());
      }
    });
  },

  render() {

    const self = this;
    const { vdb, spi, pdms, pMIFU, bom, impactedIso } = this.props;
    const fType = this.props.fType;

    let fName = '';
    let message = '';
    let style = dropZoneStyle;
    if (fType === 'vdb') {
      fName = 'VDB';
      message = 'Upload '+fName+' File Here';
      if (vdb === true) {
        style= dropZoneActiveStyle;
        message = fName+' File Uploaded !';
      }
    } else if (fType === 'spi') {
      fName = 'SPI';
      message = 'Upload '+fName+' File Here';
      if (spi === true) {
        style= dropZoneActiveStyle;
        message = fName+' File Uploaded !';
      }
    } else if (fType === 'pdms') {
      fName = 'PDMS';
      message = 'Upload '+fName+' File Here';
      if (pdms === true) {
        style= dropZoneActiveStyle;
        message = fName+' File Uploaded !';
      }
    } else if (fType === 'pMIFU') {
      fName = 'prev. inst. status';
      message = 'Upload '+fName+' File Here';
      if (pMIFU === true) {
        style= dropZoneActiveStyle;
        message = fName+' File Uploaded !';
      }
    } else if (fType === 'bom') {
      fName = 'BOM';
      message = 'Upload '+fName+' File Here';
      if (bom === true) {
        style= dropZoneActiveStyle;
        message = fName+' File Uploaded !';
      }
    } else if (fType === 'impactedIso') {
      fName = 'Impacted isos';
      message = 'Upload '+fName+' File Here';
      if (impactedIso === true) {
        style= dropZoneActiveStyle;
        message = fName+' File Uploaded !';
      }
    }

    return (
      <div style={divStyle}>
        <h2>{fName} File</h2>
        <Dropzone onDrop={function(files) {self.onDrop(files, fType)}} style={style}>
          <div>{message}</div>
        </Dropzone>
      </div>
    );
  },
});

const mapStateToProps = function(state) {
  return {
    vdb: state.main.loadingState.vdb,
    spi: state.main.loadingState.spi,
    pdms: state.main.loadingState.pdms,
    pMIFU: state.main.loadingState.pMIFU,
    bom: state.main.loadingState.bom,
    impactedIso: state.main.loadingState.impactedIso,
  };
};

export default connect(mapStateToProps)(DropDiv);
