import React from 'react'
import Navbar from "./components/navbar"
import { NavigationContainer } from '@react-navigation/native'

export default function App(): JSX.Element {
    return (
        <NavigationContainer>
            <Navbar />
        </NavigationContainer>
    )
}

