import { createContext, useContext, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../config/supabase';
import { Colaborador, fromDatabase } from '../models/Schema';
import type { Colaborador as ColaboradorType } from '../types';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    profile: ColaboradorType | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    profile: null,
    loading: true,
    signOut: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<ColaboradorType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('AuthContext: Initializing...');
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            console.log('AuthContext: getSession result', { hasSession: !!session });
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                console.log('AuthContext: Fetching profile for user', session.user.id);
                fetchProfile(session.user.id);
            } else {
                console.log('AuthContext: No session, setting loading=false');
                setLoading(false);
            }
        });

        // Listen for changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            console.log('AuthContext: Auth state changed', { event: _event, hasSession: !!session });
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setProfile(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from(Colaborador.table)
                .select('*')
                .eq(Colaborador.fields.identificadorUsuario, userId)
                .single();

            if (error) {
                console.error('Error fetching profile:', error);
                // If no profile found, we might want to handle it (e.g. new user not yet linked)
            } else if (data) {
                setProfile(fromDatabase<ColaboradorType>(Colaborador, data));
            }
        } catch (error) {
            console.error('Unexpected error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setProfile(null);
        setUser(null);
        setSession(null);
    };

    return (
        <AuthContext.Provider value={{ user, session, profile, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
