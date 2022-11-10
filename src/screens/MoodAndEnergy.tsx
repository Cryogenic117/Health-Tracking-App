import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert, StyleProp, TextStyle, Image, ImageStyle} from 'react-native'
import Slider from '@react-native-community/slider'
import NotesButton from '../components/NotesButton' 


export default function MoodAndEnergy(): JSX.Element {
    const [isMoodSelected, setIsMoodSelected] = useState(false)
    const [moodIntensity, setMoodIntensity] = useState(0)
    const [energyIntensity, setEnergyIntensity] = useState(0)
    const [selectedEmojiIndex, setSelectedEmojiIndex] = useState(-1)

    return(
        <View style={styles.container}>
            <Text style={{fontSize: 25, fontWeight: 'bold', marginBottom: 10}}>How are you feeling today?</Text>
        
            <View style={{flexDirection: "row"}}>
                <TouchableOpacity key={0} onPress={() => {
                        setIsMoodSelected(getIsMoodSelected(0))
                        setSelectedEmojiIndex(0)
                    }}>  
                    <View style={getFaceStyle(0, selectedEmojiIndex)}>
                        <Image style={styles.image} key= {0} source={require('../../assets/moodEmojis/great.png')} />
                        <Text style={{color: '#1dbb9e', fontWeight: 'bold', fontSize: 15, textAlign: "center"}}>Great</Text>
                    </View> 
                </TouchableOpacity>
                <TouchableOpacity key={1} onPress={() => {
                        setIsMoodSelected(getIsMoodSelected(1))
                        setSelectedEmojiIndex(1)
                    }}>  
                    <View style={getFaceStyle(1, selectedEmojiIndex)}>
                        <Image style={styles.image} key= {1} source={require('../../assets/moodEmojis/happy.png')} />
                        <Text style={{color: '#436a14', fontWeight: 'bold', fontSize: 15, textAlign: "center"}}>Happy</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity key={2} onPress={() => {
                        setIsMoodSelected(getIsMoodSelected(2))
                        setSelectedEmojiIndex(2)
                    }}>  
                    <View style={getFaceStyle(2, selectedEmojiIndex)}>
                        <Image style={styles.image} key= {2} source={require('../../assets/moodEmojis/fine.png')} />
                        <Text style={{color: '#236bfb', fontWeight: 'bold', fontSize: 15, textAlign: "center"}}>Fine</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{flexDirection: "row"}}>
                <TouchableOpacity key={3} onPress={() => {
                        setIsMoodSelected(getIsMoodSelected(3))
                        setSelectedEmojiIndex(3)
                    }}>  
                    <View style={getFaceStyle(3, selectedEmojiIndex)}>
                        <Image style={styles.image} key= {3} source={require('../../assets/moodEmojis/sad.png')} />
                        <Text style={{color: '#e18822', fontWeight: 'bold', fontSize: 15, textAlign: "center"}}>Sad</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity key={4} onPress={() => {
                        setIsMoodSelected(getIsMoodSelected(4))
                        setSelectedEmojiIndex(4)
                    }}>  
                    <View style={getFaceStyle(4, selectedEmojiIndex)}>
                        <Image style={styles.image} key= {4} source={require('../../assets/moodEmojis/awful.png')} />
                        <Text style={{color: '#fd216a', fontWeight: 'bold', fontSize: 15, textAlign: "center"}}>Awful</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity key={5} onPress={() => {
                        setIsMoodSelected(getIsMoodSelected(5))
                        setSelectedEmojiIndex(5)
                    }}>  
                    <View style={getFaceStyle(5, selectedEmojiIndex)}>
                        <Image style={styles.image} key= {5} source={require('../../assets/moodEmojis/angry.png')} />
                        <Text style={{color: '#fc1d42', fontWeight: 'bold', fontSize: 15, textAlign: "center"}}>Angry</Text>
                    </View>
                </TouchableOpacity>
            </View>
            
            <Text style={styles.sliderQuestion}>How much energy do you have?</Text>
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
                    maximumTrackTintColor={'#1f1f1e'}
                    minimumTrackTintColor={"#5838B4"}
                    thumbTintColor={"#BEB1A4"}
                />
            }
            <NotesButton/>
            <TouchableOpacity
                style={styles.button}
                onPress={() => Alert.alert('Data Saved.')}>
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
        ShadowRadius: 100,
        shadowOpacity: .8,
        shadowOffset: {
            height: 10,
            width: 10
        },
        shadowColor:"#5838B4",
        padding:2
    },
    emojiText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 15,
        textAlign: "center"
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
