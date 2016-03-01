
import React from 'react';
import Dropzone from 'react-dropzone';
import request from 'superagent';
import RaisedButton from 'material-ui/lib/raised-button';
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';

//import imgPath from 'test.jpg';

const imgPath = require('./logo.png');

import MIFUComponent from './MIFUComponent';

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
    return {
      tabValue: 'MIFUupdate',
      loadingState: {
        vdb: false,
        spi: false,
        pdms: false,
        pMIFU: false,
        bom: false,
        impactedIso: false,
        ALL: false,
      },
      filesNeeded: {
        MIFUinit: ['vdb', 'spi', 'pdms'],
        MIFUupdate: ['vdb', 'spi', 'pdms', 'pMIFU'],
        IsoStatus: ['vdb', 'spi', 'pdms', 'pMIFU', 'bom', 'impactedIso'],
        SingleIsoStatus: ['vdb', 'spi', 'pdms', 'pMIFU', 'bom', 'impactedIso'],
      },
    };
  },

  handleTabChange(value) {
    if (typeof value !== 'object') {
      this.setState({
        tabValue: value,
      });
    }
  },

  onDropCB(type) {
    let newLoadingState = this.state.loadingState;
    newLoadingState[type] = true;
    newLoadingState['ALL'] = true;
    this.state.filesNeeded[this.state.tabValue].forEach(function(fileType) {
      if (newLoadingState[fileType] === false) {
        newLoadingState['ALL'] = false;
      }
    });
    this.setState({loadingState: newLoadingState});
  },

  render() {

    const self = this;

    return (
      <div>
        <img src={imgPath} alt='header' />
        <div style={containerStyle}><h1>EasyIso</h1></div>
        <Tabs value={this.state.tabValue} onChange={this.handleTabChange}>
          <Tab label='Instrum Status Initialisation' value='MIFUinit' >
            <MIFUComponent type='MIFUinit' filesLoaded={self.state.loadingState} filesToUpload={self.state.filesNeeded.MIFUinit} onDropCB={self.onDropCB}/>
          </Tab>
          <Tab label='Instrum Status update' value='MIFUupdate' >
            <MIFUComponent type='MIFUupdate' filesLoaded={self.state.loadingState}  filesToUpload={self.state.filesNeeded.MIFUupdate} onDropCB={self.onDropCB}/>
          </Tab>
          <Tab label='Global Iso status' value='IsoStatus' >
            <MIFUComponent type='IsoStatus' filesLoaded={self.state.loadingState}  filesToUpload={self.state.filesNeeded.IsoStatus} onDropCB={self.onDropCB}/>
          </Tab>
          <Tab label='Single Iso status' value='SingleIsoStatus' >
            <MIFUComponent type='SingleIsoStatus' filesLoaded={self.state.loadingState}  filesToUpload={self.state.filesNeeded.SingleIsoStatus} onDropCB={self.onDropCB}/>
          </Tab>
        </Tabs>
      </div>

    );
  },
});

export default Main;
