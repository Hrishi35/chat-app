import React, { useState } from 'react'
import { View, Text, Image,KeyboardAvoidingView,TouchableOpacity,ActivityIndicator } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import styles from './styles';
import auth from '@react-native-firebase/auth';

export default function Login({navigation}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const[loading,setLoading] = useState(false);

    if(loading){
        return <ActivityIndicator size='large' color='black' />
    }

    const userLogin = async () => {
        setLoading(true);
        if (!email || !password) {
            alert('Please fill all the details');
            return
        }
        try {
            const result = await auth().signInWithEmailAndPassword(email,password);
            console.log("res", result);
            setLoading(false);
        } catch (err) {
            alert(err);
        }

    }

    return (
        <KeyboardAvoidingView>
        <View style={styles.container}>

            <Image
                style={styles.logo}
                source={require('../../assets/logo.png')}

            />

            <Text style={styles.title}>Welcome to ChatApp!</Text>
        </View>
        <View style={styles.form}>
        <TextInput
        label='Email'
        value={email}
        onChangeText={(text)=>{
            setEmail(text);
        }}
        mode='outlined'
        />
        <TextInput
        label='Password'
        value={password}
        onChangeText={(text)=>{
            setPassword(text);
            
        }}
        secureTextEntry
        mode='outlined'
        />
        <Button mode='contained'
        onPress={()=>{
            userLogin();
        }}>Login</Button>
        <TouchableOpacity onPress={()=>navigation.navigate('Signup')}>
        <Text style={styles.link}>New User ? SignUp.</Text>
        </TouchableOpacity>
       
    </View> 
   
    
    </KeyboardAvoidingView>

    )
}
