import React, { useState, useEffect } from 'react'
import { Image } from 'react-native';
import { GiftedChat, Bubble, InputToolbar, Send, Actions } from 'react-native-gifted-chat'
import firestore from '@react-native-firebase/firestore';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';



export default function ChatScreen({ route, user }) {
    const [messages, setMessages] = useState([]);
    const { uid } = route.params;
    const [img, setImg] = useState(null);

    const getAllMsgs = async () => {
        const docid = uid > user.uid ? user.uid + "-" + uid : uid + "-" + user.uid
        const querySnap = await firestore().collection('chatrooms')
            .doc(docid)
            .collection('messages')
            .orderBy('createdAt', 'desc')
            .get()

        const Allmsgs = querySnap.docs.map(docSnap => {
            return {
                ...docSnap.data(),
                createdAt: docSnap.data().createdAt.toDate()
            }

        })
        setMessages(Allmsgs);
    }
    useEffect(() => {
        //  getAllMsgs()
        const docid = uid > user.uid ? user.uid + "-" + uid : uid + "-" + user.uid
        const messageRef = firestore().collection('chatrooms')
            .doc(docid)
            .collection('messages')
            .orderBy('createdAt', 'desc')

        const unsubscribe = messageRef.onSnapshot((querySnap) => {
            const Allmsgs = querySnap.docs.map(docSnap => {
                const data = docSnap.data();
                if (data.createdAt) {
                    return {
                        ...docSnap.data(),
                        createdAt: docSnap.data().createdAt.toDate()
                    }
                } else {
                    return {
                        ...docSnap.data(),
                        createdAt: new Date()
                    }
                }


            })
            setMessages(Allmsgs);
        })
        return () => {
            unsubscribe();
        }
    }, [])
    const onSend = (messageArray) => {
        const msg = messageArray[0];
        const mymsg = {
            ...msg,
            sentBy: user.uid,
            sentTo: uid,
            createdAt: new Date()
        }
        setMessages(previousMessages => GiftedChat.append(previousMessages, mymsg))
        const docid = uid > user.uid ? user.uid + "-" + uid : uid + "-" + user.uid
        firestore().collection('chatrooms')
            .doc(docid)
            .collection('messages')
            .add({ ...mymsg, createdAt: firestore.FieldValue.serverTimestamp() })
    }

    const _getPhotoLibrary = async () => {
        try {

            launchImageLibrary({ quality: 0.5 }, (response) => {
                console.log('Response = ', response.uri);
                const source = response.uri;

                const mgs = {
                    _id: uid,
                    text: '',
                    createdAt: new Date(),
                    user: {
                        _id: user.uid,

                    },
                    image: source,

                }

                setMessages(previousMessages => GiftedChat.append(previousMessages, mgs))


            });

        } catch (e) {
            console.log(e);
        }
    }

    const _getCamera = async () => {

        try {
            launchCamera({ quality: 0.5 }, (response) => {
                console.log('cam = ', response);

                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                } else if (response.customButton) {
                    console.log('User tapped custom button: ', response.customButton);
                } else {
                    const source = response.uri;

                    const mgs = {
                        _id: uid,
                        text: '',
                        createdAt: new Date(),
                        user: {
                            _id: user.uid,

                        },
                        image: source,

                    }
                    setMessages(previousMessages => GiftedChat.append(previousMessages, mgs))



                }
            });
        } catch (e) {
            console.log(e);
        }
    }


    renderActions = (props) => (
        <Actions
            {...props}
            containerStyle={{
                width: 40,
                height: 40,
            }}
            icon={() => (
                <MaterialIcons
                    name='attachment'
                    size={34}
                    style={{ padding: 4 }}
                />
            )}
            options={{
                'Choose From Gallery': () => {

                    _getPhotoLibrary();

                },
                Camera: () => {
                    _getCamera();
                },
               

            }}
            optionTintColor="#222B45"
        />
    );


    return (
        <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
                _id: user.uid,
            }}
            renderBubble={(props) => {
                return <Bubble
                    {...props}
                    wrapperStyle={{
                        right: {
                            backgroundColor: 'black'
                        },
                        left: {
                            backgroundColor: 'white'
                        }
                    }}
                />
            }}
            renderSend={(props) => {
                return <Send {...props}>
                    <MaterialIcons
                        name='send'
                        size={34}
                        style={{ padding: 4 }}
                    />
                </Send>
            }}
            renderActions={renderActions}
            renderInputToolbar={(props) => {
                return <InputToolbar {...props}
                    containerStyle={{ borderWidth: 0.5, borderColor: '#333', margin: 4, borderRadius: 6, }} />
            }}
        />
    )
}
