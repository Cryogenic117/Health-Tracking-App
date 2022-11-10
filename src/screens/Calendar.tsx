import React, {useState} from 'react'
import { StatusBar, StyleSheet, Text, View, ScrollView, Image} from 'react-native'
import { Agenda, CalendarProvider } from 'react-native-calendars'

export default function Calendar(): JSX.Element {
    var date = new Date()
    const initialDate = date.toISOString().substring(0,10)
    const [currentDateSelected,setCurrentDateSelected] = useState(initialDate)
    return (
        <View style={{marginTop: StatusBar.currentHeight}}>
            <View style={{height: '100%'}}>
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
            </View>
        </View>
    )
}

function DailyData(day): JSX.Element {
    var dayText
    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"]

    if(day.substring(8,9) != "0") {
        dayText = day.substring(8,10)
    }
    else dayText = day.substring(9,10)

    var dateText = monthNames[day.substring(5,7)-1] + " " + dayText + ", " + day.substring(0,4)

    return (
        <View style={{flex: 1}}>
            <Text style={styles.dateHeading}>
                {dateText}
            </Text>
            <ScrollView>
                <View style={styles.dataTitle}>
                    <Image style={styles.imageFormat} source={require('../../assets/SleepNavigationIcon.png')}/>
                    <Text style={styles.titleText}>
                        Sleep
                    </Text>
                </View>
                <View style={{paddingTop: 10}}>
                    <Text style={styles.otherText}>
                        Amount: 3-4 Hours{"\n"}Quality: 4/10
                    </Text>
                </View>

                <View style={styles.dataTitle}>
                    <Image style={styles.imageFormat} source={require('../../assets/PillNavigationIcon.png')}/>
                    <Text style={styles.titleText}>
                        Medications
                    </Text>
                </View>
                <View style={{paddingTop: 10}}>
                    <Text style={styles.otherText}>
                        Take Metformin 1 time(s) today{"\n"}Take Diazepam 2 times(s) today
                    </Text>
                </View>
                
                <View style={styles.dataTitle}>
                    <Image style={styles.imageFormat} source={require('../../assets/MoodNavigationIcon.png')}/>
                    <Text style={styles.titleText}>
                        Mood/Energy
                    </Text>
                </View>
                <View style={{paddingTop: 10}}>
                    <Text style={styles.timeTitle}>
                        04:59:
                    </Text>
                    <Text style={styles.moodText}>
                        Mood: Sad{"\n"}
                        Energy: 1/10
                    </Text>
                    <Text style={styles.timeTitle}>
                        13:32:
                    </Text>
                    <Text style={styles.moodText}>
                        Mood: Happy{"\n"}Energy: 6/10
                    </Text>
                </View>
            </ScrollView>
        </View>
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