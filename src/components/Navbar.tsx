import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import Calendar from '../screens/Calendar'
import Medication from '../screens/Medication'
import MoodAndEnergy from '../screens/MoodAndEnergy'
import Sleep from '../screens/Sleep'
import ThemeToggle from './ThemeToggle'
import { useTheme } from '../context/ThemeContext'

const Tab = createBottomTabNavigator()

const CustomTabBar = ({ state, descriptors, navigation }) => {
    const { isDarkMode } = useTheme();

    return (
        <View style={[styles.tabBar, isDarkMode && styles.tabBarDark]}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key]
                const label = options.tabBarLabel || route.name
                const isFocused = state.index === index

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    })

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name)
                    }
                }

                return (
                    <TouchableOpacity
                        key={route.key}
                        onPress={onPress}
                        style={styles.tabItem}
                    >
                        <Ionicons
                            name={getIconName(route.name, isFocused) as keyof typeof Ionicons.glyphMap}
                            size={24}
                            color={isFocused ? '#5838B4' : isDarkMode ? '#FFFFFF' : '#8E8E93'}
                        />
                        <Text style={[
                            styles.tabLabel,
                            isFocused && styles.tabLabelFocused,
                            isDarkMode && styles.tabLabelDark
                        ]}>
                            {label}
                        </Text>
                    </TouchableOpacity>
                )
            })}
        </View>
    )
}

const getIconName = (routeName: string, isFocused: boolean): string => {
    switch (routeName) {
        case 'Calendar':
            return isFocused ? 'calendar' : 'calendar-outline'
        case 'Medication':
            return isFocused ? 'medical' : 'medical-outline'
        case 'MoodAndEnergy':
            return isFocused ? 'happy' : 'happy-outline'
        case 'Sleep':
            return isFocused ? 'moon' : 'moon-outline'
        default:
            return 'help-circle-outline'
    }
}

export default function Navbar(): JSX.Element {
    const { isDarkMode } = useTheme();

    return (
        <Tab.Navigator
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={({ route }) => ({
                headerShown: true,
                headerRight: () => <ThemeToggle />,
                headerStyle: {
                    backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
                },
                headerTintColor: isDarkMode ? '#FFFFFF' : '#1C1C1E',
            })}
        >
            <Tab.Screen name="Calendar" component={Calendar} />
            <Tab.Screen name="Medication" component={Medication} />
            <Tab.Screen name="Mood" component={MoodAndEnergy} />
            <Tab.Screen name="Sleep" component={Sleep} />
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        paddingBottom: 5,
        paddingTop: 5,
    },
    tabBarDark: {
        backgroundColor: '#1C1C1E',
        borderTopColor: '#2C2C2E',
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
    },
    tabLabel: {
        fontSize: 12,
        marginTop: 4,
        color: '#8E8E93',
    },
    tabLabelFocused: {
        color: '#5838B4',
        fontWeight: 'bold',
    },
    tabLabelDark: {
        color: '#FFFFFF',
    },
})
