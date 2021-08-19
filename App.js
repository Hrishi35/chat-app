
import React, { useState, useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import 'react-native-gesture-handler';
import Signup from './src/screens/Signup';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import Login from './src/screens/Login';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
import HomeScreen from './src/screens/HomeScreen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ChatScreen from './src/screens/ChatScreen';
import firestore from '@react-native-firebase/firestore';
import ProfileScreen from './src/screens/ProfileScreen';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: 'black',

  },
};

const Stack = createStackNavigator();

const Navigation = () => {
  const [user, setuser] = useState('')
  const [profile, setProfile] = useState(false)

  const AppHeader = () => {

    return (<View style={{ flexDirection: 'row' }}>
      <MaterialIcons
        name='logout'
        size={34}
        style={{ marginRight: 10 }}
        onPress={() => {
          firestore().collection('users')
            .doc(user.uid)
            .update({
              status: firestore.FieldValue.serverTimestamp()
            }).then(() => {
              auth().signOut();
            })

        }} />
      <MaterialIcons
        name='account-circle'
        size={34}
        style={{ marginRight: 10 }}
        onPress={() => {
          setProfile(true);

        }} />

    </View>)
  }


  useEffect(() => {
    setProfile(false);
    const unregister = auth().onAuthStateChanged(userExist => {
      if (userExist) {

        firestore().collection('users')
          .doc(userExist.uid)
          .update({
            status: 'online'
          })
        setuser(userExist)
      } else { setuser('') }

    })
    return () => {
      unregister();
    }
  }, [])
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerTintColor: 'black' }}  >
        {user ? profile ?
          <Stack.Screen name="Profile"  >
            {props => <ProfileScreen {...props} user={user} />}
          </Stack.Screen>

          : <>

            <Stack.Screen name="Home" options={{
              headerRight: () =>
                <AppHeader />,
              title: 'ChatApp'

            }} >
              {props => <HomeScreen {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen name="Chat" options={({ route }) => ({ title: <View><Text>{route.params.name}</Text><Text>{route.params.status}</Text></View> })} >
              {props => <ChatScreen {...props} user={user} />}
            </Stack.Screen>

          </>
          :
          <>
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />

          </>
        }

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const App = () => {



  return (
    <>
      <PaperProvider theme={theme}>
        <StatusBar barStyle='dark-content' backgroundColor='white' />
        <View style={styles.container}>
          <Navigation />
        </View>
      </PaperProvider>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
});

export default App;
