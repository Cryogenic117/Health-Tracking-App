import React from 'react'
import Navbar from "./components/Navbar"
import { NavigationContainer } from '@react-navigation/native'
import { registerRootComponent } from 'expo'
import { MedicationProvider } from './context/MedicationContext'
import { ThemeProvider } from './context/ThemeContext'

export default function App(): JSX.Element {
    return (
        <ThemeProvider>
            <MedicationProvider>
                <NavigationContainer>
                    <Navbar />
                </NavigationContainer>
            </MedicationProvider>
        </ThemeProvider>
    )
}

registerRootComponent(App)