import React from 'react'
import { View, Text, StyleSheet, StatusBar,ScrollView } from 'react-native'
import SearchBar from "react-native-dynamic-search-bar"
import NotesButton from '../components/NotesButton';

export default function Medication(): JSX.Element {
    return (
        <View style={styles.container}>
            <SearchBar />
            <Text style={styles.header}>{"Your Medications:"}</Text>
            <ScrollView style={styles.medList}>
                {dataList.map(medName => (
                    <View style={styles.medListItem}>
                        <Text key={medName}>{medName}</Text>
                        <NotesButton/>
                    </View>
            ))}
            </ScrollView>
        </View>
    );
}

const styles=StyleSheet.create({
    container: {
        marginTop: StatusBar.currentHeight
    },
    header: {
        fontSize: 30,
        paddingTop: 10,
        paddingLeft: 15
    },
    medListItem: {
        paddingTop: 25,
        paddingLeft: 15
    },
    medList: {
        
    }
})

const dataList: string[] = [
    "Diazepam (Valium)",
    "Metformin (Riomet)",
    "Mutli-Vitamins",
    "Iron Supplement",   "Diazepam (Valium)",
    "Metformin (Riomet)",
    "Mutli-Vitamins",
    "Iron Supplement",   "Diazepam (Valium)",
    "Metformin (Riomet)",
    "Mutli-Vitamins",
    "Iron Supplement",   "Diazepam (Valium)",
    "Metformin (Riomet)",
    "Mutli-Vitamins",
    "Iron Supplement",   "Diazepam (Valium)",
    "Metformin (Riomet)",
    "Mutli-Vitamins",
    "Iron Supplement"
]