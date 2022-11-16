interface NotesModel {
    text: string,
    feature: 'medication' | 'moodAndEnergy' | 'sleep'
    medicationID?: string
}