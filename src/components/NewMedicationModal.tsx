import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Switch, Alert, TouchableOpacity, ScrollView } from 'react-native'
import Modal from "react-native-modal"
import DateTimePickerModal from "react-native-modal-datetime-picker"
import NumericInputModal from './NumericInput'
import { Ionicons } from '@expo/vector-icons'

export default function NewMedicationModal(props): JSX.Element {
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
        if (props.isOpen) {
            setModalKey(prevKey => prevKey + 1)
            if (props.editingMedication) {
                // Editing existing medication
                setIsMultipleDays(props.editingMedication.dateRange[0] !== props.editingMedication.dateRange[1])
                setSelectedStartDate(new Date(props.editingMedication.dateRange[0]))
                setSelectedEndDate(new Date(props.editingMedication.dateRange[1]))
                setDailyDoses(props.editingMedication.dailyDoses)
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
    }, [props.isOpen, props.editingMedication])

    const handleConfirmStartDate = (date: Date) => {
        setStartDatePickerVisibility(false)
        setSelectedStartDate(date)
        validateDateRange(date, selectedEndDate)
    }

    const handleConfirmEndDate = (date: Date) => {
        setEndDatePickerVisibility(false)
        setSelectedEndDate(date)
        validateDateRange(selectedStartDate, date)
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
        const startDate = new Date(selectedStartDate)
        const endDate = new Date(selectedEndDate)

        if (isMultipleDays && startDate > endDate) {
            Alert.alert("Invalid Date Range", "The start date must be before the end date.")
            return
        }

        const doses = dailyDoses === 0 ? 1 : dailyDoses

        const newMedication: MedicationModel = {
            name: props.medicationName,
            dateRange: [
                startDate.toISOString(),
                isMultipleDays ? endDate.toISOString() : startDate.toISOString()
            ],
            dailyDoses: doses,
            notes: props.editingMedication ? props.editingMedication.notes : ''
        }

        props.saveToggle(newMedication)
    }

    return (
        <Modal isVisible={props.isOpen} key={modalKey} style={styles.modal}>
            <View style={styles.modalContainer}>
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <Text style={styles.medicationName}>{props.medicationName}</Text>
                    
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Duration</Text>
                        <View style={styles.switchContainer}>
                            <Text style={styles.switchLabel}>Multiple Days</Text>
                            <Switch
                                value={isMultipleDays}
                                onValueChange={setIsMultipleDays}
                                trackColor={{ false: "#767577", true: "#5838B4" }}
                                thumbColor={isMultipleDays ? "#f4f3f4" : "#f4f3f4"}
                            />
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Date Range</Text>
                        <TouchableOpacity
                            style={styles.dateButton}
                            onPress={() => setStartDatePickerVisibility(true)}
                        >
                            <Text style={styles.dateButtonText}>
                                {selectedStartDate.toDateString()}
                            </Text>
                        </TouchableOpacity>
                        <DateTimePickerModal
                            isVisible={isStartDatePickerVisible}
                            mode="date"
                            onConfirm={handleConfirmStartDate}
                            onCancel={() => setStartDatePickerVisibility(false)}
                            date={selectedStartDate}
                        />

                        {isMultipleDays && (
                            <>
                                <TouchableOpacity
                                    style={styles.dateButton}
                                    onPress={() => setEndDatePickerVisibility(true)}
                                >
                                    <Text style={styles.dateButtonText}>
                                        {selectedEndDate.toDateString()}
                                    </Text>
                                </TouchableOpacity>
                                <DateTimePickerModal
                                    isVisible={isEndDatePickerVisible}
                                    mode="date"
                                    onConfirm={handleConfirmEndDate}
                                    onCancel={() => setEndDatePickerVisibility(false)}
                                    date={selectedEndDate}
                                />
                            </>
                        )}
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Daily Doses</Text>
                        <TouchableOpacity
                            style={styles.doseButton}
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
                        title={`How often do you take ${props.medicationName} per day?`}
                    />
                </ScrollView>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.cancelButton} onPress={props.cancelToggle}>
                        <Text style={styles.buttonText}>Cancel</Text>
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
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    switchLabel: {
        fontSize: 16,
    },
    dateButton: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    dateButtonText: {
        fontSize: 16,
        textAlign: 'center',
    },
    doseButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 8,
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
})