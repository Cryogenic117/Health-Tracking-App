import React from 'react';
import {View, Text} from 'react-native';
import styles from './styles'

const Navbartext = (prop) => {
    return(
        <Text style={{color:'white'}}>{prop.name}</Text>
    )
}

export default function Navbar(): JSX.Element {
    return (
        <View style={styles.navbar}>
            <Navbartext name={'S'}/>
            <Navbartext name={'M'}/>
            <Navbartext name={'C'}/>
            <Navbartext name={'M'}/>
            <Navbartext name={'S'}/>
        </View>
    );
}