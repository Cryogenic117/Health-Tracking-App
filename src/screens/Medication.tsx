import React, { useState } from 'react'
import { ScrollView, StatusBar, Text, View } from 'react-native'
import SearchBar from "react-native-dynamic-search-bar"
import NotesButton from '../components/NotesButton'

export default function Medication(): JSX.Element {
    const searchRx = (search) => {
        fetch(`https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${search}&search=0`)
            .then((response) => response.json())
            .then((data) => {
                if (data.idGroup.rxnormId) {
                    let rxcui = data.idGroup.rxnormId[0]
                    return fetch(`https://rxnav.nlm.nih.gov/REST/rxcui/${rxcui}/allrelated.json`)
                        .then((response) => response.json())
                        .then((data) => console.log(data.allRelatedGroup.conceptGroup[0].conceptProperties[0].name))
                    }
            })
    }

    searchRx("advil")

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