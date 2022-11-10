import React from 'react'
import Navbar from "./src/components/Navbar"
import { NavigationContainer } from '@react-navigation/native'

export default function App(): JSX.Element {
    return (
        <NavigationContainer>
            <Navbar />
        </NavigationContainer>
    )
}

