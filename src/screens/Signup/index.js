import React, { useState } from 'react'
import { View, Text, Image, KeyboardAvoidingView, TouchableOpacity, ActivityIndicator } from 'react-native'
import { TextInput, Button } from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker';
import styles from './styles';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function Signup({ navigation }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [showNext, setShowNext] = useState(false);
    const[loading,setLoading] = useState(false);

    if(loading){
        return <ActivityIndicator size='large' color='black' />
    }

    const pickImageAndupload = () => {
        launchImageLibrary({ quality: 0.5 }, (fileObj) => {
            const uploadTask = storage().ref().child(`/userProfile/${Date.now()}`).putFile(fileObj.uri)
            uploadTask.on('state_changed',
                (snapshot) => {
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    if (progress == 100) alert('Image uploaded');
                },
                (error) => {
                    alert('error uploading image');
                },
                () => {
                    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                        setImage(downloadURL);
                    });
                }
            );
        })
    }

    const userSignup = async () => {
        setLoading(true);
        if (!email || !password || !image || !name) {
            alert('Please fill all the details');
            return
        }
        try {
            const result = await auth().createUserWithEmailAndPassword(email, password);
            console.log("res", result);
            firestore().collection('users').doc(result.user.uid).set({
                name: name,
                email: result.user.email,
                uid: result.user.uid,
                pic: image,
                status:'online',
            })
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
            {!showNext ? <View style={styles.form}>
                <TextInput
                    label='Email'
                    value={email}
                    onChangeText={(text) => {
                        setEmail(text);
                    }}
                    mode='outlined'
                />
                <TextInput
                    label='Password'
                    value={password}
                    onChangeText={(text) => {
                        setPassword(text);

                    }}
                    secureTextEntry
                    mode='outlined'
                />
                <Button mode='contained'
                    onPress={() => {
                        setShowNext(true);
                    }}>Next</Button>

                <TouchableOpacity onPress={() => {
                    navigation.goBack();
                }}>
                    <Text style={styles.link}>Already have an account? SignIn.</Text>
                </TouchableOpacity>

            </View> : <View style={styles.form}>
                <TextInput
                    label='Name'
                    value={name}
                    onChangeText={(text) => {
                        setName(text);

                    }}

                    mode='outlined'
                />
                <Button mode='contained'
                    onPress={() => {
                        pickImageAndupload();
                    }}>Add Profile Picture</Button>

                <Button mode='contained'
                    disabled={image ? false : true}
                    onPress={() => {
                        userSignup();
                    }}>Signup</Button>
            </View>
            }


        </KeyboardAvoidingView>
    )
}
