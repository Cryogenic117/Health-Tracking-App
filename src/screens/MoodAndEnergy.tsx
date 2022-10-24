import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import { RadioButtonProps, RadioGroup } from 'react-native-radio-buttons-group';
import Slider from '@react-native-community/slider';

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop:100,
        padding: 20,
        flexDirection: "column"
    },
    header:{
        fontSize: 25,
        padding: 20,
        fontWeight: 'bold'
    },
    text: {
        flexDirection: "column",
        fontSize: 25,
        fontWeight: 'bold'

    },
    Button: {
        alignItems: "center",
        backgroundColor: "#262626",
        padding: 10,
        width: 125,
        margin: 20,
        borderRadius: 10
    },
    buttonText: {
        color: '#ffffff'
      },
    buttonStyle:{
        alignItems: 'flex-start',
        padding: 20,
        border: "10px",
        paddingTop: 10,
        flexDirection: "column"
    },
    sliderView: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    sliderText: {
        flexDirection: "column",
        fontSize: 25,
        fontWeight: 'bold',
        paddingBottom: 20
    },
    slider: {
        height: 25,
        width: 325,}});

    const radioButtonsData: RadioButtonProps[]=[
        {
            id: 'btn1',
            label : "😭",
            value: "😭",
            size: 30,
            labelStyle: {fontSize: 30}
        }, 
        {
            id: 'btn2',
            label : "😢",
            value: "😢",
            size: 30,
            labelStyle: {fontSize: 30}
        }, 
        {
            id: 'btn3',
            label : "😐",
            value: "😐",
            size: 30,
            labelStyle: {fontSize: 30}
        }, 
        {
            id: 'btn4',
            label : "🙂",
            value: "🙂",
            size: 30,
            labelStyle: {fontSize: 30}
        }, 
        {
            id: 'btn5',
            label : "😁",
            value: "😁",
            size: 30,
            labelStyle: {fontSize: 30}
        }, 
    ]
    
    export default function MoodAndEnergy(): JSX.Element {
        const [radioButtons, setRadioButtons] = useState<RadioButtonProps[]>(radioButtonsData);
        const [sliderValue, tempValue] = useState(0)
        const onPress = () => Alert.alert("Data Saved.")

        return(
            <View style={styles.container}>
                <Text style={styles.header}>How is your mood?</Text>

                <RadioGroup
                containerStyle={styles.buttonStyle}
                radioButtons={radioButtons}
                ></RadioGroup>
                <Text style={styles.sliderText}>{"\n"}How much energy do you have?</Text>

                <View style={styles.sliderView}>
                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={10}
                        onValueChange={(value)=>tempValue(value)}
                        step={1}
                        value={sliderValue}
                        maximumTrackTintColor={"#1f1f1e"}
                        minimumTrackTintColor={"#828180"}
                        thumbTintColor={"#BEB1A4"}
                    />
                    <Text style={styles.text}>{sliderValue}</Text>
                </View>
                <View>
                    <TouchableOpacity
                    style={styles.Button}
                    onPress={onPress}>
                    <Text style={styles.buttonText}>Save Data</Text>
            </TouchableOpacity></View>

            </View>
        )
    }
