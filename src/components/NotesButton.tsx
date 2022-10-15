import React from 'react'
import {Button, View, StyleSheet, Text, TouchableOpacity} from 'react-native'
export default function NotesButton(): JSX.Element {
    return (
        <View>
            <TouchableOpacity onPress = {()=>{}} style={styles.button}>
                <Text style={styles.buttonText}>+Notes</Text>
            </TouchableOpacity> 
        </View>
    );
}
const styles=StyleSheet.create({
    button: {
        
    },

    buttonText: {
        color: '#328FE5',
        fontSize: 15,
        fontStyle: 'italic'
    }
}
);