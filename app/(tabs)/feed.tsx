import { View } from '@/components/Themed';
import { FeedPost } from '@/src/features/feed/components/FeedPost';
import { Stories } from '@/src/features/feed/components/Stories';
import { useTrips } from '@/src/features/trips/hooks/useTrips';
import React from 'react';
import { FlatList, StyleSheet } from 'react-native';

export default function FeedScreen() {
    const { trips, refresh } = useTrips();

    return (
        <View style={styles.container}>
            <FlatList
                data={trips}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <FeedPost trip={item} />}
                ListHeaderComponent={<Stories trips={trips} />}
                onRefresh={refresh}
                refreshing={false}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
