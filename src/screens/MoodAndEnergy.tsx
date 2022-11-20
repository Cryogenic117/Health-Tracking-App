import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert, StyleProp, TextStyle, Image, ImageStyle } from 'react-native'
import Slider from '@react-native-community/slider'
import NotesButton from '../components/NotesButton' 

export default function MoodAndEnergy(): JSX.Element {
    const [energyIntensity, setEnergyIntensity] = useState(0)
    const [selectedEmojiIndex, setSelectedEmojiIndex] = useState(-1)

    const emojis = [
        { source: require('../../assets/moodEmojis/great.png'), label: 'Great', color: '#1dbb9e' }, 
        { source: require('../../assets/moodEmojis/happy.png'), label: 'Happy', color: '#436a14' }, 
        { source: require('../../assets/moodEmojis/fine.png'), label: 'Fine', color: '#236bfb' }, 
        { source: require('../../assets/moodEmojis/sad.png'), label: 'Sad', color: '#e18822' }, 
        { source: require('../../assets/moodEmojis/awful.png'), label: 'Awful', color: '#fd216a' }, 
        { source: require('../../assets/moodEmojis/angry.png'), label: 'Angry', color: '#fc1d42' }
    ]

    return (
        <View style={styles.container}>
            <Text style={{fontSize: 25, fontWeight: 'bold', marginBottom: 10}}>{"How are you feeling today?"}</Text>
            <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginHorizontal: 10}}>
                {emojis.map((emoji, index) => (
                    <TouchableOpacity key={index} onPress={() => setSelectedEmojiIndex(index)}>  
                        <View style={getFaceStyle(index, selectedEmojiIndex)}>
                            <Image style={styles.image} source={emoji.source} />
                            <Text style={{color: emoji.color, fontWeight: 'bold', fontSize: 15, textAlign: "center"}}>{emoji.label}</Text>
                        </View> 
                    </TouchableOpacity>
                ))}
            </View>           
            <Text style={styles.sliderQuestion}>{"How much energy do you have?"}</Text>
            <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={10}
                onValueChange={(value) => setEnergyIntensity(value)}
                step={1}
                value={energyIntensity}
                maximumTrackTintColor={'#1f1f1e'}
                minimumTrackTintColor={"#5838B4"}
                thumbTintColor={"#BEB1A4"}
            />
            <NotesButton/>
            <TouchableOpacity style={styles.button} onPress={() => Alert.alert('Data Saved.')}>
                <Text style={{color: '#ffffff', fontSize: 20}}>{"Save Data"}</Text>
            </TouchableOpacity>
        </View>
    )
}

function getFaceStyle(emojiIndex: number, selectedEmojiIndex: number): StyleProp<ImageStyle> {
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
    unselectedEmoji: {
        marginHorizontal: 10,
        marginVertical: 10,
        borderWidth: 3,
        borderColor: '#f2f2f2',
        borderRadius: 10,
        padding:2
    },
    selectedEmoji: { 
        marginHorizontal: 10,
        marginVertical: 10,
        borderWidth: 3,
        borderColor: '#5838B4',
        borderRadius: 10,
        padding:2
    },
    sliderQuestion: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 25,
        marginTop:35,
        marginBottom:10
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#262626',
        padding: 10,
        width: 125,
        margin: 20,
        borderRadius: 10
    },
    slider: {
        height: 25,
        width: 325
    },
    image: {
        width: 75,
        height:75,
        margin: 10
    }
})
