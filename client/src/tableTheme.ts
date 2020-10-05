import { createTheme } from 'react-data-table-component';

const tableTheme = {
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
      disabled: 'rgba(0,0,0,.12)',
    },
    background: {
      default: '#000',
    },
    context: {
      background: '#E91E63',
      text: '#FFFFFF',
    },
    divider: {
      default: 'rgba(255, 255, 255, 0.1)',
    },
    button: {
      default: '#FFFFFF',
      focus: 'rgba(255, 255, 255, .54)',
      hover: 'rgba(255, 255, 255, .12)',
      disabled: 'rgba(255, 255, 255, .18)',
    },
    sortFocus: {
      default: 'rgba(255, 255, 255, .54)',
    },
    selected: {
      default: 'rgba(0, 0, 0, .7)',
      text: '#FFFFFF',
    },
    highlightOnHover: {
      default: 'rgba(0, 0, 0, .7)',
      text: '#FFFFFF',
    },
    striped: {
      default: 'rgba(0, 0, 0, .87)',
      text: '#FFFFFF',
    },
};

createTheme('alpha', tableTheme);

