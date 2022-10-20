import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import Modal from "react-native-modal"

export default function NewMedicationModal(): JSX.Element {
    return (
        <View>
          <Modal isVisible={true}>
            <View style={{ flex: 1, backgroundColor: 'white', padding: 20, borderRadius: 10}}>
              <Text style={styles.text}>Selected Medication:</Text>
              {/* TODO: Add the name of the selected medicaiton. */}
              <Text style={styles.text}>Set Medication Usage:</Text>
              <Text style={styles.text}>Start Date:</Text>
              {/* TODO: Add date picker. */}
              <Text style={styles.text}>End Date:</Text>
              {/* TODO: Add date picker. */}
              {/* TODO: Add weekly checkbox options. */}
              <Text style={styles.text}>How Often?</Text>
              {/* TODO: Add options for frequency per day. */}
            </View>
          </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: 16
    }
})