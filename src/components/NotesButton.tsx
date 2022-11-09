import React, {useState} from 'react' 
import {StyleSheet, Text, TouchableOpacity, View, Button, TextInput, KeyboardAvoidingView, ScrollView} from 'react-native'
import Modal from 'react-native-modal'

export default function NotesButton(): JSX.Element {

    const [isModalVisible, setModalVisibility] = useState(false)    

    return (
        <TouchableOpacity onPress = {() => setModalVisibility(true)}>
            <Text style = {styles.buttonText}>+ Notes </Text>    
            <Modal isVisible = {isModalVisible}>
                <KeyboardAvoidingView style = {{flex: 1}} behavior = "padding">
                    <View style = {styles.modalContainer} > 
                            <Text style = {styles.title}>Current Note</Text>  
                            <ScrollView>                      
                                <TextInput 
                                    style = {styles.noteInput}
                                    multiline = {true}
                                    selectionColor = {'#5838B4'}
                                />
                            </ScrollView>
                        <View style = {styles.buttons}>
                            <View style = {styles.eachButton}>
                                <Button 
                                    color = {'#5838B4'}
                                    title = 'Cancel'
                                    onPress = {() => setModalVisibility(false)}                         
                                />
                            </View>
                            <View style = {styles.eachButton}>
                                <Button                         
                                    color = {'#5838B4'} 
                                    title = 'Save'
                                    onPress = {() => setModalVisibility(false)}
                                />
                            </View>
                        </View>     
                    </View>
                </KeyboardAvoidingView>
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
        padding: 20, 
        borderRadius: 10, 
        justifyContent: 'space-between'
    },
    noteInput:{
        backgroundColor: 'lightgrey',
        height: 550,
        fontSize: 20,
        fontWeight: 'bold',
        textAlignVertical: 'top'
    },
    title: {
        fontSize: 23,
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'white'
    },
    eachButton: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 10
    },
    buttons:{
        flex: 0.75,
        flexDirection: 'row',
        alignItems: 'center',
        bottom: 80,
        position: 'relative'
    }
})




