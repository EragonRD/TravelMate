import { useState, useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import * as Device from 'expo-device';

try {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: false,
            shouldSetBadge: false,
            shouldShowBanner: true,
            shouldShowList: true,
        }),
    });
} catch (error) {
    console.warn("Notification handler setup failed (expected in Expo Go):", error);
}

// ...

export function usePushNotifications() {
    const [expoPushToken, setExpoPushToken] = useState<string | undefined>(undefined);
    const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
    const notificationListener = useRef<any>(null);
    const responseListener = useRef<any>(null);

    async function registerForPushNotificationsAsync() {
        if (!Device.isDevice) {
            console.log('Must use physical device for Push Notifications');
            return;
        }
        let token;

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        let existingStatus;
        try {
            const { status } = await Notifications.getPermissionsAsync();
            existingStatus = status;
        } catch (e) {
            console.log("Error getting permissions (expected in Expo Go):", e);
            return;
        }

        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            try {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            } catch (e) {
                console.log("Error requesting permissions (expected in Expo Go):", e);
                return;
            }
        }

        if (finalStatus !== 'granted') {
            // User refused permissions
            return;
        }

        // Learn more about projectId:
        // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
        try {
            // We just want to get the permissions for now as per plan
            // token = (await Notifications.getExpoPushTokenAsync({ projectId: '...' })).data;
            // console.log(token);
        } catch (e: any) {
            console.log(`${e}`);
        }

        return token;
    }

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            notificationListener.current && notificationListener.current.remove();
            responseListener.current && responseListener.current.remove();
        };
    }, []);

    const requestPermissions = async () => {
        await registerForPushNotificationsAsync();
    };

    return {
        expoPushToken,
        notification,
        requestPermissions
    };
}
