import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import SearchBar from "react-native-dynamic-search-bar";

export default function Medication(): JSX.Element {
    return (
        <View style={styles.container}>
            <SearchBar />
            <Text style={styles.header}>{"Your Medications:"}</Text>
            {dataList.map(medicationName => (
                <Text key={medicationName} style={styles.medicationListItem}>{medicationName}</Text>
            ))}
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
    medicationListItem: {
        paddingTop: 25,
        paddingLeft: 15
    }
})

const dataList: string[] = [
    "Diazepam (Valium)",
    "Metformin (Riomet)",
    "Mutli-Vitamins",
    "Iron Supplement"
]