import React,{useState} from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Calendar as MainCalendar } from 'react-native-calendars'
import DropDownPicker from 'react-native-dropdown-picker'

export default function Calendar(): JSX.Element {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        {label: 'Week', value: 'week'},
        {label: 'Month', value: 'month'}
    ]);
    return (
        <View>
            <View style={styles.sectionBreak}/>
            <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            placeholder="Month"
            hideSelectedItemIcon={true}
            setItems={setItems}
            style={styles.viewPicker}
            />
            <MainCalendar onDayPress={() => {/*Render the detailed information for that day*/}}/>
            <View style={styles.dailyDataHeader}>
                <Text style={styles.dailyDataHeaderText}>Daily Data</Text>
                <View style={styles.dailyDataHeaderLineSeperator}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    dailyDataHeader: {
        alignItems: 'center',
        padding: 10
    },
    dailyDataHeaderText: {
        fontSize: 20
    },
    dailyDataHeaderLineSeperator: {
        borderBottomColor: "black", 
        borderBottomWidth: 1, 
        width: '100%',
        paddingTop: 10
    },
    sectionBreak: {
        width: '100%',
        paddingTop: 50
    },
    viewPicker: {
        width: '30%',
        height: '10%',
        left: 5
    }
})