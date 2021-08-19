import React, { useState, useEffect } from 'react'
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native'
import firestore from '@react-native-firebase/firestore';
import styles from './styles';

export default function HomeScreen({ user, navigation }) {

    const [users, setusers] = useState(null);
    const getUsers = async () => {
        const querySnap = await firestore().collection('users').where('uid', '!=', user.uid).get();
        const allUsers = querySnap.docs.map(docSnap => docSnap.data());
        setusers(allUsers);
    }
    useEffect(() => {
        getUsers();
    }, [])

    const Card = ({ item }) => {
        return (<TouchableOpacity onPress={() => {
            navigation.navigate('Chat', {
                name: item.name, uid: item.uid,
                status: typeof (item.status) == "string" ? item.status : item.status.toDate().toString()
            });
        }}>
            <View style={styles.container}>
                <Image source={{ uri: item.pic }} style={styles.logo} />
                <View >
                    <Text style={styles.title}>{item.name}</Text>
                   
                </View>
            </View>
        </TouchableOpacity>)
    }
    return (
        <View>
            <FlatList
                data={users}
                renderItem={({ item }) => <Card item={item} />}
                keyExtractor={(item) => item.uid}
            />

        </View>
    )
}
