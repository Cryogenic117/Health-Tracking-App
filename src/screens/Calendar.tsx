import React, { useState } from 'react'
import { StatusBar, SafeAreaView, StyleSheet, Text, ScrollView, Image } from 'react-native'
import { Agenda, CalendarProvider } from 'react-native-calendars'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function Calendar(): JSX.Element {
    var date = new Date()
    const initialDate = date.toISOString().substring(0,10)
    const [currentDateSelected,setCurrentDateSelected] = useState(initialDate)
    return (
        <SafeAreaView style={{marginTop: StatusBar.currentHeight}}>
            <SafeAreaView style={{height: '100%'}}>
                <CalendarProvider date={currentDateSelected}>             
                <Agenda renderList={() => DailyData(currentDateSelected)}
                    onDayPress={day => {   
                        setCurrentDateSelected(day.dateString)
                    }}
                    hideExtraDays={true}
                    theme={{
                        agendaKnobColor: '#5838B4',
                        calendarBackground: 'black',
                        selectedDayBackgroundColor: "#5838B4",
                        monthTextColor: 'white',
                        todayTextColor: '#5838B4',
                        dayTextColor: 'white'
                    }}
                />
                </CalendarProvider> 
            </SafeAreaView>
        </SafeAreaView>
    )
}

async function getMedicationData(medicationID: string) {
    try {
        const jsonValue = await AsyncStorage.getItem(medicationID)
        return jsonValue != null ? JSON.parse(jsonValue) : null
    } catch(e) {
        console.log("There was an error retrieving the medication model: " + e)
    }
  }

function DailyData(day): JSX.Element {
    const monthNames: string[] = [
        "January",
        "February", 
        "March", 
        "April", 
        "May", 
        "June",
        "July", 
        "August", 
        "September", 
        "October", 
        "November", 
        "December"
    ]

    let dayText: string
    if (day.substring(8, 9) != "0") {
        dayText = day.substring(8, 10)
    } else {
        dayText = day.substring(9, 10)
    }

    let dateText: string = monthNames[day.substring(5, 7) - 1] + " " + dayText + ", " + day.substring(0, 4)

    return (
        <SafeAreaView style={{flex: 1}}>
            <Text style={styles.dateHeading}>
                {dateText}
            </Text>
            <ScrollView>
                <SafeAreaView style={styles.dataTitle}>
                    <Image style={styles.imageFormat} source={require('../../assets/SleepNavigationIcon.png')}/>
                    <Text style={styles.titleText}>{"Sleep"}</Text>
                </SafeAreaView>
                <SafeAreaView style={{paddingTop: 10}}>
                    <Text style={styles.otherText}>{"Amount: 3-4 Hours\nQuality: 4/10"}</Text>
                </SafeAreaView>
                <SafeAreaView style={styles.dataTitle}>
                    <Image style={styles.imageFormat} source={require('../../assets/PillNavigationIcon.png')}/>
                    <Text style={styles.titleText}>{"Medications"}</Text>
                </SafeAreaView>
                <SafeAreaView style={{paddingTop: 10}}>
                    <Text style={styles.otherText}>
                        {"Take Metformin 1 time(s) today\nTake Diazepam 2 times(s) today"}
                    </Text>
                </SafeAreaView>                
                <SafeAreaView style={styles.dataTitle}>
                    <Image style={styles.imageFormat} source={require('../../assets/MoodNavigationIcon.png')}/>
                    <Text style={styles.titleText}>{"Mood/Energy"}</Text>
                </SafeAreaView>
                <SafeAreaView style={{paddingTop: 10}}>
                    <Text style={styles.timeTitle}>{"04:59:"}</Text>
                    <Text style={styles.moodText}>{"Mood: Sad\nEnergy: 1/10"}</Text>
                    <Text style={styles.timeTitle}>{"13:32:"}</Text>
                    <Text style={styles.moodText}>{"Mood: Happy\nEnergy: 6/10"}</Text>
                </SafeAreaView>
            </ScrollView>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    dataTitle: {
        backgroundColor:'#5838B4',
        flexDirection: 'row'
    },
    titleText: {
        paddingLeft: 10, 
        fontSize: 24, 
        fontWeight: 'bold',
        color: 'white'
    },
    moodText: {
        fontWeight: 'bold', 
        paddingLeft: 65, 
        color: 'black', 
        fontSize: 20
    },
    imageFormat: {
        width: 30, 
        height: 30
    },
    timeTitle: {
        paddingLeft: 55, 
        fontSize: 20, 
        fontWeight: 'bold', 
        color: '#5838B4', 
        textDecorationLine: 'underline'
    },
    otherText: {
        fontWeight: 'bold', 
        paddingLeft: 55, 
        color: 'black', 
        fontSize: 20
    },
    dateHeading : {
        fontWeight: 'bold', 
        padding: 10, 
        textAlign: 'center', 
        fontSize: 32, 
        color: 'black'
    }
})