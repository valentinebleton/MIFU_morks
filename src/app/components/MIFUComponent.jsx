
import React from 'react';
import Dropzone from 'react-dropzone';
import request from 'superagent';
import RaisedButton from 'material-ui/lib/raised-button';
import Colors from 'material-ui/lib/styles/colors';

import DropDiv from './DropDiv';

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

const MIFUComponent = React.createClass({

  getInitialState() {
    let req = request.get('http://localhost:8888/wipeAll');
    req.set('Access-Control-Allow-Origin', '*');
    req.end(function(err, response) {
      console.log(err);
    });

    return {
      loadingState: {
        VDBLoaded: false,
        SPILoaded: false,
        PDMSLoaded: false,
        previousMIFULoaded: false,
      },
    };
  },

  onDropCB(type) {
    let newLoadingState = this.state.loadingState;
    if (type === 'vdb') {
      newLoadingState.VDBLoaded = true;
    } else if (type === 'spi') {
      newLoadingState.SPILoaded = true;
    } else if (type === 'pdms') {
      newLoadingState.PDMSLoaded = true;
    } else if (type === 'pMIFU') {
      newLoadingState.previousMIFULoaded = true;
    }
    this.setState({loadingState: newLoadingState});
  },

  render() {

    const self = this;

    let dropDivs = self.props.filesToUpload.map(function(fType) {
      return (
        <DropDiv fType={fType} loadingState={self.state.loadingState} key={fType} onDropCB={self.onDropCB} />
      );
    });

    let MIFUbutton = '';

    if (self.state.loadingState.VDBLoaded && self.state.loadingState.SPILoaded && self.state.loadingState.PDMSLoaded) {
      if ((self.props.filesToUpload.indexOf('pMIFU') === -1) || self.state.loadingState.previousMIFULoaded)
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
