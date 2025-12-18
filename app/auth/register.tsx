import { registerSchema, RegisterSchema } from '@/src/features/auth/schemas/authSchemas';
import { useAuthStore } from '@/src/features/auth/stores/useAuthStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
    const router = useRouter();
    const { register: registerUser, isLoading } = useAuthStore();

    const { control, handleSubmit, formState: { errors } } = useForm<RegisterSchema>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterSchema) => {
        try {
            await registerUser(data);
            router.replace('/(tabs)');
        } catch (error: any) {
            Alert.alert('Erreur', error.message || 'Inscription échouée');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>TravelMate</Text>
            <Text style={styles.subtitle}>Inscription</Text>

            <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={styles.input}
                        placeholder="Nom complet"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                )}
            />
            {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

            <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                )}
            />
            {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

            <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={styles.input}
                        placeholder="Mot de passe"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        secureTextEntry
                    />
                )}
            />
            {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

            <TouchableOpacity
                style={styles.button}
                onPress={handleSubmit(onSubmit)}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>S'inscrire</Text>
                )}
            </TouchableOpacity>

            <View style={styles.footer}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.link}>Retour à la connexion</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#333',
    },
    subtitle: {
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 40,
        color: '#666',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        fontSize: 16,
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    link: {
        color: '#007AFF',
        fontWeight: 'bold',
    },
});
