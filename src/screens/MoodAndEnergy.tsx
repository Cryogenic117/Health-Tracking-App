import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Slider from '@react-native-community/slider'
import { Ionicons } from '@expo/vector-icons'
import NotesButton from '../components/NotesButton'
import AsyncStorage from "@react-native-async-storage/async-storage"
import moment from "moment"
import { useTheme } from '../context/ThemeContext'

type IconName = React.ComponentProps<typeof Ionicons>['name']

const emojis: { icon: IconName; label: string; color: string }[] = [
    { icon: 'happy', label: 'Great', color: '#1dbb9e' },
    { icon: 'happy-outline', label: 'Happy', color: '#436a14' },
    { icon: 'sad', label: 'Fine', color: '#236bfb' },
    { icon: 'sad-outline', label: 'Sad', color: '#e18822' },
    { icon: 'sad', label: 'Awful', color: '#fd216a' },
    { icon: 'thunderstorm', label: 'Angry', color: '#fc1d42' }
]

export default function MoodAndEnergy(): JSX.Element {
    const { isDarkMode } = useTheme();
    const [energyIntensity, setEnergyIntensity] = useState(5)
    const [selectedEmojiIndex, setSelectedEmojiIndex] = useState(-1)

    const onSave = async () => {
        if (selectedEmojiIndex === -1) {
            Alert.alert("Error", "Please select a mood before saving.")
            return
        }

        const data0 = emojis[selectedEmojiIndex].label
        const data1 = energyIntensity

        try {
            const key = "moodAndEnergyScreen"
            const date = moment().format("DD/MM/YYYY")
            let hash = await AsyncStorage.getItem(key)

            const newData = [data0, data1, ""]
            const newHash = hash ? JSON.parse(hash) : {}
            newHash[date] = newData

            await AsyncStorage.setItem(key, JSON.stringify(newHash))
            Alert.alert("Success", "Data successfully saved")
        } catch (e) {
            console.error("Error saving mood and energy data:", e)
            Alert.alert("Error", "There was an error saving your data")
        }
    }

    return (
        <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={[styles.title, isDarkMode && styles.titleDark]}>How are you feeling today?</Text>
                <View style={styles.emojiContainer}>
                    {emojis.map((emoji, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.emojiButton,
                                selectedEmojiIndex === index && styles.selectedEmojiButton,
                                isDarkMode && styles.emojiButtonDark
                            ]}
                            onPress={() => setSelectedEmojiIndex(index)}
                        >
                            <Ionicons name={emoji.icon} size={40} color={emoji.color} />
                            <Text style={[styles.emojiLabel, { color: emoji.color }]}>{emoji.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <Text style={[styles.subtitle, isDarkMode && styles.subtitleDark]}>How much energy do you have?</Text>
                <View style={styles.sliderContainer}>
                    <Text style={[styles.sliderValue, isDarkMode && styles.sliderValueDark]}>{energyIntensity}</Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={10}
                        step={1}
                        value={energyIntensity}
                        onValueChange={setEnergyIntensity}
                        minimumTrackTintColor="#5838B4"
                        maximumTrackTintColor={isDarkMode ? "#4D4D4D" : "#D1D1D6"}
                        thumbTintColor="#5838B4"
                    />
                    <View style={styles.sliderLabels}>
                        <Text style={[styles.sliderLabel, isDarkMode && styles.sliderLabelDark]}>Low</Text> 
                        <Text style={[styles.sliderLabel, isDarkMode && styles.sliderLabelDark]}>High</Text>
                    </View>
                </View>
                <NotesButton parentKey='moodAndEnergyScreen' isDarkMode={isDarkMode} />
                <TouchableOpacity style={[styles.saveButton, isDarkMode && styles.saveButtonDark]} onPress={onSave}>
                    <Text style={[styles.saveButtonText, isDarkMode && styles.saveButtonTextDark]}>Save</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    containerDark: {
        backgroundColor: '#1C1C1E',
    },
    scrollContent: {
        flexGrow: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1C1C1E',
        marginBottom: 20,
    },
    titleDark: {
        color: '#FFFFFF',
    },
    emojiContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    emojiButton: {
        alignItems: 'center',
        backgroundColor: '#F2F2F7',
        borderRadius: 12,
        padding: 10,
        width: '30%',
        marginBottom: 10,
    },
    emojiButtonDark: {
        backgroundColor: '#2C2C2E',
    },
    selectedEmojiButton: {
        backgroundColor: '#E8E8ED',
    },
    emojiLabel: {
        marginTop: 5,
        fontSize: 12,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1C1C1E',
        marginBottom: 15,
    },
    subtitleDark: {
        color: '#FFFFFF',
    },
    sliderContainer: {
        marginBottom: 30,
    },
    sliderValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#5838B4',
        textAlign: 'center',
        marginBottom: 10,
    },
    sliderValueDark: {
        color: '#FFFFFF',
    },
    slider: {
        width: '100%',
        height: 40,
    },
    sliderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    sliderLabel: {
        fontSize: 14,
        color: '#8E8E93',
    },
    sliderLabelDark: {
        color: '#FFFFFF',
    },
    saveButton: {
        backgroundColor: '#5838B4',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonDark: {
        backgroundColor: '#FFFFFF',
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    saveButtonTextDark: {
        color: '#1C1C1E',
    },
})
