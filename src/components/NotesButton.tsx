import React, {useState} from 'react' 
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import Modal from 'react-native-modal'
import NotesPopUp from './NotesPopUp'

export default function NotesButton(): JSX.Element {

    const [isModalVisible, setModalVisibility] = useState(false)

    return (
        <TouchableOpacity onPress = {() => setModalVisibility(true)}>
            <Text style={styles.buttonText}>+ Notes </Text>    
            <Modal isVisible = {isModalVisible}>
                <NotesPopUp/>
            </Modal>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    buttonText: {
        color: '#328FE5',
        fontSize: 15,
        fontStyle: 'italic'
    }
})




