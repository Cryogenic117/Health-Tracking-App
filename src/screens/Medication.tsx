import React, { useState } from 'react'
import { ScrollView, StatusBar, ActivityIndicator, Text, View, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import NewMedicationModal from '../components/NewMedicationModal'
import NotesButton from '../components/NotesButton'

export default function Medication(): JSX.Element {
    const [currentText,setCurrentText] = useState("")
	const[results,setResults]= useState(null)
	const[textEditable,setTextEditable]= useState(true)
    const [isSearchActive, setSearchActive] = useState(false)
    const [selectedMedication, setSelectedMedication] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [refreshSearchList, setRefreshSearchList,] = useState(false)

    function search() {
        const currentQuery = currentText
        setResults(<ActivityIndicator size="small" color="#0000ff" />)
        setTextEditable(false)
        fetch("https://api.fda.gov/drug/label.json?search=openfda.brand_name:"+ currentQuery + '&limit=100')
        .then(raw_data => raw_data.json())
        .then(data => {
            if (data.error){
                const not_found_text = <Text>The results you searched for where not found.</Text>
                setResults(not_found_text)
                return null
            }
    
            // gets items to render from the output of the FDA API
            let to_render = get_items(data)
            // update what is rendering on this object based on the items above.
            setResults(to_render)
        })
        .then(() => {setTextEditable(true)})
    }
    function get_items(data){
        return data.results.map((item) => {
            return(
                <View style={styles.item}key={item.id}>
                    <View style={{flex:7}}>
                        <Text style={styles.drugName}>
                            {item.openfda.brand_name[0].charAt(0).toUpperCase()+item.openfda.brand_name[0].substr(1).toLowerCase()}
                        </Text>
                        <Text style={styles.drugInfo}>
                            Form: {item.openfda.route[0].charAt(0).toUpperCase()+item.openfda.route[0].substr(1).toLowerCase()+"\n"}
                            Brands: {item.openfda.generic_name[0].charAt(0).toUpperCase()+item.openfda.generic_name[0].substr(1).toLowerCase()}
                           
                        </Text>
                        
                    </View>
                </View>
            )
        })
    }

    return (
            <View style={{flex:1}}>
				<View style={{flex:1, margin: "auto", alignContent:"center", flexDirection:"row"}}>
					<TextInput onChangeText={text => setCurrentText(text)} autoCorrect={false}
                        placeholder="Enter a drug" onSubmitEditing={()=>search()}
						editable={textEditable}
						style={{flex:9, marginTop: 30, alignItems:"center", textAlign: "center", backgroundColor: "white", alignContent:"center"}}/>
				</View>
				<View style={{flex:6}}>
					<ScrollView style={{flex:8}}>
						{results}
					</ScrollView>
				</View>
			</View>
    )
}

const styles = StyleSheet.create({
	drugName: {
		fontSize: 16,
		fontWeight: "bold",
	},
    drugInfo: {
        fontSize:12
    },
    item: {
        flex: 3,
        borderBottomColor: "grey",
        borderBottomWidth: 2,
        padding: 25
    }
})