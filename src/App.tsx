import React from 'react'
import Navbar from "./components/Navbar"
import { NavigationContainer } from '@react-navigation/native'
import { registerRootComponent } from 'expo'

export default function App(): JSX.Element {
    return (
        <NavigationContainer>
            <Navbar />
        </NavigationContainer>
    )
}

registerRootComponent(App)