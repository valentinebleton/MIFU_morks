
import React from 'react';
import MIFUComponent from './MIFUComponent';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';

import { connect } from 'react-redux';
import { changeTab } from '../ducks/mainDuck';

const imgPath = require('./logo.png');

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

  handleTabChange(value) {
    if (typeof value !== 'object') {
      this.props.dispatch(changeTab(value));
    }
  },

  render() {

    const self = this;
    const { tabValue } = this.props;

    return (
      <div>
        <img src={imgPath} alt='header' />
        <div style={containerStyle}><h1>SMART Iso</h1></div>
          <Nav bsStyle="tabs" justified activeKey={tabValue} onSelect={this.handleTabChange}>
            <NavItem eventKey={'MIFUinit'} >Instrum Status Initialisation</NavItem>
            <NavItem eventKey={'MIFUupdate'} >Instrum Status update</NavItem>
            <NavItem eventKey={'IsoStatus'} >Global Iso status</NavItem>
            <NavItem eventKey={'SingleIsoStatus'} >Single Iso status</NavItem>
          </Nav>
          <MIFUComponent type={tabValue} />
      </div>

    );
  },
});

const mapStateToProps = function(state) {
  return {
    tabValue: state.main.tabValue,
  };
};

export default connect(mapStateToProps)(Main);
