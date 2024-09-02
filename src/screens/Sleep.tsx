import React, { useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Alert, SafeAreaView, ScrollView, StatusBar } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Slider from '@react-native-community/slider'
import moment from "moment"
import { Ionicons } from '@expo/vector-icons'
import NotesButton from '../components/NotesButton'
import { useTheme } from '../context/ThemeContext'

const sleepOptions = [
    { label: "Very Little (3 hours or less)", value: "Very Little (3 hours or less)", icon: "moon-outline" },
    { label: "Some (4 to 5 hours)", value: "Some (4 to 5 hours)", icon: "moon" },
    { label: "A Good Amount (6 to 7 hours)", value: "A Good Amount (6 to 7 hours)", icon: "moon" },
    { label: "A lot (8 to 9 hours)", value: "A lot (8 to 9 hours)", icon: "moon" },
    { label: "Excessive (Over 9 hours)", value: "Excessive (Over 9 hours)", icon: "moon" }
]

export default function Sleep(): JSX.Element {
    const { isDarkMode } = useTheme();
    const [selectedSleep, setSelectedSleep] = useState<string | null>(null)
    const [sleepQuality, setSleepQuality] = useState(5)

    const onPress = async () => {
        if (!selectedSleep) {
            Alert.alert("Error", "Please select your sleep duration")
            return
        }

        try {
            const key = "sleepScreen"
            const date = moment().format("DD/MM/YYYY")
            let hash = await AsyncStorage.getItem(key)

            const newData = [selectedSleep, sleepQuality, ""]
            const newHash = hash ? JSON.parse(hash) : {}
            newHash[date] = newData

            await AsyncStorage.setItem(key, JSON.stringify(newHash))
            Alert.alert("Success", "Sleep data successfully saved")
        } catch (e) {
            console.error("Error saving sleep data:", e)
            Alert.alert("Error", "There was an error saving your sleep data")
        }
    }

    return (
        <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={[styles.title, isDarkMode && styles.titleDark]}>How much did you sleep today?</Text>
                <View style={styles.sleepOptionsContainer}>
                    {sleepOptions.map((option, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.sleepOption,
                                isDarkMode && styles.sleepOptionDark,
                                selectedSleep === option.value && styles.selectedSleepOption
                            ]}
                            onPress={() => setSelectedSleep(option.value)}
                        >
                            <Ionicons 
                                name={option.icon as any} 
                                size={24} 
                                color={selectedSleep === option.value ? "#FFFFFF" : (isDarkMode ? "#FFFFFF" : "#5838B4")} 
                            />
                            <Text style={[
                                styles.sleepOptionText,
                                isDarkMode && styles.sleepOptionTextDark,
                                selectedSleep === option.value && styles.selectedSleepOptionText
                            ]}>
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={[styles.subtitle, isDarkMode && styles.subtitleDark]}>How was your sleep quality?</Text>
                <View style={styles.sliderContainer}>
                    <Text style={[styles.sliderValue, isDarkMode && styles.sliderValueDark]}>{sleepQuality}</Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={1}
                        maximumValue={10}
                        step={1}
                        value={sleepQuality}
                        onValueChange={setSleepQuality}
                        minimumTrackTintColor="#5838B4"
                        maximumTrackTintColor={isDarkMode ? "#4D4D4D" : "#D1D1D6"}
                        thumbTintColor="#5838B4"
                    />
                    <View style={styles.sliderLabels}>
                        <Text style={[styles.sliderLabel, isDarkMode && styles.sliderLabelDark]}>Poor</Text>
                        <Text style={[styles.sliderLabel, isDarkMode && styles.sliderLabelDark]}>Excellent</Text>
                    </View>
                </View>

                <NotesButton parentKey='sleepScreen' isDarkMode={isDarkMode} />

                <TouchableOpacity style={[styles.saveButton, isDarkMode && styles.saveButtonDark]} onPress={onPress}>
                    <Text style={[styles.saveButtonText, isDarkMode && styles.saveButtonTextDark]}>Save Data</Text>
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
    sleepOptionsContainer: {
        marginBottom: 30,
    },
    sleepOption: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F2F2F7',
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
    },
    sleepOptionDark: {
        backgroundColor: '#2C2C2E',
    },
    selectedSleepOption: {
        backgroundColor: '#5838B4',
    },
    sleepOptionText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#1C1C1E',
    },
    sleepOptionTextDark: {
        color: '#FFFFFF',
    },
    selectedSleepOptionText: {
        color: '#FFFFFF',
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
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonDark: {
        backgroundColor: '#FFFFFF',
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    saveButtonTextDark: {
        color: '#1C1C1E',
    },
})
