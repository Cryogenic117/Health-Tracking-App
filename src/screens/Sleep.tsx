import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import Slider from '@react-native-community/slider'
import { useState } from "react"
import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group'
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from "moment";

const radioButtonsData: RadioButtonProps[] = [{
    id: 'btn1',
    label: "Very Little (3 hours or less)",
    value: "Very Little (3 hours or less)",
    size: 30,
    labelStyle: {color: '#B71C1C', fontSize: 20, fontWeight: 'bold'}
}, 
{
    id: 'btn2',
    label: "Some (4 to 5 hours)",
    value: "Some (4 to 5 hours)",
    size: 30,
    containerStyle: {marginTop: 20},
    labelStyle: {color: '#FFC107', fontSize: 20, fontWeight: 'bold'}
},   
{
    id: 'btn3',
    label: "A Good Amount (6 to 7 hours)",
    value: "A Good Amount (6 to 7 hours)",
    size: 30,
    containerStyle: {marginTop: 20},
    labelStyle: {color: '#43A047', fontSize: 20, fontWeight: 'bold'}
},
{
    id: 'btn4',
    label: "A lot (7 to 9 hours)",
    value: "A lot (7 to 9 hours)",
    size: 30,
    containerStyle: {marginTop: 20},
    labelStyle: {color: '#1B5E20', fontSize: 20, fontWeight: 'bold'}
},
{
    id: 'btn5',
    label: "Excessive (Over 9 hours)",
    value: "Excessive (Over 9 hours)",
    size: 30,
    containerStyle: {marginTop: 20},
    labelStyle: {color: '#FFC107', fontSize: 20, fontWeight: 'bold'}
}]

let selectedButton
let data = []
export default function Sleep(): JSX.Element {
    const [sliderValue, tempValue] = useState(1)
    const onPress = async () => {
        data[0] = selectedButton
        data[1] = sliderValue
        console.log("Sleep Screen: Attempting to save data " + data[0] + " " + data[1])
        if (data[0] != null && data[1] != null) {
            try {
                const key = moment().format("DD/MM/YYYY")
                const entry = JSON.stringify(data)
                console.log("Sleep Screen: Setting key, value as " + key + " " + entry)
                await AsyncStorage.setItem(key, entry)
                console.log("Sleep Screen: Save Successful")
                Alert.alert("Data successfully saved for " + key)
            } catch (e) {
                Alert.alert("There was an error saving")
                console.log("Sleep Screen: Save failed - error: "+e)
            }
        }
    }
    const [radioButtons, setRadioButtons] = useState<RadioButtonProps[]>(radioButtonsData)
    function onPressRadioButton(radioButtonsArray: RadioButtonProps[]) {
        setRadioButtons(radioButtonsArray)
        radioButtonsArray.forEach(
            function(button){
                if(button.selected == true)
                {
                   selectedButton = button.id
                   return selectedButton
                }
            }
        )
    }

    return (
        <View style={styles.sleepScreenView}>
            <Text style = {styles.question}>How much did you sleep today?</Text>
            <RadioGroup
                containerStyle={styles.buttons}
                radioButtons = {radioButtons}
                onPress = {onPressRadioButton}
            />
            <View style={styles.sliderText}>
                <Text style={styles.text}>How was your sleep quality? (1-10): </Text>
                <Text style={styles.text}>{sliderValue}</Text>
            </View>
            <View style={styles.sliderView}>
                <Slider
                    style={styles.slider}
                    minimumValue={1}
                    maximumValue={10}
                    onValueChange={(value)=>tempValue(value)}
                    step={1}
                    value={sliderValue}
                    maximumTrackTintColor={"#1f1f1e"}
                    minimumTrackTintColor={"#828180"}
                    thumbTintColor={"#BEB1A4"}
                />
            </View>
            <TouchableOpacity
                style={styles.Button}
                onPress={onPress}>
                <Text style={styles.buttonText}>Save Data</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    //todo:AKEEN make a global stylesheet with sizing,text color,font,etc. - confer w/ team
    text: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 16
    },
    buttonText: {
      color: '#ffffff'
    },
    Button: {
        alignItems: "center",
        backgroundColor: "#262626",
        padding: 10,
        width: 125,
        margin: 20,
        borderRadius: 10
    },
    blackBar: {
        backgroundColor: 'black',
        height: 2,
        width: 225, 
        margin: 50
    },
    sleepScreenView: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    sliderView: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    sliderText: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: 260
    },
    slider: {
        height: 25,
        width: 325,
    },
    question: {
        fontSize: 25,
        padding: 20,
        fontWeight: 'bold'
    },
    buttons: {
        alignItems: 'flex-start',
        padding: 20,
        border: "10px",
        paddingTop: 10
    }
})
