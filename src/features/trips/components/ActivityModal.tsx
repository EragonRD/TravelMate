import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { activitySchema, ActivitySchema } from '../schemas/activitySchema';
import { Activity } from '../types';

interface ActivityModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: ActivitySchema) => Promise<void>;
    initialData?: Activity | null;
}

export const ActivityModal = ({ visible, onClose, onSubmit, initialData }: ActivityModalProps) => {
    const { control, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<ActivitySchema>({
        resolver: zodResolver(activitySchema),
        defaultValues: {
            title: '',
            date: new Date().toISOString().split('T')[0],
            category: 'Visit',
            location: '',
        },
    });

    useEffect(() => {
        if (visible && initialData) {
            setValue('title', initialData.title);
            setValue('date', initialData.date);
            setValue('category', initialData.category);
            setValue('location', initialData.location || '');
        } else if (visible) {
            reset({
                title: '',
                date: new Date().toISOString().split('T')[0],
                category: 'Visit',
                location: '',
            });
        }
    }, [visible, initialData, setValue, reset]);

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <Text style={styles.title}>{initialData ? 'Modifier Activité' : 'Nouvelle Activité'}</Text>

                    <Controller
                        control={control}
                        name="title"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={styles.input}
                                placeholder="Titre"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                    />
                    {errors.title && <Text style={styles.error}>{errors.title.message}</Text>}

                    <Controller
                        control={control}
                        name="date"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={styles.input}
                                placeholder="Date (YYYY-MM-DD)"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                    />
                    {errors.date && <Text style={styles.error}>{errors.date.message}</Text>}

                    <Controller
                        control={control}
                        name="category"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={styles.input}
                                placeholder="Catégorie"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                    />
                    {errors.category && <Text style={styles.error}>{errors.category.message}</Text>}

                    <Controller
                        control={control}
                        name="location"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={styles.input}
                                placeholder="Lieu (Optionnel)"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                    />

                    <View style={styles.actions}>
                        <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancelButton]}>
                            <Text style={styles.buttonText}>Annuler</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleSubmit(onSubmit)}
                            style={[styles.button, styles.submitButton]}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={styles.buttonText}>Enregistrer</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modal: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        fontSize: 16,
    },
    error: {
        color: 'red',
        fontSize: 12,
        marginBottom: 10,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        flex: 1,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#999',
        marginRight: 10,
    },
    submitButton: {
        backgroundColor: '#007AFF',
        marginLeft: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
