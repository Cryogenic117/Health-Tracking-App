import React from 'react'
import Navbar from "./components/Navbar"
import { NavigationContainer } from '@react-navigation/native'
import { registerRootComponent } from 'expo'
import { MedicationProvider } from './context/MedicationContext'

export default function App(): JSX.Element {
    return (
        <MedicationProvider>
            <NavigationContainer>
                <Navbar />
            </NavigationContainer>
        </MedicationProvider>
    )
}

registerRootComponent(App)