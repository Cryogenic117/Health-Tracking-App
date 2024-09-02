import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useState, useEffect, useCallback } from 'react'
import {
    ActivityIndicator,
    Keyboard,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert,
    FlatList
} from 'react-native'
import NewMedicationModal from '../components/NewMedicationModal'
import NotesButton from '../components/NotesButton'
import { useMedication } from '../context/MedicationContext'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Ionicons } from '@expo/vector-icons';
import { MedicationModel } from '../context/MedicationContext'; // Add this import
import { useTheme } from '../context/ThemeContext'; // Add this import

export default function Medication(): JSX.Element {
    const { isDarkMode } = useTheme(); // Add this line
    const [results, setResults] = useState<React.ReactNode[] | null>(null)
    const [textEditable, setTextEditable] = useState(true)
    const [isSearchActive, setSearchActive] = useState(false)
    const [selectedMedication, setSelectedMedication] = useState({ name: '', id: '' })
    const [showModal, setShowModal] = useState(false)
    const [text, setText] = useState("")
    const { medications, updateMedications } = useMedication() as { medications: MedicationModel[], updateMedications: () => void };

    useEffect(() => {
        updateMedications()
    }, [])

    const search = useCallback(() => {
        const currentQuery = text
        setResults([<ActivityIndicator key="loader" size="small" color="#0000ff" />])
        setTextEditable(false)

        fetch(`https://api.fda.gov/drug/label.json?search=openfda.brand_name:${currentQuery}&limit=5`)
            .then(rawData => rawData.json())
            .then(data => {
                if (data.error) {
                    setResults([<Text style={styles.error}>{"The results you searched for were not found."}</Text>])
                } else {
                    setResults(getItems(data))
                }
            })
            .catch(() => {
                setResults([<Text style={styles.error}>{"There was an error, try again."}</Text>])
            })
            .finally(() => setTextEditable(true))
    }, [text])

    const searchResultPressed = useCallback((medName: string) => {
        const medID = `${Math.floor((Math.random() * Number.MAX_SAFE_INTEGER) + 1)}`
        setSelectedMedication({ name: medName, id: medID })
        setText("")
        setResults(null)
        setShowModal(true)
    }, [])

    const getItems = useCallback((data) => {
        return data.results.map((item) => (
            <TouchableOpacity
                key={item.id}
                onPress={() => searchResultPressed(item.openfda.brand_name[0])}
                style={styles.searchResultCard}
            >
                <View style={styles.searchResultInfo}>
                    <Text style={styles.drugName}>
                        {item.openfda.brand_name[0].charAt(0).toUpperCase() + item.openfda.brand_name[0].slice(1).toLowerCase()}
                    </Text>
                    <Text style={styles.drugInfo}>
                        {`Generic: ${item.openfda.generic_name[0]}`}
                    </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#5838B4" />
            </TouchableOpacity>
        ))
    }, [searchResultPressed])

    const medicationModalCancelToggle = useCallback(() => setShowModal(prev => !prev), [])

    const medicationModalSaveToggle = useCallback(async (medication: MedicationModel) => {
        setShowModal(false)
        setSearchActive(false)
        try {
            await storeMedicationData(medication, selectedMedication.id)
            await updateMedications()
            Alert.alert("Medication saved successfully")
        } catch (error) {
            console.error("Error saving medication:", error)
            Alert.alert("Error", "Failed to save medication")
        }
    }, [selectedMedication.id, updateMedications])

    const storeMedicationData = useCallback(async (medication: MedicationModel, id: string) => {
        try {
            const parentHash = await AsyncStorage.getItem("medicationScreen")
            const parsedParentHash = parentHash ? JSON.parse(parentHash) : {}
            parsedParentHash[id] = JSON.stringify(medication)
            await AsyncStorage.setItem("medicationScreen", JSON.stringify(parsedParentHash))
        } catch (e) {
            console.error(`Error saving medication (key: ${id}):`, e)
            throw e
        }
    }, [])

    const cancelButtonPressed = useCallback(() => {
        setSearchActive(false)
        setResults(null)
        setText("")
        Keyboard.dismiss()
    }, [])

    const deleteMedication = async (medicationId: string) => {
        Alert.alert(
            "Delete Medication",
            "Are you sure you want to delete this medication?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: async () => {
                        try {
                            const medicationScreenHash = await AsyncStorage.getItem('medicationScreen');
                            if (medicationScreenHash) {
                                const parsedHash = JSON.parse(medicationScreenHash);
                                delete parsedHash[medicationId];
                                await AsyncStorage.setItem('medicationScreen', JSON.stringify(parsedHash));
                                await updateMedications();
                                Alert.alert("Medication deleted successfully");
                            }
                        } catch (error) {
                            console.error("Error deleting medication:", error);
                            Alert.alert("Error", "Failed to delete medication");
                        }
                    },
                    style: "destructive"
                }
            ]
        );
    };

    const editMedication = (medication: MedicationModel) => {
        setSelectedMedication({ name: medication.name, id: medication.id });
        setShowModal(true);
    };

    const renderItem = ({ item: med }) => (
        <TouchableOpacity onPress={() => editMedication(med)}>
            <View style={[styles.medicationCard, isDarkMode && styles.medicationCardDark]}>
                <View style={styles.medicationInfo}>
                    <Text style={[styles.medicationName, isDarkMode && styles.medicationNameDark]}>{med.name}</Text>
                    <Text style={[styles.medicationDoses, isDarkMode && styles.medicationDosesDark]}>{med.dailyDoses} dose{med.dailyDoses > 1 ? 's' : ''} per day</Text>
                </View>
                <View style={styles.medicationActions}>
                    <NotesButton parentKey='medicationScreen' medicationID={med.id} isDarkMode={isDarkMode} />
                    <TouchableOpacity onPress={() => deleteMedication(med.id)}>
                        <Icon name="delete" size={24} color="red" />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
            <View style={[styles.searchContainer, isDarkMode && styles.searchContainerDark]}>
                <View style={[styles.searchInputContainer, isDarkMode && styles.searchInputContainerDark]}>
                    <Ionicons name="search" size={24} color={isDarkMode ? "#FFFFFF" : "#5838B4"} style={styles.searchIcon} />
                    <TextInput
                        onChangeText={setText}
                        onFocus={() => setSearchActive(true)}
                        autoCorrect={false}
                        value={text}
                        onSubmitEditing={search}
                        editable={textEditable}
                        placeholder="Search medications"
                        placeholderTextColor={isDarkMode ? "#999" : "#999"}
                        style={[styles.searchInput, isDarkMode && styles.searchInputDark]}
                        returnKeyType="search"
                    />
                    {text.length > 0 && (
                        <TouchableOpacity onPress={() => setText('')} style={styles.clearButton}>
                            <Ionicons name="close-circle" size={20} color={isDarkMode ? "#FFFFFF" : "#999"} />
                        </TouchableOpacity>
                    )}
                </View>
                {isSearchActive && (
                    <TouchableOpacity style={[styles.cancelButton, isDarkMode && styles.cancelButtonDark]} onPress={cancelButtonPressed}>
                        <Text style={[styles.cancelButtonText, isDarkMode && styles.cancelButtonTextDark]}>Cancel</Text>
                    </TouchableOpacity>
                )}
            </View>
            <View style={styles.contentContainer}>
                {!isSearchActive ? (
                    <View style={styles.medicationListContainer}>
                        <Text style={[styles.title, isDarkMode && styles.titleDark]}>{"Your Medications"}</Text>
                        <FlatList
                            data={medications}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={styles.medicationList}
                            ListEmptyComponent={<Text style={[styles.noMedications, isDarkMode && styles.noMedicationsDark]}>No Current Medications.</Text>}
                        />
                    </View>
                ) : (
                    <FlatList
                        data={results}
                        renderItem={({ item }) => item && React.isValidElement(item) ? item : null}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={styles.medicationList}
                    />
                )}
            </View>
            <NewMedicationModal
                medicationName={selectedMedication.name}
                editingMedication={medications.find(med => med.id === selectedMedication.id)}
                onClose={medicationModalCancelToggle}
                onSave={medicationModalSaveToggle}
                visible={showModal}
                isDarkMode={isDarkMode}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    containerDark: {
        backgroundColor: "#1C1C1E",
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    searchContainerDark: {
        backgroundColor: '#2C2C2E',
    },
    searchInputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        paddingHorizontal: 10,
    },
    searchInputContainerDark: {
        backgroundColor: '#2C2C2E',
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        height: 40,
        fontSize: 16,
        color: '#333',
    },
    searchInputDark: {
        color: '#FFFFFF',
    },
    clearButton: {
        padding: 5,
    },
    cancelButton: {
        marginLeft: 10,
    },
    cancelButtonDark: {
        backgroundColor: '#2C2C2E',
    },
    cancelButtonText: {
        color: '#5838B4',
        fontSize: 16,
    },
    cancelButtonTextDark: {
        color: '#FFFFFF',
    },
    contentContainer: {
        flex: 1,
    },
    medicationListContainer: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginVertical: 15,
        marginHorizontal: 15,
    },
    titleDark: {
        color: '#FFFFFF',
    },
    medicationCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        marginHorizontal: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    medicationCardDark: {
        backgroundColor: '#2C2C2E',
        shadowColor: "#FFFFFF",
    },
    medicationInfo: {
        flex: 1,
    },
    medicationName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    medicationNameDark: {
        color: '#FFFFFF',
    },
    medicationDoses: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    medicationDosesDark: {
        color: '#CCCCCC',
    },
    medicationActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    noMedications: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 30,
    },
    noMedicationsDark: {
        color: '#CCCCCC',
    },
    error: {
        textAlign: "center",
        fontSize: 16,
        color: '#ff0000',
        marginTop: 20,
    },
    searchResultCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        marginHorizontal: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    searchResultInfo: {
        flex: 1,
    },
    drugName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    drugInfo: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    medicationList: {
        paddingTop: 10,
        paddingBottom: 20,
    },
})