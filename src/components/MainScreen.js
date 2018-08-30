import React from 'react';
// import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Button,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableNativeFeedback,
  TouchableHighlight,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import LoginStatusMessage from './LoginStatusMessage';
import AuthButton from './AuthButton';

import Envelope from './Envelope';

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
// });

const envelopes = [
  { name: 'Groceries' },
  { name: 'Pet' },
  { name: 'Gas' },
  { name: 'title4' },
  { name: 'title5' },
  { name: 'title6' },
  { name: 'title7' },
  { name: 'title8' },
  { name: 'title9' },
];

const MainScreen = () => (
  <View style={styles.container}>
    {/* <LoginStatusMessage />j */}
    {/* <AuthButton /> */}
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={_ => alert('asdf')}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>

      {envelopes.map(e => (
        <Touchable
          key={e.name}
          //   onPress={_ =>
          //     dispatch(NavigationActions.navigate({ routeName: 'details' }))
          //   }
        >
          <Envelope key={e.name} envelope={e} />
        </Touchable>
      ))}
    </ScrollView>
  </View>
);

MainScreen.navigationOptions = {
  title: 'Envelopes',
};

export default MainScreen;
// import React from 'react';
// import {
//   Button,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   TouchableNativeFeedback,
//   TouchableHighlight,
// } from 'react-native';
// import { WebBrowser, Icon } from 'expo';
// import { NavigationActions } from 'react-navigation';
// import PropTypes from 'prop-types';

// import { connect } from 'react-redux';

// import TabBarIcon from '../components/TabBarIcon';
// import Envelope from '../components/Envelope';

// // export default class HomeScreen extends React.Component {
// class HomeScreen extends React.Component {
//   static navigationOptions = {
//     // header: null,
//     title: 'Envelopes',
//     headerStyle: {
//       // backgroundColor: '#9df2ff',
//       // backgroundColor: '#ddd',
//       borderBottomColor: '#000000',
//       borderBottomWidth: 0.5,
//     },
//   }; // backgroundColor: '#6edc6e',
//   // headerRight: (
//   //   <Icon.Ionicons
//   //     name="md-add"
//   //     onPress={_ => alert('asdf')}
//   //     size={26}
//   //   />

//     const { dispatch } = this.props;

//     return (
//       <ScrollView style={styles.container}>
//         <TouchableOpacity style={styles.button} onPress={_ => alert('asdf')}>
//           <Text style={styles.buttonText}>+</Text>
//         </TouchableOpacity>

//         {envelopes.map(e => (
//           <Touchable
//             key={e.name}
//             onPress={_ =>
//               dispatch(NavigationActions.navigate({ routeName: 'details' }))
//             }
//           >
//             <Envelope key={e.name} envelope={e} />
//           </Touchable>
//         ))}
//       </ScrollView>
//     );
//   }
// }

const Touchable =
  Platform.OS === 'android' ? TouchableNativeFeedback : TouchableHighlight;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 15,
    // backgroundColor: '#dddddd',
    backgroundColor: '#fff',
    // backgroundColor: '#00dcff',
  },
  button: {
    alignItems: 'center',
    // height: 50,
    padding: 15,
    // backgroundColor: '#9df2ff',
    // backgroundColor: '#ddd',
    // flex: 1,
    // marginTop: -15,
  },
  buttonText: {
    // backgroundColor: '#228b22',
    textAlign: 'center',
    // width: 90,
    fontSize: 40,
  },
});

// HomeScreen.propTypes = {
//   dispatch: PropTypes.func.isRequired,
// };

// const mapStateToProps = state => ({
//   //
// });

// export default connect(mapStateToProps)(HomeScreen);
