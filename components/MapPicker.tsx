import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, MapPressEvent, Region } from 'react-native-maps';
import { useThemeStore } from '@/src/features/settings/stores/useThemeStore';
import { useThemeColor } from './Themed';

interface MapPickerProps {
    visible: boolean;
    onClose: () => void;
    onSelectLocation: (coordinate: { latitude: number; longitude: number }) => void;
    initialRegion?: Region;
}



export default function MapPicker({ visible, onClose, onSelectLocation, initialRegion }: MapPickerProps) {
    const { getEffectiveColorScheme } = useThemeStore();
    const theme = getEffectiveColorScheme() ?? 'light';
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const borderColor = theme === 'dark' ? '#333' : '#eee';
    const iconColor = theme === 'dark' ? '#fff' : '#333';

    const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);

    const handlePress = (e: MapPressEvent) => {
        setSelectedLocation(e.nativeEvent.coordinate);
    };

    const handleConfirm = () => {
        if (selectedLocation) {
            onSelectLocation(selectedLocation);
            onClose();
        }
    };

    return (
        <Modal visible={visible} animationType="slide">
            <View style={[styles.container, { backgroundColor }]}>
                <View style={[styles.header, { borderBottomColor: borderColor }]}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <FontAwesome name="times" size={24} color={iconColor} />
                    </TouchableOpacity>
                    <Text style={[styles.title, { color: textColor }]}>Choisir un emplacement</Text>
                    <TouchableOpacity onPress={handleConfirm} style={styles.confirmButton} disabled={!selectedLocation}>
                        <FontAwesome name="check" size={24} color={selectedLocation ? "#007AFF" : "#ccc"} />
                    </TouchableOpacity>
                </View>
                <MapView
                    style={styles.map}
                    onPress={handlePress}
                    initialRegion={initialRegion || {
                        latitude: 48.8566,
                        longitude: 2.3522,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    {selectedLocation && (
                        <Marker coordinate={selectedLocation} />
                    )}
                </MapView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 50, // Safe area top
        borderBottomWidth: 1,

    },
    closeButton: {
        padding: 10,
    },
    confirmButton: {
        padding: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    map: {
        flex: 1,
    },
});
