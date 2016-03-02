
import request from 'superagent';

const CHANGE_TAB = 'MIFU/main/CHANGE_TAB';
const CHANGE_SELECTED_ISO = 'MIFU/main/CHANGE_SELECTED_ISO';
const UPDATE_LOADING_STATE = 'MIFU/main/UPDATE_LOADING_STATE';
const GET_LIST_ISO = 'MIFU/main/GET_LIST_ISO';

const initialState = {
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
  selectedIso: '',
  listIsos: [],
};

export default function main(state = initialState, action = {}) {
  switch (action.type) {
    case CHANGE_TAB:
      return {
        ...state,
        tabValue: action.value,
      };
    case UPDATE_LOADING_STATE:
      const loadingState = state.loadingState;
      loadingState[action.fType] = true;
      loadingState['ALL'] = true;
      state.filesNeeded[state.tabValue].forEach(function(fileType) {
        if (loadingState[fileType] === false) {
          loadingState['ALL'] = false;
        }
      });
      return {
        ...state,
        loadingState: loadingState,
      };
    case GET_LIST_ISO:
      return {
        ...state,
        listIsos: action.listIsos,
        selectedIso: action.selectedIso,
      };
    case CHANGE_SELECTED_ISO:
      return {
        ...state,
        selectedIso: action.value,
      };
    default:
      return {
        ...state,
        listIsos: action.listIsos,
        selectedIso: action.selectedIso,
      };
  }
}

export function changeTab(value) {
  return {
    type: CHANGE_TAB,
    value,
  };
}

export function changeSelectedIso(value) {
  return {
    type: CHANGE_SELECTED_ISO,
    value,
  };
}

export function updateLoadingState(fType) {
  return {
    type: UPDATE_LOADING_STATE,
    fType,
  };
}

export function getListIsoAsync() {
  return function(dispatch) {
    let req = request.get('http://localhost:8888/getIsoNameList');
    req.set('Access-Control-Allow-Origin', '*');
    req.end(function(err, response) {
      dispatch({
        type: GET_LIST_ISO,
        listIsos: response.body,
        selectedIso: response.body[0],
      });
    });
  }
}
