export interface User {
    id: number;
    email: string;
    name?: string;
    avatar?: string;
}

export interface AuthResponse {
    accessToken: string;
    user: User;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials extends LoginCredentials {
    name?: string;
}
