import React from 'react'
import { Image } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Calendar from '../screens/Calendar'
import Medication from '../screens/Medication'
import MoodAndEnergy from '../screens/MoodAndEnergy'
import Sleep from '../screens/Sleep'

const Tab = createBottomTabNavigator()

const calendarTabOptions = {
    tabBarIcon: () => <Image source={require('../../assets/CalendarNavigationIcon.png')} />
}
const medicationTabOptions = {
    tabBarIcon: () => <Image source={require('../../assets/PillNavigationIcon.png')} />
}
const moodAndEnergyTabOptions = {
    tabBarIcon: () => <Image source={require('../../assets/MoodNavigationIcon.png')} />
}
const sleepTabOptions = {
    tabBarIcon: () => <Image source={require('../../assets/SleepNavigationIcon.png')} />
}
const navBarScreenOptions = {
    headerShown: false,
    tabBarShowLabel: false,
    tabBarHideOnKeyboard: true,
    tabBarActiveBackgroundColor: '#5838B4',
    tabBarStyle: {
        backgroundColor: '#000000'
    }
    
}

export default function Navbar(): JSX.Element {
    return (
        <Tab.Navigator screenOptions={navBarScreenOptions}>
            <Tab.Screen name="calendar" component={Calendar} options={calendarTabOptions} />
            <Tab.Screen name="medication" component={Medication} options={medicationTabOptions} />
            <Tab.Screen name="moodAndEnergy" component={MoodAndEnergy} options={moodAndEnergyTabOptions} />
            <Tab.Screen name="sleep" component={Sleep} options={sleepTabOptions} />
        </Tab.Navigator>
    )
}
