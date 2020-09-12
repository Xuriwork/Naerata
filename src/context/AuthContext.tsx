import Loading from '../components/Loading';
import React, { useEffect, useState } from 'react';
import { auth } from '../services/firebase';

// user: firebase.User | {
// 	username: string | null;
// 	displayName: string | null;
// 	photoURL: string | null;
// };

type AuthContextType = {
	user: any;
	isAuthed: boolean;
	setUser: any;
	loading: boolean;
};

const AuthContext = React.createContext<Partial<AuthContextType>>({});

const AuthProvider = ({ children }: any) => {
	const [user, setUser] = useState<firebase.User | null>(null);
	const [loading, setLoading] = useState(true);
	const isAuthed = !!user;

	useEffect(() => {
		auth.onAuthStateChanged((user) => {
			if (user) {
				setUser(user);
				console.log(user);
				setLoading(false);
			} else {
				setUser(null);
				setLoading(false);
			}
		  });
	}, []);

	if (loading) return <Loading />;

	return (
		<AuthContext.Provider value={{ user, isAuthed, setUser, loading }}>
			{children}
		</AuthContext.Provider>
	);
};

const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
