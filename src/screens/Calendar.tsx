import React, {useState} from 'react'
import { StatusBar, StyleSheet, Text, View, ScrollView } from 'react-native'
import { Agenda, CalendarProvider } from 'react-native-calendars'

export default function Calendar(): JSX.Element {
    var date = new Date();
    const initialDate = date.toISOString().substr(0,10)
	var currentDateSelected = initialDate
    return (
        <View style={{marginTop: StatusBar.currentHeight}}>
            <View style={{height: '100%'}}>
                <CalendarProvider date={initialDate}>             
                <Agenda renderList={() => DailyData(currentDateSelected)}
                    onDayPress={day => {   
                        currentDateSelected = day.dateString  
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
            </View>
        </View>
    )
}

function DailyData(day): JSX.Element {

    return (
        <View style={{padding: 10}}>
            <Text style={{textAlign: 'center', fontSize: 20}}>Daily Data</Text>
            <View style={styles.lineSeperator}/>
                <ScrollView>
                    {//Display data for Date
                    }
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