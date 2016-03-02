
import React from 'react';
import Dropzone from 'react-dropzone';
import request from 'superagent';
import RaisedButton from 'material-ui/lib/raised-button';
import Colors from 'material-ui/lib/styles/colors';
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import DropDiv from './DropDiv';

import { connect } from 'react-redux';
import { changeSelectedIso } from '../ducks/mainDuck';

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

    return {};
  },

  handleChange(e, i, value) {
    this.props.dispatch(changeSelectedIso(value));
  },

  render() {

    const self = this;

    if (self.props.filesNeeded[self.props.tabValue] === undefined) {
      return (
        <div>
        </div>
      );
    } else {

      let dropDivs = self.props.filesNeeded[self.props.tabValue].map(function(fType) {
        return (
          <DropDiv fType={fType} key={fType} />
        );
      });

      let MIFUbutton = '';

      if (self.props.genButton === true) {
        if (self.props.type === 'MIFUinit' || self.props.type === 'MIFUupdate') {
          MIFUbutton = (
            <RaisedButton linkButton={true} href="http://localhost:8888/genMIFU" secondary={true} label="Download MIFU Report" />
          );
        } else if (self.props.type === 'IsoStatus') {
          MIFUbutton = (
            <RaisedButton linkButton={true} href="http://localhost:8888/genISOS" secondary={true} label="Download ISO Report" />
          );
        } else if (self.props.type === 'SingleIsoStatus') {
          if (self.props.listIsos !== undefined) {
            let menuItems = self.props.listIsos.map(function(iso) {
              return (
                <MenuItem value={iso} key={iso} primaryText={iso}/>
              );
            });

            if (self.props.selectedIso !== '') {
              MIFUbutton = (
                <div>
                  <DropDownMenu maxHeight={300} value={self.props.selectedIso} onChange={this.handleChange}>
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

const mapStateToProps = function(state) {
  return {
    tabValue: state.main.tabValue,
    genButton: state.main.loadingState.ALL,
    filesNeeded: state.main.filesNeeded,
    listIsos: state.main.listIsos,
    selectedIso: state.main.selectedIso,
  };
};

export default connect(mapStateToProps)(MIFUComponent);
