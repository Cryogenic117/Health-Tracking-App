import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface NumericInputModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (value: number) => void;
  initialValue: number;
  title: string;
}

const NumericInputModal: React.FC<NumericInputModalProps> = ({
  isVisible,
  onClose,
  onSave,
  initialValue,
  title,
}) => {
  const [value, setValue] = useState(initialValue);

  const increment = () => setValue((prev) => prev + 1);
  const decrement = () => setValue((prev) => Math.max(prev - 1, 0));

  const handleSave = () => {
    onSave(value);
    onClose();
  };

  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={decrement} style={styles.button}>
              <Ionicons name="remove-circle" size={40} color="#5838B4" />
            </TouchableOpacity>
            <Text style={styles.valueText}>{value}</Text>
            <TouchableOpacity onPress={increment} style={styles.button}>
              <Ionicons name="add-circle" size={40} color="#5838B4" />
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onClose} style={styles.actionButton}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} style={styles.actionButton}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    padding: 10,
  },
  valueText: {
    fontSize: 24,
    marginHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    backgroundColor: '#5838B4',
    padding: 10,
    borderRadius: 5,
    width: '40%',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default NumericInputModal;