import React, { useState} from 'react'
import { Text, View, StyleSheet, Button} from 'react-native'
import Modal from "react-native-modal"
import DateTimePickerModal from "react-native-modal-datetime-picker";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import NumericInput from 'react-native-numeric-input'

export default function NewMedicationModal(): JSX.Element {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.warn("A date has been picked: ", date);
    hideDatePicker();
  };

  return (
        <View>
          <Modal isVisible={true}>
            <View style={{ flex: 1, backgroundColor: 'white', padding: 20, borderRadius: 10}}>
              <Text style={styles.text}>Selected Medication:</Text>
              <Text style={styles.medicationName}>Sample</Text>
              {/* TODO: Add the name of the selected medication. */}
              <Text style={styles.text}>Start Date:</Text>
              <View>
                <Button title="Select Start Date" onPress={showDatePicker} />
                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
                />
              </View>
              <Text style={styles.text}>End Date:</Text>
              <View>
                <Button title="Select End Date" onPress={showDatePicker} />
                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
                />
              </View>
              {/* TODO: Add weekly checkbox options. */}
              <Text style={styles.text}>Set Weekday Frequency:</Text>
              <BouncyCheckbox
                  size={25}
                  fillColor= '#5838B4'
                  unfillColor="#FFFFFF"
                  text="Monday"
                  iconStyle={{ borderColor: "white" }}
                  innerIconStyle={{ borderWidth: 2, borderRadius: 8}}
                  textStyle={{ textDecorationLine: "none", fontFamily: "JosefinSans-Regular" }}
                  onPress={(isChecked: boolean) => {}}
              />
                            <BouncyCheckbox
                  size={25}
                  fillColor= '#5838B4'
                  unfillColor="#FFFFFF"
                  text="Tuesday"
                  iconStyle={{ borderColor: "white" }}
                  innerIconStyle={{ borderWidth: 2, borderRadius: 8}}
                  textStyle={{ textDecorationLine: "none" }}
                  onPress={(isChecked: boolean) => {}}
              />
                            <BouncyCheckbox
                  size={25}
                  fillColor= '#5838B4'
                  unfillColor="#FFFFFF"
                  text="Wednesday"
                  iconStyle={{ borderColor: "white" }}
                  innerIconStyle={{ borderWidth: 2, borderRadius: 8}}
                  textStyle={{ textDecorationLine: "none", fontFamily: "JosefinSans-Regular" }}
                  onPress={(isChecked: boolean) => {}}
              />
                            <BouncyCheckbox
                  size={25}
                  fillColor= '#5838B4'
                  unfillColor="#FFFFFF"
                  text="Thursday"
                  iconStyle={{ borderColor: "white" }}
                  innerIconStyle={{ borderWidth: 2, borderRadius: 8}}
                  textStyle={{ textDecorationLine: "none", fontFamily: "JosefinSans-Regular" }}
                  onPress={(isChecked: boolean) => {}}
              />
                            <BouncyCheckbox
                  size={25}
                  fillColor= '#5838B4'
                  unfillColor="#FFFFFF"
                  text="Friday"
                  iconStyle={{ borderColor: "white" }}
                  innerIconStyle={{ borderWidth: 2, borderRadius: 8}}
                  textStyle={{ textDecorationLine: "none", fontFamily: "JosefinSans-Regular" }}
                  onPress={(isChecked: boolean) => {}}
              />
                            <BouncyCheckbox
                  size={25}
                  fillColor= '#5838B4'
                  unfillColor="#FFFFFF"
                  text="Saturday"
                  iconStyle={{ borderColor: "white" }}
                  innerIconStyle={{ borderWidth: 2, borderRadius: 8}}
                  textStyle={{ textDecorationLine: "none", fontFamily: "JosefinSans-Regular" }}
                  onPress={(isChecked: boolean) => {}}
              />
                            <BouncyCheckbox
                  size={25}
                  fillColor= '#5838B4'
                  unfillColor="#FFFFFF"
                  text="Sunday"
                  iconStyle={{ borderColor: "white" }}
                  innerIconStyle={{ borderWidth: 2, borderRadius: 8}}
                  textStyle={{ textDecorationLine: "none", fontFamily: "JosefinSans-Regular" }}
                  onPress={(isChecked: boolean) => {}}
              />
              <Text style={styles.text}>How Often?</Text>
              {/* TODO: Add options for frequency per day. */}
              <NumericInput onChange={value => console.log(value)} />
            </View>
          </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: 16
    },
    medicationName: {
      textAlign: 'center',
      fontSize: 24,
      color: '#5838B4'
    }
})