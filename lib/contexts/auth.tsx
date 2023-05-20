import { createContext, useState, useContext, useEffect, ReactNode } from 'react'
import { useLocalStorage } from '../hooks/localstorage';

//api here is an axios instance which has the baseURL set according to the env.
import api from '../api';
import LoginPage from '@/pages/login';
import { useRouter } from 'next/router';
import { AxiosError } from 'axios';

type LoginSession = {
    username: string,
    token: string,
    admin: boolean,
};

const AuthContext = createContext({} as {
    isAuthenticated: boolean,
    isAdmin: boolean,
    isLoading: boolean,
    user: string,
    login: (username: string, password: string) => Promise<boolean>,
    logout: () => void,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {

    const [loading, setLoading] = useState(true);
    const [apiHasToken, setApiHasToken] = useState(false);
    const [session, setSession] = useLocalStorage<LoginSession>("ckpt_session", { username: '', token: '', admin: false });
    const router = useRouter();

    useEffect(() => {
        async function loadUserFromStorage() {
            console.log("loadUserFromStorage()");
            if (session && session.token != '') {
                console.log("Found token in session");
                api.defaults.headers.Authorization = `CKPT ${session.token}`;
                setApiHasToken(true);
            }
            setLoading(false);
        }
        loadUserFromStorage();
    }, [session]);

    const login = async (username: string, password: string): Promise<boolean> => {
        try {
            const { data } = await api.post('/login', { username: username, password: password })
            if (data.apikey) {
                console.log("Got token from login");
                api.defaults.headers.Authorization = `CKPT ${data.apikey}`;
                setApiHasToken(true);
                setSession({ "username": username, token: data.apikey, admin: data.admin });
                return true;
            }
            console.log("Unexpected data in login response: ", data)
            return false;
        } catch (err) {
            console.log("Error on login: ", err);
            return false;
        }
    };

    const logout = () => {
        setSession(undefined);
        delete api.defaults.headers.Authorization;
        router.replace("/login");
    };


    return (
        <AuthContext.Provider value={{ isAuthenticated: (!loading && apiHasToken && session && session.token != ''), isAdmin: (session && session.admin), user: session ? session.username : '', login, isLoading: loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext)

export const ProtectRoute = ({ children }: { children: ReactNode }) => {
    const { isAuthenticated, isAdmin, isLoading } = useAuth();
    const router = useRouter();
    if (isLoading) {
        return <></>; // TODO: LoadingPage component?
    }
    if (!isAuthenticated && window.location.pathname !== '/login') {
        router.push({
            pathname: "/login",
            query: { from: router.asPath },
        });
        return <p>Redirecting...</p>; // TODO: LoadingPage component?
    }
    if (!isAdmin && window.location.pathname.startsWith('/admin/')) {
        router.push({
            pathname: "/",
        });
        return <p>Redirecting...</p>; // TODO: LoadingPage component?
    }
    return <>{children}</>;
};