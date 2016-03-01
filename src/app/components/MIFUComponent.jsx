
import React from 'react';
import Dropzone from 'react-dropzone';
import request from 'superagent';
import RaisedButton from 'material-ui/lib/raised-button';
import Colors from 'material-ui/lib/styles/colors';
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import MenuItem from 'material-ui/lib/menus/menu-item';

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
      selectedIso: '',
      listIsos: [],
    };
  },

  getListIso() {
    const self = this;
    let req = request.get('http://localhost:8888/getIsoNameList');
    req.set('Access-Control-Allow-Origin', '*');
    req.end(function(err, response) {
      self.setState({
        listIsos: response.body,
        selectedIso: response.body[0],
      });
    });
  },

  handleChange(e, i, value) {
    this.setState({selectedIso: value})
  },

  onDropCB(type) {
    if (type === 'bom') {
      this.getListIso();
    }
    this.props.onDropCB(type);
  },

  render() {

    const self = this;

    if (self.props.filesToUpload === undefined) {
      return (
        <div>
        </div>
      );
    } else {

      let dropDivs = self.props.filesToUpload.map(function(fType) {
        return (
          <DropDiv fType={fType} loadingState={self.props.filesLoaded} key={fType} onDropCB={self.onDropCB} />
        );
      });

      let MIFUbutton = '';

      if (self.props.filesLoaded['ALL'] === true) {
        if (self.props.type === 'MIFUinit' || self.props.type === 'MIFUupdate') {
          MIFUbutton = (
            <RaisedButton linkButton={true} href="http://localhost:8888/genMIFU" secondary={true} label="Download MIFU Report" />
          );
        } else if (self.props.type === 'IsoStatus') {
          MIFUbutton = (
            <RaisedButton linkButton={true} href="http://localhost:8888/genISOS" secondary={true} label="Download ISO Report" />
          );
        } else if (self.props.type === 'SingleIsoStatus') {

          if (self.state.listIsos !== []) {
            let menuItems = self.state.listIsos.map(function(iso) {
              return (
                <MenuItem value={iso} key={iso} primaryText={iso}/>
              );
            });

            if (self.state.selectedIso !== '') {
              MIFUbutton = (
                <div>
                  <DropDownMenu maxHeight={300} value={self.state.selectedIso} onChange={this.handleChange}>
                    {menuItems}
                  </DropDownMenu>
                  <RaisedButton linkButton={true} href="http://localhost:8888/genISOS" secondary={true} label="Download ISO Report" />
                </div>
              );
            }
          }
        }
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
    }
  },
});



export default MIFUComponent;
