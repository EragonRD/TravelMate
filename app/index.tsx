import { useAuthStore } from '@/src/features/auth/stores/useAuthStore';
import { Redirect } from 'expo-router';

export default function Index() {
    const { user } = useAuthStore();
    return <Redirect href={user ? '/(tabs)' : '/auth/login'} />;
}
