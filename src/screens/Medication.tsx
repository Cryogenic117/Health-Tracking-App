import React, { useState, Component } from 'react'
import { ScrollView, SafeAreaView, Image, StatusBar, ActivityIndicator, Text, View, StyleSheet, TouchableOpacity, TextInput, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native'
import NewMedicationModal from '../components/NewMedicationModal'
import NotesButton from '../components/NotesButton'

export default function Medication(): JSX.Element {
	const[results,setResults]= useState(null)
	const[textEditable,setTextEditable]= useState(true)
    const [isSearchActive, setSearchActive] = useState(false)
    const [selectedMedication, setSelectedMedication] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [userMedications, setUserMedications] = useState<string[]>([])
    const [text,setText] = useState("")

    function search() {
        const currentQuery = text
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
    git
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
                <TouchableOpacity key={item.id} onPress={() => 
                resultPressed(item.openfda.brand_name[0].charAt(0).toUpperCase()+item.openfda.brand_name[0].substr(1).toLowerCase())}
                >
                    <View style={styles.item}>
                            <Text style={styles.drugName}>
                                {item.openfda.brand_name[0].charAt(0).toUpperCase()+item.openfda.brand_name[0].substr(1).toLowerCase()}
                            </Text>
                            <Text style={styles.drugInfo}>
                                Generic: {item.openfda.generic_name[0]}
                            </Text>
                    </View>
                </TouchableOpacity>
            )
        })
    }
    function resultPressed(medName) {
        setSelectedMedication(medName)
        setText("")
        setResults(null)
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

    function cancelButtonPressed() {
        setSearchActive(false)
        setResults(null)
        setText("")
        Keyboard.dismiss()
    }
    return(
            <SafeAreaView style={styles.AndroidSafeArea}>
				<SafeAreaView style={{flex:1, margin: "auto", alignSelf: 'center', alignContent:"center", flexDirection:"row"}}>
					<TextInput onChangeText={value => setText(value)}
                        onPressIn={() => setSearchActive(true)}
                        autoCorrect={false}
                        value = {text}
                        onSubmitEditing={()=> search()}
						editable={textEditable}
                        placeholder= "Add a medication"
                        clearButtonMode='always'
						style={styles.search}/>
                    {isSearchActive &&
                            <Text style={styles.cancel} onPress={() => cancelButtonPressed()}>C A N C E L</Text>
                    }
				</SafeAreaView>
				<View style={{flex:6}}>
                {!isSearchActive &&
                <View style={{flex:1}}>
                    <Text style={{alignSelf: 'center', fontSize: 30}}>Your Medications</Text>
                    <ScrollView style={{flex: 5}}>
                        {userMedications.map((medName, index) => (
                            <View key={index} style={{paddingVertical: 10, paddingLeft: 15}}>
                                <Text key={medName} style={{fontSize: 20, paddingBottom: 5}}>{medName}</Text>
                                <NotesButton/>
                            </View>
                        ))}
                    </ScrollView>
                </View>}
					<ScrollView style={{flex:8}}>
                            {results}
					</ScrollView>
				</View>
                <NewMedicationModal 
                medicationName={selectedMedication} 
                cancelToggle={medicationModalCancelToggle}
                saveToggle={medicationModalSaveToggle}
                isOpen={showModal}
            />
			</SafeAreaView>
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
        borderBottomColor: "#767676",
        borderBottomWidth: .5,
        padding: 15
    },
    search: {
        maxHeight: 50, 
        minHeight: 50, 
        maxWidth: '90%', 
        flex: 8, 
        textAlign: "center", 
        backgroundColor: "white", 
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: '#d3d3d3',
    },
    cancel: {
        paddingTop: 12.5,
        maxHeight: 50, 
        minHeight: 50, 
        maxWidth: '90%', 
        flex: 2, 
        textAlign: "center",
        color: 'black',
    },
    AndroidSafeArea: {
        flex: 1,
        backgroundColor: "white",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
      }
})