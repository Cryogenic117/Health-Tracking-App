import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { StyleSheet, Text, View, Switch, Alert, TouchableOpacity, ScrollView } from 'react-native'
import Modal from "react-native-modal"
import DatePicker from 'react-native-modern-datepicker'
import NumericInputModal from './NumericInput'
import { Ionicons } from '@expo/vector-icons'

interface NewMedicationModalProps {
    medicationName: string;
    editingMedication?: MedicationModel;
    onClose: () => void;
    onSave: (medication: MedicationModel) => Promise<void>;
    visible: boolean;
    isDarkMode: boolean;
}

export default function NewMedicationModal({ visible, onClose, onSave, isDarkMode, medicationName, editingMedication }: NewMedicationModalProps & { medicationName: string; editingMedication?: MedicationModel }): JSX.Element {
    const [modalKey, setModalKey] = useState(0)
    const [isMultipleDays, setIsMultipleDays] = useState(false)
    const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false)
    const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false)
    const [selectedStartDate, setSelectedStartDate] = useState(new Date())
    const [selectedEndDate, setSelectedEndDate] = useState(new Date())
    const [dailyDoses, setDailyDoses] = useState(1)
    const [isNumericInputVisible, setNumericInputVisible] = useState(false)
    const [isDateRangeValid, setIsDateRangeValid] = useState(true)

    // Reset all states when the modal is opened
    useEffect(() => {
        if (visible) {
            setModalKey(prevKey => prevKey + 1)
            if (editingMedication) {
                // Editing existing medication
                setIsMultipleDays(editingMedication.dateRange[0] !== editingMedication.dateRange[1])
                setSelectedStartDate(new Date(editingMedication.dateRange[0]))
                setSelectedEndDate(new Date(editingMedication.dateRange[1]))
                setDailyDoses(editingMedication.dailyDoses)
            } else {
                // New medication
                const currentDate = new Date()
                setSelectedStartDate(currentDate)
                setSelectedEndDate(currentDate)
                setIsMultipleDays(false)
                setDailyDoses(1)
            }
            setIsDateRangeValid(true)
            setStartDatePickerVisibility(false)
            setEndDatePickerVisibility(false)
            setNumericInputVisible(false)
        }
    }, [visible, editingMedication])

    const handleConfirmStartDate = (date) => {
        setStartDatePickerVisibility(false)
        setSelectedStartDate(moment(date, 'YYYY/MM/DD').toDate())
        validateDateRange(moment(date, 'YYYY/MM/DD').toDate(), selectedEndDate)
    }

    const handleConfirmEndDate = (date) => {
        setEndDatePickerVisibility(false)
        setSelectedEndDate(moment(date, 'YYYY/MM/DD').toDate())
        validateDateRange(selectedStartDate, moment(date, 'YYYY/MM/DD').toDate())
    }

    const validateDateRange = (start: Date, end: Date) => {
        if (isMultipleDays) {
            const isValid = start <= end
            setIsDateRangeValid(isValid)
            if (!isValid) {
                Alert.alert("Invalid Date Range", "The end date must be on or after the start date.")
            }
        } else {
            setIsDateRangeValid(true)
        }
    }

    const onSavePress = () => {
        if (isMultipleDays && selectedStartDate > selectedEndDate) {
            Alert.alert("Invalid Date Range", "The start date must be before the end date.");
            return;
        }

        const doses = dailyDoses === 0 ? 1 : dailyDoses;
        const newMedication: MedicationModel = {
            name: medicationName,
            dateRange: [
                selectedStartDate.toDateString(),
                isMultipleDays ? selectedEndDate.toDateString() : selectedStartDate.toDateString()
            ],
            dailyDoses: doses,
            notes: editingMedication ? editingMedication.notes : ''
        };

        console.log("Saving medication:", JSON.stringify(newMedication, null, 2));
        onSave(newMedication);
    }

    return (
        <Modal isVisible={visible} key={modalKey} style={styles.modal}>
            <View style={[styles.modalContainer, isDarkMode && styles.modalContainerDark]}>
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <Text style={[styles.medicationName, isDarkMode && styles.medicationNameDark]}>{medicationName}</Text>
                    
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}>Duration</Text>
                        <View style={styles.switchContainer}>
                            <Text style={[styles.switchLabel, isDarkMode && styles.switchLabelDark]}>Multiple Days</Text>
                            <Switch
                                value={isMultipleDays}
                                onValueChange={setIsMultipleDays}
                                trackColor={{ false: "#767577", true: "#5838B4" }}
                                thumbColor={isMultipleDays ? "#f4f3f4" : "#f4f3f4"}
                            />
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}>Date Range</Text>
                        <TouchableOpacity
                            style={[styles.dateButton, isDarkMode && styles.dateButtonDark]}
                            onPress={() => setStartDatePickerVisibility(true)}
                        >
                            <Text style={[styles.dateButtonText, isDarkMode && styles.dateButtonTextDark]}>
                                {moment(selectedStartDate).format('MMMM D, YYYY')}
                            </Text>
                        </TouchableOpacity>
                        <Modal isVisible={isStartDatePickerVisible} style={styles.datePickerModal}>
                            <View style={styles.datePickerContainer}>
                                <DatePicker
                                    mode="calendar"
                                    onDateChange={handleConfirmStartDate}
                                    selected={moment(selectedStartDate).format('YYYY/MM/DD')}
                                />
                                <TouchableOpacity
                                    style={styles.closeDatePickerButton}
                                    onPress={() => setStartDatePickerVisibility(false)}
                                >
                                    <Text style={styles.closeDatePickerButtonText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </Modal>
                        {isMultipleDays && (
                            <>
                                <TouchableOpacity
                                    style={[styles.dateButton, isDarkMode && styles.dateButtonDark]}
                                    onPress={() => setEndDatePickerVisibility(true)}
                                >
                                    <Text style={[styles.dateButtonText, isDarkMode && styles.dateButtonTextDark]}>
                                        {moment(selectedEndDate).format('MMMM D, YYYY')}
                                    </Text>
                                </TouchableOpacity>
                                <Modal isVisible={isEndDatePickerVisible} style={styles.datePickerModal}>
                                    <View style={styles.datePickerContainer}>
                                        <DatePicker
                                            mode="calendar"
                                            onDateChange={handleConfirmEndDate}
                                            selected={moment(selectedEndDate).format('YYYY/MM/DD')}
                                        />
                                        <TouchableOpacity
                                            style={styles.closeDatePickerButton}
                                            onPress={() => setEndDatePickerVisibility(false)}
                                        >
                                            <Text style={styles.closeDatePickerButtonText}>Close</Text>
                                        </TouchableOpacity>
                                    </View>
                                </Modal>
                            </>
                        )}
                    </View>

                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}>Daily Doses</Text>
                        <TouchableOpacity
                            style={[styles.doseButton, isDarkMode && styles.doseButtonDark]}
                            onPress={() => setNumericInputVisible(true)}
                        >
                            <Text style={styles.doseButtonText}>{dailyDoses} dose{dailyDoses > 1 ? 's' : ''} per day</Text>
                            <Ionicons name="chevron-forward" size={24} color="#5838B4" />
                        </TouchableOpacity>
                    </View>

                    <NumericInputModal
                        isVisible={isNumericInputVisible}
                        onClose={() => setNumericInputVisible(false)}
                        onSave={(value) => setDailyDoses(value)}
                        initialValue={dailyDoses}
                        title={`How often do you take ${medicationName} per day?`}
                    />
                </ScrollView>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                        <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.saveButton, (!isDateRangeValid || (isMultipleDays && !isDateRangeValid)) && styles.disabledButton]}
                        onPress={onSavePress}
                        disabled={isMultipleDays && !isDateRangeValid}
                    >
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modal: {
        margin: 0,
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '90%',
    },
    modalContainerDark: {
        backgroundColor: '#1C1C1E',
    },
    scrollViewContent: {
        flexGrow: 1,
    },
    medicationName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#5838B4',
        textAlign: 'center',
        marginBottom: 20,
    },
    medicationNameDark: {
        color: '#FFFFFF',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    sectionTitleDark: {
        color: '#FFFFFF',
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    switchLabel: {
        fontSize: 16,
    },
    switchLabelDark: {
        color: '#FFFFFF',
    },
    dateButton: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    dateButtonDark: {
        backgroundColor: '#2C2C2E',
    },
    dateButtonText: {
        fontSize: 16,
        textAlign: 'center',
    },
    dateButtonTextDark: {
        color: '#FFFFFF',
    },
    doseButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 8,
    },
    doseButtonDark: {
        backgroundColor: '#2C2C2E',
    },
    doseButtonText: {
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    cancelButton: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 8,
        flex: 1,
        marginRight: 10,
    },
    saveButton: {
        backgroundColor: '#5838B4',
        padding: 15,
        borderRadius: 8,
        flex: 1,
        marginLeft: 10,
    },
    disabledButton: {
        opacity: 0.5,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    },
    cancelButtonText: {
        color: '#000',
    },
    datePickerModal: {
        margin: 0,
        justifyContent: 'flex-end',
    },
    datePickerContainer: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    closeDatePickerButton: {
        backgroundColor: '#5838B4',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    closeDatePickerButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
})