import React from 'react'
import { StatusBar, StyleSheet, Text, View } from 'react-native'
import { Agenda } from 'react-native-calendars'

export default function Calendar(): JSX.Element {
    return (
        <View style={{marginTop: StatusBar.currentHeight}}>
            <View style={{height: '100%'}}>                
                <Agenda renderList={() => DailyData()}/>
            </View>
        </View>
    )
}

function DailyData(): JSX.Element {
    return (
        <View style={{alignItems: 'center', padding: 10}}>
            <Text style={{fontSize: 20}}>Daily Data</Text>
            <View style={styles.lineSeperator}/>
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