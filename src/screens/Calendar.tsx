import React from 'react'
import { StatusBar, StyleSheet, Text, View, ScrollView } from 'react-native'
import { Agenda } from 'react-native-calendars'

export default function Calendar(): JSX.Element {
    var currentDateSelected = "2022-11-04"

    return (
        <View style={{marginTop: StatusBar.currentHeight}}>
            <View style={{height: '100%'}}>                
                <Agenda renderList={() => DailyData(currentDateSelected)}
                    onDayPress={day => {
                            console.log('day pressed',day.dateString)
                            currentDateSelected = day.dateString
                    }}
                      theme={{
                        agendaKnobColor: '#5838B4',
                        calendarBackground: 'black',
                        selectedDayBackgroundColor: "#5838B4",
                        todayTextColor: '#5838B4'
                      }}
                />
            </View>
        </View>
    )
}
// const Data1 = {
//     // Loaded daily
//     medications: ["Diazepam (Valium)", "Metformin (Riomet)", "Mutli-Vitamins", "Iron Supplement"],
//     medicationNotes: ["Used to treat Anxiety, muscle spasms, and seizures.", "It can treat type 2 diabetes.", "Good for staying healthy", "For people with iron deficiency"],
//     sleepDuration: 8,
//     sleepQuality: 10,
//     mood: ["Happy","Energy"],
//     moodLevel: [10,6]
// }
// const Data2 = {
//     medications: ["Empty"],
//     medicationNotes: ["Used to treat Anxiety, muscle spasms, and seizures.", "It can treat type 2 diabetes.", "Good for staying healthy", "For people with iron deficiency"],
//     sleepDuration: 8,
//     sleepQuality: 10,
//     mood: ["Happy","Energy"],
//     moodLevel: [10,6]
// }
// const Storage = {
//     "2022-11-04": Data2,
//     "2022-11-05": Data1
// }


function DailyData(day): JSX.Element {

    return (
        <View style={{padding: 10}}>
            <Text style={{textAlign: 'center', fontSize: 20}}>Daily Data</Text>
            <View style={styles.lineSeperator}/>
                <ScrollView>
                    {
                    Storage[day] != undefined &&
                    Storage[day].medications.map((medName, index) => (
                        <View key={index}>
                            <Text key={medName} style={{textAlign: 'left', fontSize: 12, paddingBottom: 5}}>Take {medName}</Text>
                        </View>
                    ))}
                </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    lineSeperator: {
        borderBottomColor: "black", 
        borderBottomWidth: 1, 
        width: '100%',
        paddingTop: 10
    }
})