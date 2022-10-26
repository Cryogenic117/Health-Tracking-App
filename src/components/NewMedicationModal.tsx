import React, { useState } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import BouncyCheckbox from "react-native-bouncy-checkbox"
import Modal from "react-native-modal"
import DateTimePickerModal from "react-native-modal-datetime-picker"
import NumericInput from 'react-native-numeric-input'

export default function NewMedicationModal(): JSX.Element {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
    const [isModalVisibile, setModalVisibility] = useState(true)
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

    const daysOfTheWeek: string[] = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ]
    const mockSelectedMedication = 'Sample'

    return (
        <View>
            <Modal isVisible={isModalVisibile}>
                <View style={styles.modalContainer}>
                    <Text style={styles.text}>Selected Medication:</Text>
                    <Text style={styles.medicationName}>{mockSelectedMedication}</Text>
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
                        {`What days do you take ${mockSelectedMedication}?`}
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
                            onPress={() => {}}
                        />
                    ))}
                    <Text style={styles.text}>
                        {`How often do you take ${mockSelectedMedication} per day?`}
                    </Text>
                    <NumericInput onChange={() => {}} />
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View style={styles.modalActionButton}>            
                            <Button 
                                title='Cancel'
                                color='#5838B4'
                                onPress={() => setModalVisibility(false)}
                            />
                        </View>
                        <View style={styles.modalActionButton}>              
                            <Button
                                title='Save'
                                color='#5838B4'
                                onPress={() => setModalVisibility(false)}
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