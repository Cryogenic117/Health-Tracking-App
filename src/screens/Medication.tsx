import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SearchBar from "react-native-dynamic-search-bar";

export default function Medication(): JSX.Element {
    return (
        <View>
            <View style= {styles.topBarPadding}/>
            <SearchBar></SearchBar>
            <Text style={styles.header}>{"Your Medications:"}</Text>
        {dataList.map(medicationName=>(<Text style={styles.medicationListItem}>{medicationName}</Text>))}
        </View>
    );
}
const styles=StyleSheet.create({

    header: {
        fontSize: 30,
        paddingTop: 10,
        paddingLeft: 15
    },
    topBarPadding: {
        paddingTop: 25
    },
    medicationListItem: {
        paddingTop: 25,
        paddingLeft: 15
    }
})
 const dataList: string[]= [
    "Diazepam (Valium)",
    "Metformin (Riomet)",
    "Mutli-Vitamins",
    "Iron Supplement"]