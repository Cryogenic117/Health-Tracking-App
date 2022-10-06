import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Calendar as MainCalendar } from 'react-native-calendars'

export default function Calendar(): JSX.Element {
    return (
        <View>
            <MainCalendar onDayPress={() => {/*Render the detailed information for that day*/}}/>
            <View style={styles.dailyDataHeader}>
                <Text style={styles.dailyDataHeaderText}>Daily Data</Text>
                <View style={styles.dailyDataHeaderLineSeperator}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    dailyDataHeader: {
        alignItems: 'center',
        padding: 10
    },
    dailyDataHeaderText: {
        fontSize: 20
    },
    dailyDataHeaderLineSeperator: {
        borderBottomColor: "black", 
        borderBottomWidth: 1, 
        width: '100%',
        paddingTop: 10
    }
})