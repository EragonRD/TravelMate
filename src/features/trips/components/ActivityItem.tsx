import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Activity } from '../types';

interface ActivityItemProps {
    activity: Activity;
    onEdit: (activity: Activity) => void;
    onDelete: (activityId: number) => void;
}

export const ActivityItem = ({ activity, onEdit, onDelete }: ActivityItemProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.info}>
                <Text style={styles.title}>{activity.title}</Text>
                <Text style={styles.details}>
                    {new Date(activity.date).toLocaleDateString()} • {activity.category}
                </Text>
                {activity.location && <Text style={styles.location}>📍 {activity.location}</Text>}
            </View>
            <View style={styles.actions}>
                <TouchableOpacity onPress={() => onEdit(activity)} style={styles.actionBtn}>
                    <FontAwesome name="pencil" size={20} color="#007AFF" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onDelete(activity.id)} style={styles.actionBtn}>
                    <FontAwesome name="trash" size={20} color="#FF3B30" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    info: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    details: {
        color: '#666',
        fontSize: 14,
    },
    location: {
        color: '#888',
        fontSize: 12,
        marginTop: 2,
    },
    actions: {
        flexDirection: 'row',
    },
    actionBtn: {
        padding: 10,
        marginLeft: 5,
    },
});
