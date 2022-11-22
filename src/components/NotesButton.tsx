import AsyncStorage from '@react-native-async-storage/async-storage'
import moment from "moment"
import React, { useState } from 'react'
import { Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Modal from 'react-native-modal'

export default function NotesButton(props): JSX.Element {
    const [isModalVisible, setModalVisibility] = useState(false)
    const [currentNote, setCurrentNote] = useState('')
    const [noteInputText, setNoteInputText] = useState(currentNote)

    const onSave = () => {
        storeNotesData(noteInputText)
        setModalVisibility(false)
    }

    const storeNotesData = async (newNoteText: string) => {
        try {
            let parentHash: string = await AsyncStorage.getItem(props.parentKey)
            let todaysDate: string = moment().format("DD/MM/YYYY")

            if (props.parentKey == 'sleepScreen' || 'moodAndEnergyScreen') {
                if (parentHash == null) {
                    let newParentHash: Object = {
                        todaysDate: [null, null, newNoteText]
                    }
                    let newEntry: string = JSON.stringify(newParentHash)
                    await AsyncStorage.setItem(props.parentKey, newEntry)
                } else {
                    let parsedParentHash: Object = JSON.parse(parentHash)
                    if (parsedParentHash[todaysDate] != null) {
                        parsedParentHash[todaysDate] = [
                            parsedParentHash[todaysDate][0],
                            parsedParentHash[todaysDate][1],
                            newNoteText
                        ]
                        let newEntry: string = JSON.stringify(parsedParentHash)
                        await AsyncStorage.setItem(props.parentKey, newEntry)
                    } else {
                        parsedParentHash[todaysDate] = [null, null, newNoteText]
                        let newEntry: string = JSON.stringify(parsedParentHash)
                        await AsyncStorage.setItem(props.parentKey, newEntry)
                    }
                }
            } else if (props.parentKey == 'medicationScreen') {
                if (parentHash == null) {
                    throw new Error("We are trying to save a note for a medication that doesn't exist... WHAT?!")
                } else {
                    let parsedParentHash: Object = JSON.parse(parentHash)
                    if (parsedParentHash[props.medicationID] != null) {
                        let parsedMedication: MedicationModel = JSON.parse(parsedParentHash[props.medicationID])
                        parsedMedication['notes'] = newNoteText
                        let newMedicationHash: string = JSON.stringify(parsedMedication)
                        parsedParentHash[props.medicationID] = newMedicationHash
                        let newEntry: string = JSON.stringify(parsedParentHash)
                        await AsyncStorage.setItem(props.parentKey, newEntry)
                    } else {
                        throw new Error("The medication ID is invalid. Aborting saving note.")
                    }
                }
            } else {
                throw new Error("An illegal parent key was passed to the Notes Button prop.")
            }
        } catch (e) {
            console.log(`There was an error saving the note: ${e}`)
        }
    }

    const getNotesData = async () => {
        try {
            let todaysDate: string = moment().format("DD/MM/YYYY")
            let parentHash: string = await AsyncStorage.getItem(props.parentKey)

            if (parentHash != null) {
                let parsedParentHash: Object = JSON.parse(parentHash)
                if (props.parentKey == 'sleepScreen' || 'moodAndEnergyScreen') {
                    let dataEntry: [] = parsedParentHash[todaysDate]
                    if (dataEntry != null) {
                        let note: string = dataEntry[dataEntry.length - 1]
                        if (note != null) {
                            setCurrentNote(note)
                        }
                    }
                } else if (props.parentKey == 'medicationScreen') {
                    if (parsedParentHash[props.medicationID] != null) {
                        let parsedMedication: MedicationModel = JSON.parse(parsedParentHash[props.medicationID])
                        let note: string = parsedMedication['notes']
                        if (note != null) {
                            setCurrentNote(note)
                        }
                    } else {
                        throw new Error("The medication ID is invalid. Aborting getting note.")
                    }
                } else {
                    throw new Error("An illegal parent key was passed to the Notes Button prop.")
                }
            }
        } catch (e) {
            console.log(`There was an error getting the note: ${e}`)
        }
    }

    const onNotesButtonPress = () => {
        getNotesData()
        setModalVisibility(true)
    }

    return (
        <TouchableOpacity onPress={() => onNotesButtonPress()}>
            <Text style={styles.buttonText}>{'+ Notes'}</Text>
            <Modal isVisible={isModalVisible}>
                <View style={styles.modalContainer} >
                    <Text style={styles.title}>{'Notes'}</Text>
                    <View style={{ borderWidth: 1, flex: 1 }}>
                        <ScrollView>
                            <TextInput
                                style={styles.noteInput}
                                multiline={true}
                                selectionColor={'#5838B4'}
                                onChangeText={(text) => { setNoteInputText(text) }}
                                value={noteInputText}
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
                                onPress={() => onSave()}
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
    noteInput: {
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
    buttons: {
        flex: 0.01,
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
        minHeight: 50
    }
})




