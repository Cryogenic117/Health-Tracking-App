import React, { useState } from 'react'
import { ScrollView, StatusBar, Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import SearchBar from "react-native-dynamic-search-bar"
import NewMedicationModal from '../components/NewMedicationModal'
import NotesButton from '../components/NotesButton'

let currentQuery: string = ""
let searchResults: string[] = []
let userMedications: string[] = []

export default function Medication(): JSX.Element {
    const [isSearchActive, setSearchActive] = useState(false)
    const [selectedMedication, setSelectedMedication] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [refreshSearchList, setRefreshSearchList,] = useState(false)    

    const onNewQuery = (queryText: string) => {
        if (queryText.length != 0 && !isSearchActive) {
            setSearchActive(true)
        }
        currentQuery = queryText
    }

    const onClearSearch = () => {
        searchResults = []
        setSearchActive(false)
    }

    const onSearchButtonPress = () => {
        searchRx(currentQuery)
        setTimeout(() => {
            setRefreshSearchList(!refreshSearchList)
        }, 1000)        
    }

    const onSearchCardPress = (searchResult: string) => {
        setSelectedMedication(searchResult)
        setShowModal(true)
    }

    const medicationModalCancelToggle = () => {
        setShowModal(!showModal)
    }

    const medicationModalSaveToggle = () => {
        userMedications.push(selectedMedication)
        setShowModal(!showModal)
        setSearchActive(false)
    }

    return (
        <View style={{marginTop: StatusBar.currentHeight, marginBottom: 200}}>
            <SearchBar 
                placeholder='Add a Medication'
                onChangeText={(text) => onNewQuery(text)}
                onClearPress={() => onClearSearch()}                
                onSearchPress={() => onSearchButtonPress()}
            />
            {!isSearchActive && 
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
                </View>
            }
            {isSearchActive &&
                <ScrollView>
                    {searchResults.map((searchResult, index) => (
                        <TouchableOpacity key={index} style={styles.searchResultCard} onPress={() => onSearchCardPress(searchResult)}>
                            <Text style={styles.searchResultCardText}>{searchResult}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            }
            <NewMedicationModal 
                medicationName={selectedMedication} 
                cancelToggle={medicationModalCancelToggle}
                saveToggle={medicationModalSaveToggle}
                isOpen={showModal}
            />
        </View>
    )
}

function searchRx(searchTerm: string) {
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
                    .then((data) => searchResultDisplayNames.push(data.displayGroup.displayName))
            })
            searchResults = searchResultDisplayNames
        })
}

const styles = StyleSheet.create({
    searchResultCard: {
        borderRadius: 10,
        borderWidth: 2,
        height: 50,
        margin: 10,
        justifyContent: 'center',
        alignContent: 'center'
    },
    searchResultCardText: {
        textAlign: 'center',
        fontSize: 24
    }
})