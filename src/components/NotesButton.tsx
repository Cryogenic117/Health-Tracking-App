import AsyncStorage from '@react-native-async-storage/async-storage'
import moment from "moment"
import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform } from 'react-native'
import Modal from 'react-native-modal'
import Icon from 'react-native-vector-icons/MaterialIcons'

export default function NotesButton(props): JSX.Element {
    const [isModalVisible, setModalVisibility] = useState(false)
    const [currentNote, setCurrentNote] = useState('')
    const [noteInputText, setNoteInputText] = useState('')

    useEffect(() => {
        if (isModalVisible) {
            getNotesData()
        }
    }, [isModalVisible])

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
        setModalVisibility(true)
    }

    return (
        <View>
            <TouchableOpacity onPress={onNotesButtonPress} style={styles.notesButton}>
                <Icon name="note-add" size={24} color="#5838B4" />
                <Text style={styles.buttonText}>Notes</Text>
            </TouchableOpacity>
            <Modal
                isVisible={isModalVisible}
                onBackdropPress={() => setModalVisibility(false)}
                onSwipeComplete={() => setModalVisibility(false)}
                swipeDirection={['down']}
                style={styles.modal}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.modalContent}
                >
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Notes</Text>
                        <TouchableOpacity onPress={() => setModalVisibility(false)}>
                            <Icon name="close" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>
                    <TextInput
                        style={styles.noteInput}
                        multiline={true}
                        placeholder="Enter your notes here..."
                        value={noteInputText}
                        onChangeText={setNoteInputText}
                    />
                    <TouchableOpacity style={styles.saveButton} onPress={onSave}>
                        <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                    <View style={styles.bottomSpacer} />
                </KeyboardAvoidingView>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    notesButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    buttonText: {
        color: '#5838B4',
        fontSize: 16,
        marginLeft: 5,
    },
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '90%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    noteInput: {
        height: 200,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        textAlignVertical: 'top',
        marginBottom: 20,
    },
    saveButton: {
        backgroundColor: '#5838B4',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    bottomSpacer: {
        height: 40, // Adjust this value to increase or decrease the bottom space
    },
})




