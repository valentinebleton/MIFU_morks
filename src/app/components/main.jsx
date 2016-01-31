
import React from 'react';
import Dropzone from 'react-dropzone';
import request from 'superagent';
import RaisedButton from 'material-ui/lib/raised-button';
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';

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
    };
  },

  handleTabChange(value) {
    if (typeof value !== 'object') {
      this.setState({
        tabValue: value,
      });
    }
  },

  render() {

    const self = this;

    return (
      <div>
        <div style={containerStyle}><h1>MIFU app</h1></div>
        <Tabs value={this.state.tabValue} onChange={this.handleTabChange}>
          <Tab label='MIFU initialisation' value='MIFUinit' >
            <MIFUComponent filesToUpload={['vdb', 'spi', 'pdms']}/>
          </Tab>
          <Tab label='MIFU update' value='MIFUupdate' >
            <MIFUComponent filesToUpload={['vdb', 'spi', 'pdms', 'pMIFU']}/>
          </Tab>
        </Tabs>
      </div>
    );
  },
});

export default Main;
