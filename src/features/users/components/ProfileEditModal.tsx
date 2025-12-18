import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useAuthStore } from '@/src/features/auth/stores/useAuthStore';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

interface ProfileEditModalProps {
    visible: boolean;
    onClose: () => void;
}

export const ProfileEditModal = ({ visible, onClose }: ProfileEditModalProps) => {
    const { user, updateProfile, isLoading } = useAuthStore();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState('https://via.placeholder.com/150');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (user && visible) {
            setName(user.name || '');
            setEmail(user.email || '');
            setAvatar(user.avatar || 'https://via.placeholder.com/150');
            setPassword('');
        }
    }, [user, visible]);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
            base64: true,
        });

        if (!result.canceled && result.assets[0].base64) {
            const imageUri = `data:image/jpeg;base64,${result.assets[0].base64}`;
            setAvatar(imageUri);
        }
    };

    const handleSave = async () => {
        try {
            await updateProfile({
                name,
                email,
                avatar,
                ...(password ? { password } : {}),
            });
            Alert.alert('Succès', 'Profil mis à jour');
            onClose();
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de mettre à jour le profil');
        }
    };

    const inputStyle = {
        backgroundColor: colors.cardBackground,
        borderColor: colors.border,
        color: colors.text,
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Modifier le profil</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <FontAwesome name="times" size={24} color={colors.text} />
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
                        <Image source={{ uri: avatar }} style={styles.avatar} />
                        <View style={styles.editIcon}>
                            <FontAwesome name="camera" size={16} color="white" />
                        </View>
                    </TouchableOpacity>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nom complet / Pseudo</Text>
                        <TextInput
                            style={[styles.input, inputStyle]}
                            value={name}
                            onChangeText={setName}
                            placeholderTextColor={colors.tabIconDefault}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={[styles.input, inputStyle]}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            placeholderTextColor={colors.tabIconDefault}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nouveau mot de passe (laisser vide pour conserver)</Text>
                        <TextInput
                            style={[styles.input, inputStyle]}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={true}
                            placeholder="******"
                            placeholderTextColor={colors.tabIconDefault}
                        />
                    </View>

                    <TouchableOpacity onPress={handleSave} style={styles.saveButton} disabled={isLoading}>
                        {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Enregistrer</Text>}
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 5,
    },
    content: {
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 30,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    editIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#007AFF',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'white',
    },
    inputGroup: {
        width: '100%',
        marginBottom: 20,
    },
    label: {
        color: '#666',
        marginBottom: 5,
        fontSize: 14,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: '#007AFF',
        width: '100%',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
