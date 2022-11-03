import React, { useState } from 'react'
import { ScrollView, StatusBar, Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import SearchBar from "react-native-dynamic-search-bar"
import NotesButton from '../components/NotesButton'

export default function Medication(): JSX.Element {
    const [searchResults, setSearchResults] = useState([]) 
    
    const searchRx = (searchTerm: string) => {
        fetch(`https://rxnav.nlm.nih.gov/REST/RxTerms/allconcepts.json`)
            .then((response) => response.json())
            .then((data) => data.minConceptGroup.minConcept)
            .then((apiResults) => {
                let searchResults = []
                apiResults.forEach((result) => {
                    if (result.fullName.includes(searchTerm)) {
                        searchResults.push(result)
                    }
                })
                return searchResults
            })
            .then((searchResults) => {
                let searchResultIDs = []
                searchResults.forEach((searchResult) => {
                    searchResultIDs.push(searchResult.rxcui)
                })
                return searchResultIDs
            })
            .then((searchResultIDs) => {                
                let searchResultDisplayNames = []
                searchResultIDs.forEach((ID) => {
                    fetch(`https://rxnav.nlm.nih.gov/REST/RxTerms/rxcui/${ID}/name.json`)
                        .then((response) => response.json())
                        .then((data) => console.log(data.displayGroup.displayName))
                })
                setSearchResults(searchResultDisplayNames)
            })
    }

    searchRx("diazepam")

    return (
        <View style={{marginTop: StatusBar.currentHeight, marginBottom: 200}}>
            {/* <SearchBar placeholder='Add a Medication'/>
            <View style={{paddingHorizontal: 20}}>
                <Text style={{fontSize: 30, paddingVertical: 10}}>Your Medications</Text>
                <ScrollView>
                    {userMedications.map((medName, index) => (
                        <View key={index} style={{paddingVertical: 10}}>
                            <Text key={medName} style={{fontSize: 20, paddingBottom: 5}}>{medName}</Text>
                            <NotesButton/>
                        </View>
                    ))}
                </ScrollView>
            </View> */}
            <ScrollView>
                {userMedications.map((searchResult,index) => (
                    <TouchableOpacity key = {index} style = {styles.searchResultCard} onPress = {() => {}}>
                        <Text style = {styles.searchResultCardText}>
                            {searchResult}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    )
}
const styles = StyleSheet.create({
    searchResultCard: {
        borderRadius: 10,
        borderWidth: 2,
        height: 50,
        margin: 10,
    },
    searchResultCardText: {
        textAlign: 'center',
        fontSize: 24
    }
})
const userMedications: string[] = [
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