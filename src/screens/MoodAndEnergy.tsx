import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert, GestureResponderEvent, StyleProp, TextStyle } from 'react-native'
import Slider from '@react-native-community/slider'

const emojis: string[] = ["😭", "😢", "😐", "🙂", "😁", "⚡"]

export default function MoodAndEnergy(): JSX.Element {
    const [isMoodSelected, setIsMoodSelected] = useState(false)
    const [moodIntensity, setMoodIntensity] = useState(0)
    const [energyIntensity, setEnergyIntensity] = useState(0)
    const [selectedEmojiIndex, setSelectedEmojiIndex] = useState(-1)

    return(
        <View style={styles.container}>
            <Text style={{fontSize: 25, fontWeight: 'bold'}}>How are you feeling today?</Text>
            <View style={styles.emojiContainer}>
                {emojis.map((emoji, emojiIndex) => (
                    <TouchableOpacity key={emojiIndex} onPress={() => {
                        setIsMoodSelected(getIsMoodSelected(emojiIndex))
                        setSelectedEmojiIndex(emojiIndex)
                    }}>
                        <Text style={getEmojiStyle(emojiIndex, selectedEmojiIndex)}>{emoji}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <Text style={styles.sliderQuestion}>What is the intensity of this feeling?</Text>
            {isMoodSelected &&
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={10}
                    onValueChange={(value) => setMoodIntensity(value)}
                    step={1}
                    value={moodIntensity}
                    maximumTrackTintColor={"#1f1f1e"}
                    minimumTrackTintColor={"#03fc3d"}
                    thumbTintColor={"#BEB1A4"}
                />
            }
            {!isMoodSelected &&
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={10}
                    onValueChange={(value) => setEnergyIntensity(value)}
                    step={1}
                    value={energyIntensity}
                    maximumTrackTintColor={"#1f1f1e"}
                    minimumTrackTintColor={"#5838B4"}
                    thumbTintColor={"#BEB1A4"}
                />
            }
            <TouchableOpacity
                style={styles.button}
                onPress={() => Alert.alert("Data Saved.")}>
                <Text style={{color: '#ffffff', fontSize: 20}}>Save Data</Text>
            </TouchableOpacity>
        </View>
    )
}

function getIsMoodSelected(emojiIndex: number) {
    var lightningBoltEmojiSelected: boolean

    if (emojiIndex != 5) {
        lightningBoltEmojiSelected = false
    } else {
        lightningBoltEmojiSelected = true
    }

    return lightningBoltEmojiSelected == false
}

function getEmojiStyle(emojiIndex: number, selectedEmojiIndex: number): StyleProp<TextStyle> {
    if (emojiIndex == selectedEmojiIndex) {
        return styles.selectedEmoji
    }
    return styles.unselectedEmoji
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emojiContainer: {
        alignItems: 'center',
        marginTop:5,
        padding: 20,
        flexDirection: "row",
    },
    unselectedEmoji: {
        fontSize: 40, 
        paddingHorizontal: 7,
        textAlign: 'center'
    },
    selectedEmoji: {
        fontSize: 40, 
        paddingHorizontal: 7,
        borderWidth: 2,
        borderColor: '#5838B4',
        borderRadius: 10,
        textAlign: 'center',
        textShadowColor: '#5838B4',
        textShadowRadius: 20
    },
    sliderQuestion: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 16
    },
    button: {
        alignItems: "center",
        backgroundColor: "#262626",
        padding: 10,
        width: 125,
        margin: 20,
        borderRadius: 10
    },
    slider: {
        height: 25,
        width: 325
    }
})
