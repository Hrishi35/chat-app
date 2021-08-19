import React, { useEffect, useState } from 'react'
import { View, Image, Text, ActivityIndicator } from 'react-native'
import firestore from '@react-native-firebase/firestore';
import styles from './styles';


export default function ProfileScreen({ user }) {
    const [profile, setProfile] = useState('');


    useEffect(() => {
        firestore().collection('users').doc(user.uid).get().then(docSnap => {
            setProfile(docSnap.data())
        })

    }, [])
    if (!profile) {
        return <ActivityIndicator size='large' color='black' />
    }
    return (
        <View style={styles.container}>
            <Image style={styles.logo}
            source={{uri:profile.pic}} />
            <Text style={styles.title}>{profile.name}</Text>
            <Text style={styles.subtitle}>{profile.email}</Text>
        </View>
    )


}
