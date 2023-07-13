import '../wdyr';
import { App } from '@immotech/screens';
import { AppRegistry, LogBox } from 'react-native';

LogBox.ignoreAllLogs();
AppRegistry.registerComponent('immotech', () => App);
