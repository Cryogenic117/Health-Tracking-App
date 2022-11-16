import React, {useState} from 'react' 
import {StyleSheet, Text, TouchableOpacity, View, Button, TextInput, ScrollView } from 'react-native'
import Modal from 'react-native-modal'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function NotesButton(props): JSX.Element {
    const [isModalVisible, setModalVisibility] = useState(false)
    
    let medicationID: string = props.feature == 'medication' ? props.medicationID : null
    let inputText: string = ''

    const onSave = () => {
        const newNote: NotesModel = medicationID == null ? {
            text: inputText,
            feature: props.feature
        } : {
            text: inputText,
            feature: props.feature,
            medicationID
        }

        storeNotesData(newNote)
        setModalVisibility(false)
    }
    
    const storeNotesData = async (newNote: NotesModel) => {
        try {
            const jsonValue = JSON.stringify(newNote)
            await AsyncStorage.setItem(`notes`, jsonValue)
        } catch (e) {
            console.log(`There was an error saving the note: ${e}`)
        }
    }

    return (
        <TouchableOpacity onPress={() => setModalVisibility(true)}>
            <Text style={styles.buttonText}>{'+ Notes'}</Text>    
            <Modal isVisible={isModalVisible}>
                <View style={styles.modalContainer} > 
                        <Text style={styles.title}>{'Notes'}</Text>  
                        <View style={{borderWidth: 1, flex: 1}}>
                            <ScrollView>                      
                                <TextInput 
                                    style={styles.noteInput}
                                    multiline={true}
                                    selectionColor={'#5838B4'}
                                    onChangeText={(newText) => { inputText = newText }}
                                    placeholder='hi'
                                />
                            </ScrollView>
                        </View> 
                    <View style={styles.buttons}>
                        <View style={styles.eachButton}>
                            <Button 
                                color={'#5838B4'}
                                title='Cancel'
                                onPress={() => setModalVisibility(false)}                         
                            />
                        </View>
                        <View style={styles.eachButton}>
                            <Button                         
                                color={'#5838B4'} 
                                title='Save'
                                onPress={() => onSave}
                            />
                        </View>
                    </View>     
                </View>
            </Modal>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    buttonText: {
        color: '#328FE5',
        fontSize: 15,
        fontStyle: 'italic'
    },
    modalContainer: {
        flex: 1, 
        backgroundColor: 'black', 
        padding: 15, 
        borderRadius: 10, 
        justifyContent: 'space-between'
    },
    noteInput:{
        backgroundColor: 'white',
        height: 550,
        fontSize: 16,
        textAlignVertical: 'top'
    },
    title: {
        fontSize: 23,
        textAlign: 'center',
        color: 'white'
    },
    eachButton: {
        flex: 1,
        justifyContent: 'space-between',
        marginHorizontal: 10
    },
    buttons:{
        flex: 0.01,
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
        minHeight: 50
    }
})




