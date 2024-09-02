import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type MedicationContextType = {
  medications: MedicationModel[];
  updateMedications: () => void;
};

export interface MedicationModel {
  id: string;
  name: string;
  dateRange: ['', ''];
  notes: string;
  dailyDoses: number;
}

const MedicationContext = createContext<MedicationContextType | undefined>(undefined);

export const MedicationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [medications, setMedications] = useState<MedicationModel[]>([]);

  const updateMedications = async () => {
    try {
      const medicationScreenHash = await AsyncStorage.getItem('medicationScreen');
      if (medicationScreenHash) {
        const parsedMedicationScreen = JSON.parse(medicationScreenHash);
        const updatedMedications = Object.entries(parsedMedicationScreen).map(([id, value]) => {
          try {
            let medication: MedicationModel;
            if (typeof value === 'string') {
              medication = JSON.parse(value);
            } else if (typeof value === 'object' && value !== null) {
              medication = value as MedicationModel;
            } else {
              throw new Error('Invalid medication data');
            }
            return { ...medication, id };
          } catch (parseError) {
            console.error(`Error parsing medication with id ${id}:`, parseError);
            return null;
          }
        }).filter((med): med is MedicationModel & { id: string } => med !== null);
        setMedications(updatedMedications);
      } else {
        setMedications([]);
      }
    } catch (e) {
      console.error("Error updating medications:", e);
      setMedications([]);
    }
  };

  useEffect(() => {
    updateMedications();
  }, []);

  return (
    <MedicationContext.Provider value={{ medications, updateMedications }}>
      {children}
    </MedicationContext.Provider>
  );
};

export const useMedication = () => {
  const context = useContext(MedicationContext);
  if (context === undefined) {
    throw new Error('useMedication must be used within a MedicationProvider');
  }
  return context;
};
