import React from 'react'
import { ScrollView, StatusBar, Text, View } from 'react-native'
import SearchBar from "react-native-dynamic-search-bar"
import NewMedicationModal from '../components/NewMedicationModal'
import NotesButton from '../components/NotesButton'

export default function Medication(): JSX.Element {
    return (
        <View style={{marginTop: StatusBar.currentHeight, marginBottom: 200}}>
            <SearchBar placeholder='Add a Medication'/>
            <View style={{paddingHorizontal: 20}}>
                <Text style={{fontSize: 30, paddingVertical: 10}}>Your Medications</Text>
                <ScrollView>
                    {mockData.map((medName, index) => (
                        <View key={index} style={{paddingVertical: 10}}>
                            <Text key={medName} style={{fontSize: 20, paddingBottom: 5}}>{medName}</Text>
                            <NotesButton/>
                        </View>
                    ))}
                </ScrollView>
            </View>
            <NewMedicationModal/>
        </View>
    )
}

const mockData: string[] = [
    "Diazepam (Valium)",
    "Metformin (Riomet)",
    "Mutli-Vitamins",
    "Iron Supplement",
    "Diazepam (Valium)",
    "Metformin (Riomet)",
    "Mutli-Vitamins",
    "Iron Supplement",
    "Diazepam (Valium)",
    "Metformin (Riomet)",
    "Mutli-Vitamins",
    "Iron Supplement",
    "Diazepam (Valium)",
    "Metformin (Riomet)",
    "Mutli-Vitamins",
    "Iron Supplement",
    "Diazepam (Valium)",
    "Metformin (Riomet)",
    "Mutli-Vitamins",
    "Iron Supplement"
]