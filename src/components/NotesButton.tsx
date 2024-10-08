import AsyncStorage from '@react-native-async-storage/async-storage'
import moment from "moment"
import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform } from 'react-native'
import Modal from 'react-native-modal'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useTheme } from '../context/ThemeContext'

interface NotesButtonProps {
    parentKey: string;
    isDarkMode: boolean;
    medicationID?: string; // Add this line
}

export default function NotesButton({ parentKey, isDarkMode, medicationID }: NotesButtonProps): JSX.Element {
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
            let parentHash: string = await AsyncStorage.getItem(parentKey)
            let todaysDate: string = moment().format("DD/MM/YYYY")

            if (parentKey == 'sleepScreen' || 'moodAndEnergyScreen') {
                if (parentHash == null) {
                    let newParentHash: Object = {
                        todaysDate: [null, null, newNoteText]
                    }
                    let newEntry: string = JSON.stringify(newParentHash)
                    await AsyncStorage.setItem(parentKey, newEntry)
                } else {
                    let parsedParentHash: Object = JSON.parse(parentHash)
                    if (parsedParentHash[todaysDate] != null) {
                        parsedParentHash[todaysDate] = [
                            parsedParentHash[todaysDate][0],
                            parsedParentHash[todaysDate][1],
                            newNoteText
                        ]
                        let newEntry: string = JSON.stringify(parsedParentHash)
                        await AsyncStorage.setItem(parentKey, newEntry)
                    } else {
                        parsedParentHash[todaysDate] = [null, null, newNoteText]
                        let newEntry: string = JSON.stringify(parsedParentHash)
                        await AsyncStorage.setItem(parentKey, newEntry)
                    }
                }
            } else if (parentKey == 'medicationScreen') {
                if (parentHash == null) {
                    throw new Error("We are trying to save a note for a medication that doesn't exist... WHAT?!")
                } else {
                    let parsedParentHash: Object = JSON.parse(parentHash)
                    if (parsedParentHash[medicationID] != null) {
                        let parsedMedication: MedicationModel = JSON.parse(parsedParentHash[medicationID])
                        parsedMedication['notes'] = newNoteText
                        let newMedicationHash: string = JSON.stringify(parsedMedication)
                        parsedParentHash[medicationID] = newMedicationHash
                        let newEntry: string = JSON.stringify(parsedParentHash)
                        await AsyncStorage.setItem(parentKey, newEntry)
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
            let parentHash: string = await AsyncStorage.getItem(parentKey)

            if (parentHash != null) {
                let parsedParentHash: Object = JSON.parse(parentHash)
                if (parentKey == 'sleepScreen' || 'moodAndEnergyScreen') {
                    let dataEntry: [] = parsedParentHash[todaysDate]
                    if (dataEntry != null) {
                        let note: string = dataEntry[dataEntry.length - 1]
                        if (note != null) {
                            setCurrentNote(note)
                        }
                    }
                } else if (parentKey == 'medicationScreen') {
                    if (parsedParentHash[medicationID] != null) {
                        let parsedMedication: MedicationModel = JSON.parse(parsedParentHash[medicationID])
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
            <TouchableOpacity onPress={onNotesButtonPress} style={[styles.notesButton, isDarkMode && styles.notesButtonDark]}>
                <Icon name="note-add" size={24} color={isDarkMode ? "#FFFFFF" : "#5838B4"} />
                <Text style={[styles.buttonText, isDarkMode && styles.buttonTextDark]}>Notes</Text>
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
                    style={[styles.modalContent, isDarkMode && styles.modalContentDark]}
                >
                    <View style={styles.modalHeader}>
                        <Text style={[styles.modalTitle, isDarkMode && styles.modalTitleDark]}>Notes</Text>
                        <TouchableOpacity onPress={() => setModalVisibility(false)}>
                            <Icon name="close" size={24} color={isDarkMode ? "#FFFFFF" : "#333"} />
                        </TouchableOpacity>
                    </View>
                    <TextInput
                        style={[styles.noteInput, isDarkMode && styles.noteInputDark]}
                        multiline={true}
                        placeholder="Enter your notes here..."
                        placeholderTextColor={isDarkMode ? "#888" : "#999"}
                        value={noteInputText}
                        onChangeText={setNoteInputText}
                    />
                    <TouchableOpacity style={[styles.saveButton, isDarkMode && styles.saveButtonDark]} onPress={onSave}>
                        <Text style={[styles.saveButtonText, isDarkMode && styles.saveButtonTextDark]}>Save</Text>
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
    notesButtonDark: {
        backgroundColor: '#2C2C2E',
    },
    buttonText: {
        color: '#5838B4',
        fontSize: 16,
        marginLeft: 5,
    },
    buttonTextDark: {
        color: '#FFFFFF',
    },
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '90%',
    },
    modalContentDark: {
        backgroundColor: '#1C1C1E',
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
    modalTitleDark: {
        color: '#FFFFFF',
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
        color: '#000000',
    },
    noteInputDark: {
        borderColor: '#2C2C2E',
        color: '#FFFFFF',
    },
    saveButton: {
        backgroundColor: '#5838B4',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonDark: {
        backgroundColor: '#FFFFFF',
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    saveButtonTextDark: {
        color: '#1C1C1E',
    },
    bottomSpacer: {
        height: 40, // Adjust this value to increase or decrease the bottom space
    },
})




