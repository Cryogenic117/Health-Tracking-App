import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { StyleSheet, Text, ScrollView, View, SafeAreaView, StatusBar } from 'react-native';
import { Calendar as RNCalendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { parseISO, startOfDay, endOfDay } from 'date-fns';
import { useTheme } from '../context/ThemeContext';

interface MedicationModel {
  id: string;
  name: string;
  dateRange: string[];
  dailyDoses: number;
  notes: string;
}

export default function Calendar(): JSX.Element {
    const { isDarkMode } = useTheme();
    const initialDate = useMemo(() => new Date().toISOString().substring(0, 10), []);
    const [currentDateSelected, setCurrentDateSelected] = useState(initialDate);
    const [medications, setMedications] = useState<MedicationModel[]>([]);
    const [sleepData, setSleepData] = useState<any>(null);
    const [moodAndEnergy, setMoodAndEnergy] = useState<any>(null);

    const fetchData = useCallback(async (date: string) => {
        try {
            const [meds, sleep, moodEnergy] = await Promise.all([
                getListOfUserMedications(),
                getSleepDataForDate(date),
                getMoodAndEnergyDataForDate(date)
            ]);

            setMedications(meds || []);
            setSleepData(sleep || null);
            setMoodAndEnergy(moodEnergy || null);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            const refreshData = async () => {
                const date = currentDateSelected;
                await fetchData(date);
            };
            refreshData();
        }, [currentDateSelected, fetchData])
    );

    const formattedMedications = useMemo(() => {
        const currentDate = new Date(currentDateSelected);

        return medications
            .filter(med => {
                if (!med || !med.dateRange) return false;
                const startDate = new Date(med.dateRange[0]);
                const endDate = new Date(med.dateRange[1]);
                
                return currentDate >= startOfDay(startDate) && currentDate <= endOfDay(endDate);
            })
            .map(med => `${med.name} (${med.dailyDoses} dose${med.dailyDoses > 1 ? 's' : ''})`)
            .join('\n');
    }, [medications, currentDateSelected]);

    const markedDates = useMemo(() => {
        const marked = {};

        medications.forEach(med => {
            const startDate = new Date(med.dateRange[0]);
            const endDate = new Date(med.dateRange[1]);
            
            for (let d = startOfDay(startDate); d <= endOfDay(endDate); d.setDate(d.getDate() + 1)) {
                const dateString = d.toISOString().split('T')[0];
                marked[dateString] = { marked: true, dotColor: '#5838B4' };
            }
        });
        marked[currentDateSelected] = { ...marked[currentDateSelected], selected: true, selectedColor: '#5838B4' };
        return marked;
    }, [medications, currentDateSelected]);

    return (
        <SafeAreaView style={[styles.container, isDarkMode && { backgroundColor: '#000000' }]}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
            <View style={[styles.header, isDarkMode && styles.headerDark]}>
                <Text style={[styles.headerTitle, isDarkMode && styles.headerTitleDark]}>Calendar</Text>
            </View>
            <RNCalendar
                current={currentDateSelected}
                onDayPress={(day) => setCurrentDateSelected(day.dateString)}
                markedDates={markedDates}
                theme={{
                    backgroundColor: isDarkMode ? '#000000' : '#ffffff',
                    calendarBackground: isDarkMode ? '#000000' : '#ffffff',
                    textSectionTitleColor: isDarkMode ? '#ffffff' : '#b6c1cd',
                    selectedDayBackgroundColor: '#5838B4',
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: '#5838B4',
                    dayTextColor: isDarkMode ? '#FFFFFF' : '#2d4150',
                    textDisabledColor: isDarkMode ? '#4d4d4d' : '#d9e1e8',
                    dotColor: '#5838B4',
                    selectedDotColor: '#ffffff',
                    arrowColor: isDarkMode ? '#FFFFFF' : '#5838B4',
                    monthTextColor: isDarkMode ? '#FFFFFF' : '#2d4150',
                    textMonthFontWeight: 'bold',
                    textDayFontSize: 16,
                    textMonthFontSize: 16,
                    textDayHeaderFontSize: 14
                }}
            />
            <ScrollView style={[styles.dailyDataContainer, isDarkMode && styles.dailyDataContainerDark]}>
                <DailyData
                    date={currentDateSelected}
                    sleepData={sleepData}
                    moodAndEnergy={moodAndEnergy}
                    formattedMedications={formattedMedications}
                    isDarkMode={isDarkMode}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

async function getListOfUserMedications(): Promise<MedicationModel[]> {
    try {
        const medicationScreenHash = await AsyncStorage.getItem('medicationScreen');
        if (medicationScreenHash === null) {
            console.log("No medication data found");
            return [];
        }
        const parsedHash = JSON.parse(medicationScreenHash);
        if (typeof parsedHash !== 'object' || parsedHash === null) {
            console.error("Invalid medication data format");
            return [];
        }
        return Object.entries(parsedHash).map(([key, value]) => {
            try {
                if (typeof value === 'string') {
                    const parsed = JSON.parse(value);
                    if (parsed && typeof parsed === 'object' && 'name' in parsed) {
                        return { ...parsed, id: key } as MedicationModel;
                    }
                }
            } catch (parseError) {
                console.error(`Error parsing medication for key ${key}:`, parseError);
            }
            return null;
        }).filter((med): med is MedicationModel => med !== null);
    } catch (e) {
        console.error("Error getting user medications:", e);
        return [];
    }
}

async function getSleepDataForDate(date: string): Promise<any> {
    try {
        const sleepScreenHash = await AsyncStorage.getItem('sleepScreen');
        if (sleepScreenHash === null) {
            console.log("No sleep data found");
            return null;
        }
        const parsedHash = JSON.parse(sleepScreenHash);
        if (typeof parsedHash !== 'object' || parsedHash === null) {
            console.error("Invalid sleep data format");
            return null;
        }
        return parsedHash[date] || null;
    } catch (e) {
        console.error("Error getting sleep data:", e);
        return null;
    }
}

async function getMoodAndEnergyDataForDate(date: string): Promise<any> {
    try {
        const moodAndEnergyScreenHash = await AsyncStorage.getItem('moodAndEnergyScreen');
        if (moodAndEnergyScreenHash === null) {
            console.log("No mood and energy data found");
            return null;
        }
        const parsedHash = JSON.parse(moodAndEnergyScreenHash);
        if (typeof parsedHash !== 'object' || parsedHash === null) {
            console.error("Invalid mood and energy data format");
            return null;
        }
        return parsedHash[date] || null;
    } catch (e) {
        console.error("Error getting mood and energy data:", e);
        return null;
    }
}

function DailyData({ date, sleepData, moodAndEnergy, formattedMedications, isDarkMode }): JSX.Element {
    const monthNames = useMemo(() => [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ], []);

    const dayText = date.slice(-2).replace(/^0/, '');
    const dateText = `${monthNames[parseInt(date.substring(5, 7), 10) - 1]} ${dayText}, ${date.substring(0, 4)}`;

    return (
        <View style={[styles.dailyDataContent, isDarkMode && styles.dailyDataContentDark]}>
            <Text style={[styles.dateHeading, isDarkMode && styles.dateHeadingDark]}>{dateText}</Text>
            <DataSection title="Sleep" data={sleepData} icon="moon" isDarkMode={isDarkMode} />
            <DataSection
                title="Medications"
                data={formattedMedications ? formattedMedications.split('\n').map(med => (
                    <Text key={med} style={isDarkMode ? styles.dataSectionContentDark : styles.dataSectionContent}>
                        {med}
                    </Text>
                )) : null}
                icon="medical"
                isDarkMode={isDarkMode}
            />
            <DataSection title="Mood/Energy" data={moodAndEnergy} icon="happy" isDarkMode={isDarkMode} />
        </View>
    );
}

function DataSection({ title, data, icon, isDarkMode }): JSX.Element {
    return (
        <View style={[styles.dataSection, isDarkMode && styles.dataSectionDark]}>
            <View style={styles.dataSectionHeader}>
                <Ionicons name={icon} size={24} color="#5838B4" />
                <Text style={[styles.dataSectionTitle, isDarkMode && styles.dataSectionTitleDark]}>{title}</Text>
            </View>
            {Array.isArray(data) ? (
                data
            ) : (
                <Text style={[styles.dataSectionContent, isDarkMode && styles.dataSectionContentDark]}>
                    {data ? formatData(data) : "No data available"}
                </Text>
            )}
        </View>
    );
}

function formatData(data: any): string | JSX.Element[] {
    if (typeof data === 'string') {
        return data.replace(/\\n/g, '\n');
    }
    if (Array.isArray(data)) {
        return data.map(item => item.toString()).join('\n');
    }
    if (typeof data === 'object' && data !== null) {
        if ('name' in data && 'dailyDoses' in data) {
            // Handle medication object
            return `${data.name} (${data.dailyDoses} dose${data.dailyDoses > 1 ? 's' : ''})`;
        }
        // For other object types, create a formatted string
        return Object.entries(data)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n');
    }
    return JSON.stringify(data, null, 2);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    containerDark: {
        backgroundColor: '#1C1C1E',
    },
    header: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerDark: {
        borderBottomColor: '#2C2C2E',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2d4150',
    },
    headerTitleDark: {
        color: '#FFFFFF',
    },
    dailyDataContainer: {
        flex: 1,
    },
    dailyDataContainerDark: {
        backgroundColor: '#1C1C1E',
    },
    dailyDataContent: {
        padding: 16,
    },
    dailyDataContentDark: {
        backgroundColor: '#1C1C1E',
    },
    dateHeading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#2d4150',
    },
    dateHeadingDark: {
        color: '#FFFFFF',
    },
    dataSection: {
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
    },
    dataSectionDark: {
        backgroundColor: '#2C2C2E',
    },
    dataSectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    dataSectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
        color: '#2d4150',
    },
    dataSectionTitleDark: {
        color: '#FFFFFF',
    },
    dataSectionContent: {
        fontSize: 14,
        color: '#4a4a4a',
    },
    dataSectionContentDark: {
        color: '#FFFFFF',
    },
});
