import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import Slider from '@react-native-community/slider'

export default function MoodAndEnergy(): JSX.Element {
    const [sliderValue, tempValue] = useState(0)
    const onPress = () => Alert.alert("Data Saved.")
    const emojiPress = () => Alert.alert("Data Saved.")

    return(
        <View style={styles.container}>
            <Text style={styles.header}>How do you feel?</Text>
            <View style={styles.emojiContainer}>
                <TouchableOpacity
                    style={styles.emojiButton}
                    onPress={emojiPress}>
                    <Text style={styles.buttonText}>😭</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.emojiButton}
                    onPress={emojiPress}>
                    <Text style={styles.buttonText}>😢</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.emojiButton}
                    onPress={emojiPress}>
                    <Text style={styles.buttonText}>😐</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.emojiButton}
                    onPress={emojiPress}>
                    <Text style={styles.buttonText}>🙂</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.emojiButton}
                    onPress={emojiPress}>
                    <Text style={styles.buttonText}>😁</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.emojiButton}
                    onPress={emojiPress}>
                    <Text style={styles.buttonText}>⚡</Text>
                </TouchableOpacity>
            </View>
            
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
                    style={styles.button}
                    onPress={onPress}>
                    <Text style={styles.buttonText}>Save Data</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop:100,
        padding: 20,
        flexDirection: "column"
    },
    emojiContainer: {
        alignItems: 'center',
        marginTop:5,
        padding: 20,
        flexDirection: "row",
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
    button: {
        alignItems: "center",
        backgroundColor: "#262626",
        padding: 10,
        width: 125,
        margin: 20,
        borderRadius: 10
    },
    emojiButton: {
        alignItems: "center",
        backgroundColor: "#262626",
        padding: 10,
        width: 45,
        margin: 10,
        borderRadius: 10,
        flexDirection: "row"
    },
    buttonText: {
        color: '#ffffff',
        fontSize:20
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
        width: 325
    }
})
