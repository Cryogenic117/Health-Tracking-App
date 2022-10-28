import React, {useState} from 'react'
import {StyleSheet, Text, Button, TextInput, View}  from 'react-native'
import Modal from "react-native-modal"

export default function NotesPopUp(): JSX.Element {

    const [isModalVisible, setModalVisibility] = useState(true)

    return(
        <View>
             <Modal isVisible = {isModalVisible}> 
                <View style = {styles.modalContainer} > 
                    <Text style = {styles.title} >Current Note</Text>
                    <TextInput 
                        style = {styles.noteInput}
                        multiline={true}
                    />
                    <View style={styles.buttons}>
                        <View style = {styles.eachButton}>
                            <Button 
                                color = {'#5838B4'}
                                title = 'Cancel'
                                onPress={() => setModalVisibility(false)}                         
                            />
                        </View >
                        <View style = {styles.eachButton}>
                            <Button                         
                                color = {'#5838B4'} 
                                title = 'Save'
                                onPress={() => setModalVisibility(false)}
                            />
                        </View>
                    </View>     
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
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
        alignItems: 'center'
    }
})