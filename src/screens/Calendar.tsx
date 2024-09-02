import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { StatusBar, SafeAreaView, StyleSheet, Text, ScrollView, Image } from 'react-native';
import { Agenda, CalendarProvider } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import debounce from 'lodash/debounce';

export default function Calendar(): JSX.Element {
    const initialDate = useMemo(() => new Date().toISOString().substring(0, 10), []);
    const [currentDateSelected, setCurrentDateSelected] = useState(initialDate);
    const [medications, setMedications] = useState<MedicationModel[]>([]);
    const [sleepData, setSleepData] = useState<any>(null);
    const [moodAndEnergy, setMoodAndEnergy] = useState<any>(null);
    const [formattedMedicationsState, setFormattedMedicationsState] = useState<string>('');
    const [dataCache, setDataCache] = useState<Record<string, any>>({});

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

            setDataCache(prev => ({
                ...prev,
                [date]: { medications: meds, sleepData: sleep, moodAndEnergy: moodEnergy }
            }));
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }, []);

    const debouncedFetchData = useMemo(() => debounce(fetchData, 300), [fetchData]);

    useFocusEffect(
        useCallback(() => {
            const refreshData = async () => {
                const date = currentDateSelected;
                setDataCache({}); // Clear the cache
                await fetchData(date); // Fetch fresh data
            };
            refreshData();
        }, [currentDateSelected, fetchData])
    );

    const formattedMedications = useMemo(() => {
        const currentDate = new Date(currentDateSelected);
        currentDate.setHours(0, 0, 0, 0); // Set time to midnight for accurate date comparison
        return medications
            .filter(med => {
                if (!med || !med.dateRange) return false;
                const startDate = new Date(med.dateRange[0]);
                const endDate = new Date(med.dateRange[1]);
                startDate.setHours(0, 0, 0, 0); // Set time to midnight for accurate date comparison
                endDate.setHours(0, 0, 0, 0); // Set time to midnight for accurate date comparison
                
                // Check if it's a single-day medication
                const isSingleDay = startDate.getTime() === endDate.getTime();
                
                // For single-day medications, only check if the current date matches
                if (isSingleDay) {
                    return currentDate.getTime() === startDate.getTime();
                }
                return currentDate.getTime() >= startDate.getTime() && 
                    currentDate.getTime() <= endDate.getTime();
            })
            .map(med => `${med.name} (${med.dailyDoses} dose${med.dailyDoses > 1 ? 's' : ''})`)
            .join('\n');
    }, [medications, currentDateSelected]);

    useEffect(() => {
        setFormattedMedicationsState(formattedMedications);
    }, [formattedMedications]);

    return (
        <SafeAreaView style={styles.container}>
            <CalendarProvider date={currentDateSelected}>             
                <Agenda
                    renderList={() => <DailyData
                        date={currentDateSelected}
                        medications={medications}
                        sleepData={sleepData}
                        moodAndEnergy={moodAndEnergy}
                        formattedMedications={formattedMedications}
                    />}
                    onDayPress={(day) => setCurrentDateSelected(day.dateString)}
                    hideExtraDays
                    theme={{
                        agendaKnobColor: '#5838B4',
                        calendarBackground: 'black',
                        selectedDayBackgroundColor: "#5838B4",
                        monthTextColor: 'white',
                        todayTextColor: '#5838B4',
                        dayTextColor: 'white',
                    }}
                />
            </CalendarProvider> 
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
        console.log("Raw medication data:", medicationScreenHash);
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
                        return parsed as MedicationModel;
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

function DailyData({ date, medications, sleepData, moodAndEnergy, formattedMedications }): JSX.Element {
    const monthNames = useMemo(() => [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ], []);

    const dayText = date.slice(-2).replace(/^0/, '');
    const dateText = `${monthNames[parseInt(date.substring(5, 7), 10) - 1]} ${dayText}, ${date.substring(0, 4)}`;

    return (
        <SafeAreaView style={styles.dailyDataContainer}>
            <Text style={styles.dateHeading}>{dateText}</Text>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <DataSection title="Sleep" data={sleepData} imageSource={require('../../assets/SleepNavigationIcon.png')} />
                <DataSection title="Medications" data={formattedMedications} imageSource={require('../../assets/PillNavigationIcon.png')} />
                <DataSection title="Mood/Energy" data={moodAndEnergy} imageSource={require('../../assets/MoodNavigationIcon.png')} />
            </ScrollView>
        </SafeAreaView>
    );
}

function DataSection({ title, data, imageSource }): JSX.Element {
    return (
        <View style={styles.dataSection}>
            <View style={styles.dataSectionHeader}>
                <Image style={styles.imageFormat} source={imageSource} />
                <Text style={styles.titleText}>{title}</Text>
            </View>
            <Text style={styles.otherText}>
                {data ? formatData(data) : "No data available"}
            </Text>
        </View>
    );
}

function formatData(data: any): string {
    if (typeof data === 'string') {
        return data.replace(/\\n/g, '\n');
    }
    if (Array.isArray(data)) {
        return data.map(item => item.toString()).join('\n');
    }
    return JSON.stringify(data, null, 2);
}

const styles = StyleSheet.create({
    container: {
        marginTop: StatusBar.currentHeight,
        height: '100%',
    },
    dataSection: {
        backgroundColor: '#5838B4',
        padding: 10,
        marginBottom: 10,
        borderRadius: 8,
    },
    dataSectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    titleText: {
        paddingLeft: 10,
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    imageFormat: {
        width: 24,
        height: 24,
    },
    otherText: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 16,
        paddingLeft: 34,
    },
    dateHeading: {
        fontWeight: 'bold',
        padding: 10,
        textAlign: 'center',
        fontSize: 24,
        color: 'black',
    },
    dailyDataContainer: {
        flex: 1,
        paddingHorizontal: 10,
    },
    scrollViewContent: {
        flexGrow: 1,
    },
});
