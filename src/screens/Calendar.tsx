import React from 'react';
import { View } from 'react-native';
import { Calendar as MainCalendar, CalendarList, Agenda } from 'react-native-calendars';

export default function Calendar(): JSX.Element {
    return (
        <View>
            <MainCalendar onDayPress={() => {/*Render the detailed information for that day*/}}/>
        </View>
    );
}