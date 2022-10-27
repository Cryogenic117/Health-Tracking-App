import React,{useState} from 'react'
import { ScrollView, StatusBar, Text, View } from 'react-native'
import SearchBar from "react-native-dynamic-search-bar"
import NotesButton from '../components/NotesButton'

export default function Medication(): JSX.Element {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const getMedications = async () => {
        try {
            const response = await fetch('https://reactnative.dev/movies.json');
            const json = await response.json();
            setData(json.movies);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }
    console.log(data)
    return (
        <View style={{marginTop: StatusBar.currentHeight, marginBottom: 200}}>
            <SearchBar placeholder='Add a Medication'/>
            <View style={{paddingHorizontal: 20}}>
                <Text style={{fontSize: 30, paddingVertical: 10}}>Your Medications</Text>
                <ScrollView>
                    {data.map((medName, index) => (
                        <View key={index} style={{paddingVertical: 10}}>
                            <Text key={medName.title} style={{fontSize: 20, paddingBottom: 5}}>{medName.title}</Text>
                            <NotesButton/>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </View>
    )
}

const mockData: string[] = [
    "Diazepam (Valium)",
    "Metformin (Riomet)",
    "Mutli-Vitamins",
    "Iron Supplement",
    "Diazepam (Valium)",
    "Metformin (Riomet)",
    "Mutli-Vitamins",
    "Iron Supplement",
    "Diazepam (Valium)",
    "Metformin (Riomet)",
    "Mutli-Vitamins",
    "Iron Supplement",
    "Diazepam (Valium)",
    "Metformin (Riomet)",
    "Mutli-Vitamins",
    "Iron Supplement",
    "Diazepam (Valium)",
    "Metformin (Riomet)",
    "Mutli-Vitamins",
    "Iron Supplement"
]