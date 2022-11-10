import React, { useState } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import BouncyCheckbox from "react-native-bouncy-checkbox"
import Modal from "react-native-modal"
import DateTimePickerModal from "react-native-modal-datetime-picker"
import NumericInput from 'react-native-numeric-input'

export default function NewMedicationModal(props): JSX.Element {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
    const [selectedStartDate, setSelectedStartDate] = useState('')
    const [selectedEndDate, setSelectedEndDate] = useState('')

    const handleConfirmStartDate = (date) => {
        setSelectedStartDate(date)
        setDatePickerVisibility(false)
    }

    const handleConfirmEndDate = (date) => {
        setSelectedEndDate(date)
        setDatePickerVisibility(false)
    }

    const onSavePress = () => {
        const newMedication: Medication = {
            name: props.medicationName,
            startDate: selectedStartDate,
            endDate: selectedEndDate,
            weeklyFrequency: tempWeeklyFrequency,
            dailyDoses: tempDailyDoses,
            notes: ''
        } 
        props.saveToggle(newMedication)
    }

    const daysOfTheWeek: string[] = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ]

    let tempWeeklyFrequency: boolean[] = new Array(7).fill(false)
    let tempDailyDoses: number = 0

    return (
        <View>
            <Modal isVisible={props.isOpen}>
                <View style={styles.modalContainer}>
                    <Text style={styles.text}>Selected Medication:</Text>
                    <Text style={styles.medicationName}>{props.medicationName}</Text>
                    <Text style={styles.text}>{`Start Date: ${selectedStartDate}`}</Text>
                    <Button 
                        title="Select Start Date"
                        color='#5838B4'
                        onPress={() => setDatePickerVisibility(true)}
                    />
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleConfirmStartDate}
                        onCancel={() => setDatePickerVisibility(false)}
                    />
                    <Text style={styles.text}>{`End Date: ${selectedEndDate}`}</Text>
                    <Button 
                        title="Select End Date"
                        color='#5838B4'
                        onPress={() => setDatePickerVisibility(true)}
                    />
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleConfirmEndDate}
                        onCancel={() => setDatePickerVisibility(false)}
                    />
                    <Text style={styles.text}>
                        {`What days do you take ${props.medicationName}?`}
                    </Text>
                    {daysOfTheWeek.map((day, index) => (
                        <BouncyCheckbox
                            key={index}
                            size={25}
                            fillColor= '#5838B4'
                            unfillColor="#FFFFFF"
                            text={day}
                            iconStyle={{ borderColor: "white" }}
                            innerIconStyle={{ borderWidth: 2, borderRadius: 8}}
                            textStyle={{ textDecorationLine: "none", color: 'black' }}
                            onPress={() => {tempWeeklyFrequency[index] = !tempWeeklyFrequency[index]}}
                        />
                    ))}
                    <Text style={styles.text}>
                        {`How often do you take ${props.medicationName} per day?`}
                    </Text>
                    <NumericInput onChange={(value) => {tempDailyDoses = value}} />
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View style={styles.modalActionButton}>            
                            <Button 
                                title='Cancel'
                                color='#5838B4'
                                onPress={props.cancelToggle}
                            />
                        </View>
                        <View style={styles.modalActionButton}>              
                            <Button
                                title='Save'
                                color='#5838B4'
                                onPress={onSavePress}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1, 
        backgroundColor: 'white', 
        padding: 20, 
        borderRadius: 10, 
        justifyContent: 'space-between'
    },
    text: {
        fontSize: 16
    },
    medicationName: {
        textAlign: 'center',
        fontSize: 24,
        color: '#5838B4',
        fontWeight: 'bold'
    },
    modalActionButton: {
        width: 150
    }
})