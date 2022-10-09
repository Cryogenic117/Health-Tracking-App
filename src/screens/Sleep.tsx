import React from 'react';
import {View, Text, StyleSheet, Button, TouchableOpacity, Alert,} from 'react-native';
import Slider from '@react-native-community/slider'
import {useState} from "react";

// todo:AKEEN make sliderValue text input
// todo:AKEEN send sliderValue to calendar screen on button press
// todo:AKEEN add loggin info
export default function Sleep(): JSX.Element {
    const [sliderValue, tempValue] = useState(0)
    const onPress = () => Alert.alert("Data Saved.");

    return (
        <View style={styles.sleepScreenView}>
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
                <View style={styles.sliderText}>
                    <Text style={styles.text}>How was your sleep quality (1-10): </Text>
                    <Text style={styles.text}>{sliderValue}</Text>
                </View>
            </View>
            <TouchableOpacity
                style={styles.Button}
                onPress={onPress}>
                <Text style={styles.buttonText}>Save Data</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    //todo:AKEEN make a global stylesheet with sizing,text color,font,etc. - confer w/ team
    text:{
        color:'black',
        fontSize:15
    },
    buttonText:{
      color:'#ffffff'
    },
    Button:{
        alignItems: "center",
        backgroundColor: "#262626",
        padding: 10,
        width:125,
        margin:20,
        borderRadius:10
    },
    blackBar:{
        backgroundColor:'black',
        height:2,
        width:225,
        margin:50
    },
    sleepScreenView:{
        height:'100%',
        width:'100%',
        justifyContent:'center',
        alignItems:'center'
    },
    sliderView:{
        justifyContent:'center',
        alignItems:'center'
    },
    sliderText:{
        flexDirection:"row",
        justifyContent:"space-between",
        width:260
    },
    slider:{
        height:25,
        width:325,
    }
})