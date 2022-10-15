import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'

export default function NotesButton(): JSX.Element {
    return (
        <TouchableOpacity>
            <Text style={styles.buttonText}>+ Notes</Text>
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