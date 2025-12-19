import { Text, View, useThemeColor } from '@/components/Themed';
import { useThemeStore } from '@/src/features/settings/stores/useThemeStore';
import { useAuthStore } from '@/src/features/auth/stores/useAuthStore';
import { getTripById, updateTrip } from '@/src/features/trips/services/tripsService';
import { formatDate } from '@/src/utils/date';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function EditTripScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { user } = useAuthStore();

    const { getEffectiveColorScheme } = useThemeStore();
    const theme = getEffectiveColorScheme() ?? 'light';
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const inputBg = theme === 'dark' ? '#1c1c1e' : '#f9f9f9';
    const inputBorder = theme === 'dark' ? '#333' : '#ddd';
    const placeholderColor = theme === 'dark' ? '#999' : '#888';
    const iconColor = theme === 'dark' ? '#fff' : '#333';
    const placeholderIconColor = theme === 'dark' ? '#666' : '#ccc';

    // State
    const [title, setTitle] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [image, setImage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [originalTrip, setOriginalTrip] = useState<any>(null);

    // Date Picker state
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    useEffect(() => {
        fetchTrip();
    }, [id]);

    const fetchTrip = async () => {
        try {
            const data = await getTripById(Number(id));
            if (user?.id !== data.userId) {
                Alert.alert('Erreur', 'Vous n\'êtes pas autorisé à modifier ce voyage');
                router.back();
                return;
            }
            setOriginalTrip(data);
            setTitle(data.title);
            setStartDate(new Date(data.startDate));
            setEndDate(new Date(data.endDate));
            setImage(data.image || '');
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de charger les données du voyage');
            router.back();
        } finally {
            setIsLoading(false);
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.7,
            base64: true,
        });

        if (!result.canceled && result.assets[0].base64) {
            setImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
        }
    };

    const handleUpdate = async () => {
        if (!title.trim()) {
            Alert.alert('Erreur', 'Le titre est obligatoire');
            return;
        }

        setIsSaving(true);
        try {
            await updateTrip({
                ...originalTrip,
                title,
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0],
                image: image,
            });
            Alert.alert('Succès', 'Voyage modifié avec succès !');
            router.back();
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de modifier le voyage');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <FontAwesome name="arrow-left" size={24} color={iconColor} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: textColor }]}>Modifier le Voyage</Text>
                <View style={{ width: 24 }} />
            </View>

            <TouchableOpacity onPress={pickImage} style={[styles.imagePicker, { backgroundColor: inputBg }]}>
                {image ? (
                    <Image source={{ uri: image }} style={styles.imagePreview} />
                ) : (
                    <View style={styles.placeholder}>
                        <FontAwesome name="camera" size={40} color={placeholderIconColor} />
                        <Text style={styles.placeholderText}>Changer la photo de couverture</Text>
                    </View>
                )}
            </TouchableOpacity>

            <View style={styles.form}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Titre du voyage</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: inputBg, borderColor: inputBorder, color: textColor }]}
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Ex: Roadtrip en Californie"
                        placeholderTextColor={placeholderColor}
                    />
                </View>

                <View style={styles.row}>
                    <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                        <Text style={styles.label}>Début</Text>
                        <TouchableOpacity onPress={() => setShowStartPicker(true)} style={[styles.dateInput, { backgroundColor: inputBg, borderColor: inputBorder }]}>
                            <Text style={{ color: textColor }}>{formatDate(startDate.toISOString())}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
                        <Text style={styles.label}>Fin</Text>
                        <TouchableOpacity onPress={() => setShowEndPicker(true)} style={[styles.dateInput, { backgroundColor: inputBg, borderColor: inputBorder }]}>
                            <Text style={{ color: textColor }}>{formatDate(endDate.toISOString())}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {(showStartPicker || showEndPicker) && (
                    <DateTimePicker
                        value={showStartPicker ? startDate : endDate}
                        mode="date"
                        display="default"
                        onChange={(event: any, selectedDate: Date | undefined) => {
                            if (showStartPicker) setShowStartPicker(false);
                            if (showEndPicker) setShowEndPicker(false);
                            if (selectedDate) {
                                if (showStartPicker) setStartDate(selectedDate);
                                else setEndDate(selectedDate);
                            }
                        }}
                    />
                )}

                <TouchableOpacity onPress={handleUpdate} style={styles.createButton} disabled={isSaving}>
                    {isSaving ? <ActivityIndicator color="#fff" /> : <Text style={styles.createButtonText}>Enregistrer les modifications</Text>}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 40,
    },
    backButton: {
        padding: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    imagePicker: {
        width: '100%',
        height: 200,
        borderRadius: 15,
        overflow: 'hidden',
        marginBottom: 30,
    },
    imagePreview: {
        width: '100%',
        height: '100%',
    },
    placeholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        marginTop: 10,
        color: '#888',
    },
    form: {
        flex: 1,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        marginBottom: 8,
        fontWeight: '600',
        color: '#888',
    },
    input: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dateInput: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
    },
    createButton: {
        backgroundColor: '#007AFF',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
        elevation: 2,
    },
    createButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
});
