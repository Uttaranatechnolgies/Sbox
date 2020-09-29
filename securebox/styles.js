import {StyleSheet} from 'react-native';
import {
  GetFontSize,
  GetLayoutSize,
  GetWdithPercent,
  GetHeightPercent,
} from './globalstyles';

export default styles = StyleSheet.create({
  workspace: {
    flex: 1,
    alignItems: 'flex-start',
    width: GetWdithPercent(100),
  },

  headerTitle: {
    fontSize: GetFontSize(28),
    fontWeight: 'bold',
    alignSelf: 'center',
    fontStyle: 'italic',
  },

  mainspace: {
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    height: GetHeightPercent(60),
  },

  formspace: {
    margin: GetWdithPercent(10),
    width: GetWdithPercent(80),
  },

  inputText: {
    color: 'black',
    fontSize: GetFontSize(16),
    width: GetWdithPercent(80),
  },

  buttoncontainer: {
    paddingTop: 5,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  buttoncontainerright: {
    paddingTop: 5,
    height: 50,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },

  linkStyle: {
    fontSize: GetFontSize(12),
    paddingLeft: 5,
    color: '#3399FF',
  },

  labelcontainer: {
    flexDirection: 'row',
    width: GetWdithPercent(80),
    alignSelf: 'center',
    padding: 5,
  },
  labeltext: {
    fontSize: GetFontSize(15),
    color: 'black',
    fontWeight: 'bold',
    fontStyle: 'italic',
    textAlign: 'left',
    height: 21,
  },

  labelvalue: {
    color: 'black',
    fontSize: GetFontSize(15),
    fontStyle: 'italic',
    textAlign: 'left',
    paddingLeft: 5,
    height: 21,
  },

  switchcontainer: {
    height: 30,
    width: GetWdithPercent(80),
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    alignSelf: 'center',
  },

  scancontainer: {
    marginTop: 15,
    width: GetWdithPercent(80),
    height: GetWdithPercent(70),
    alignSelf: 'center',
  },

  scanner: {
    width: GetWdithPercent(80),
    height: GetWdithPercent(68),
    alignSelf: 'center',
    overflow: 'hidden',
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
  },

  switchtext: {
    color: 'black',
    fontWeight: 'bold',
  },
  errortext: {
    color: '#992600',
    fontSize: GetFontSize(15),
    fontWeight: 'bold',
    width: GetWdithPercent(80),
    marginLeft: 10,
    textAlign: 'center',
  },

  bottom10: {
    marginBottom: 10,
  },
  left10: {
    marginLeft: 10,
  },
  top10: {
    marginTop: 10,
  },
  top20: {
    marginTop: 20,
  },
  top30: {
    marginTop: 30,
  },
  top40: {
    marginTop: 40,
  },

  settingsHeader: {
    marginTop: 20,
    backgroundColor: '#1f2348',
  },
  settingsHeaderText: {
    padding: 8,
    color: 'white',
    fontWeight: '400',
    fontSize: GetFontSize(15),
  },

  settingsSection: {
    backgroundColor: 'lightgrey',
  },

  settingsSectionText: {
    padding: 8,
    color: 'black',
    fontSize: GetFontSize(15),
  },

  settingsSectionInput: {
    padding: 8,
  },
});
