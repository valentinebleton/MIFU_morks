
import React from 'react';
import request from 'superagent';
import Button from 'react-bootstrap/lib/Button';
import DropDiv from './DropDiv';

import 'react-virtualized-select/styles.css';
import VirtualizedSelect from 'react-virtualized-select';

import { connect } from 'react-redux';
import { changeSelectedIso, updateGeneratedMIFU } from '../ducks/mainDuck';

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

  generateMIFU() {
    const self = this;
    let req = request.get('http://localhost:8888/genMIFU');
    req.set('Access-Control-Allow-Origin', '*');
    req.end(function(err, response) {
      console.log(err);
      self.props.dispatch(updateGeneratedMIFU(response.body.targetPath, response.body.logsPath));
    });

    return {};
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

          if (!self.props.generatedFiles.MIFU.done) {
            MIFUbutton = (
              <div>
                <Button onClick={self.generateMIFU} bsStyle="primary">Generate MIFU Report</Button>
              </div>
            );
          } else {
            MIFUbutton = (
              <div>
                <Button href={"http://localhost:8888/getFile?pathName="+self.props.generatedFiles.MIFU.targetPath} bsStyle="primary">Download MIFU Report</Button>
                <Button href={"http://localhost:8888/getFile?pathName="+self.props.generatedFiles.MIFU.logsPath} bsStyle="primary">Download MIFU Logs</Button>
              </div>
            );
          }

        } else if (self.props.type === 'IsoStatus') {
          MIFUbutton = (
            <Button href="http://localhost:8888/genISOS" bsStyle="primary">Download ISO Report</Button>
          );
        } else if (self.props.type === 'SingleIsoStatus') {

          if (self.props.listIsos !== undefined) {
            let options = self.props.listIsos.map(function(iso) {
              return {
                value: iso,
                label: iso,
              };
            });

            if (self.props.selectedIso !== '') {
              MIFUbutton = (
                <div>
                  <VirtualizedSelect
                    options={options}
                    onChange={(selectValue) => this.props.dispatch(changeSelectedIso(selectValue.value))}
                    value={self.props.selectedIso}
                  />
                  <Button href="http://localhost:8888/genISOS" bsStyle="primary">Download ISO Report</Button>
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
    generatedFiles: state.main.generatedFiles,
  };
};

export default connect(mapStateToProps)(MIFUComponent);
