import React, { useState } from 'react'
import {
    ActivityIndicator,
    Keyboard,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native'
import NewMedicationModal from '../components/NewMedicationModal'
import NotesButton from '../components/NotesButton'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function Medication(): JSX.Element {
	const [results, setResults] = useState(null)
	const [textEditable, setTextEditable] = useState(true)
    const [isSearchActive, setSearchActive] = useState(false)
    const [selectedMedication, setSelectedMedication] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [userMedications, setUserMedications] = useState<string[]>([])
    const [text,setText] = useState("")

    const search = () => {
        const currentQuery = text
        setResults(<ActivityIndicator size="small" color="#0000ff" />)
        try {
            setTextEditable(false)
            fetch("https://api.fda.gov/drug/label.json?search=openfda.brand_name:" + currentQuery + '&limit=100')
                .then(rawData => rawData.json())
                .then(data => {
                    if (data.error) {
                        const notFoundText = <Text style={styles.error}>{"The results you searched for were not found."}</Text>
                        setResults(notFoundText)
                        return null
                    }
                    let itemsToRender = getItems(data)
                    setResults(itemsToRender)
                })
                .then(() => setTextEditable(true))
        } catch(error) {
            const errorText = <Text style={styles.error}>{"There was an error, try again."}</Text>
            setResults(errorText)
        }
    }

    const getItems = (data) => {
        return data.results.map((item) => {
            return (
                <TouchableOpacity 
                    key={item.id} 
                    onPress={() => 
                        resultPressed(item.openfda.brand_name[0].charAt(0).toUpperCase() + item.openfda.brand_name[0].substr(1).toLowerCase())
                    }
                >
                    <View style={styles.item}>
                        <Text style={styles.drugName}>
                            {item.openfda.brand_name[0].charAt(0).toUpperCase() + item.openfda.brand_name[0].substr(1).toLowerCase()}
                        </Text>
                        <Text style={styles.drugInfo}>
                            {`Generic: ${item.openfda.generic_name[0]}`}
                        </Text>
                    </View>
                </TouchableOpacity>
            )
        })
    }

    const resultPressed = (medName) => {
        setSelectedMedication(medName)
        setText("")
        setResults(null)
        setShowModal(true)
    }
    
    const medicationModalCancelToggle = () => {
        setShowModal(!showModal)
    }

    const medicationModalSaveToggle = (medication: MedicationModel) => {
        userMedications.push(selectedMedication)
        setShowModal(!showModal)
        setSearchActive(false)
        storeMedicationData(medication)
    }

    const storeMedicationData = async (medication: MedicationModel) => {
        const key: number = Math.floor((Math.random() * Number.MAX_SAFE_INTEGER) + 1);
        try {
            const jsonValue = JSON.stringify(medication)
            await AsyncStorage.setItem(`${key}`, jsonValue)
        } catch (e) {
            console.log(`There was an error saving the medication (key: ${key}): ${e}`)
        }
    }

    const cancelButtonPressed = () => {
        setSearchActive(false)
        setResults(null)
        setText("")
        Keyboard.dismiss()
    }

    return (
        <SafeAreaView style={styles.androidSafeArea}>
            <SafeAreaView style={{flex: 1, margin: 10, alignSelf: 'center', alignContent:"center", flexDirection:"row"}}>
                <TextInput 
                    onChangeText={value => setText(value)}
                    onPressIn={() => setSearchActive(true)}
                    autoCorrect={false}
                    value={text}
                    onSubmitEditing={()=> search()}
                    editable={textEditable}
                    placeholder="Add a medication"
                    clearButtonMode='always'
                    style={styles.search}
                />
                {isSearchActive &&
                    <Text style={styles.cancel} onPress={() => cancelButtonPressed()}>{"C A N C E L"}</Text>
                }
            </SafeAreaView>
            <View style={{flex: 9}}>
                {!isSearchActive &&
                    <View style={{flex:1}}>
                        <Text style={{alignSelf: 'center', fontSize: 30}}>{"Your Medications"}</Text>
                        <ScrollView style={{flex: 5}}>
                            {userMedications.length == 0 &&
                                <Text style={{fontSize: 16, marginLeft: 10, marginTop: 25}}>{"No Current Medications."}</Text>   
                            } 
                            {userMedications.map((medName, index) => (
                                <View key={index} style={{paddingVertical: 10, paddingLeft: 15}}>
                                    <Text key={medName} style={{fontSize: 20, paddingBottom: 5}}>{medName}</Text>
                                    <NotesButton feature='medication' medicationID=''/>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                }
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
    error: {
        textAlign: "center",
        fontSize: 24
    },
	drugName: {
		fontSize: 16,
		fontWeight: "bold",
	},
    drugInfo: {
        fontSize: 12
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
        maxWidth: '95%', 
        flex: 8, 
        textAlign: "center", 
        backgroundColor: "white", 
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: '#d3d3d3'
    },
    cancel: {
        paddingTop: 12.5,
        maxHeight: 50, 
        minHeight: 50, 
        maxWidth: '95%', 
        flex: 2, 
        textAlign: "center",
        color: 'black'
    },
    androidSafeArea: {
        flex: 1,
        backgroundColor: "white",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    }
})