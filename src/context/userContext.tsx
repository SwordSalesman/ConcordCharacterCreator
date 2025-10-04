import { createContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, getUserDetails } from "../hooks/use-firebase";
import React from "react";
import { User } from "firebase/auth";

// This file should be named userContext.tsx for JSX support
const DEFAULT_ROLE = 0;

interface IUserContext {
	user?: User | null;
	loading: boolean;
	name: string;
	role: number;
	isAdmin: boolean;
	error?: Error | undefined;
}

export const UserContext = createContext<IUserContext>({
	user: null,
	loading: true,
	name: "",
	role: DEFAULT_ROLE,
	isAdmin: false,
	error: undefined,
});

export default function UserContextProvider({ children }: { children: React.ReactNode }) {
	const [user, loading, error] = useAuthState(auth);
	const [name, setName] = useState("");
	const [role, setRole] = useState(DEFAULT_ROLE);
	const [isAdmin, setIsAdmin] = useState(false);

	async function updateUserDetails() {
		const details = await getUserDetails();
		if (details) {
			setName(details.name);
			setRole(details.role);
			setIsAdmin(details.role >= 3);
		}
	}

	useEffect(() => {
		if (user) {
			updateUserDetails();
		} else {
			setName("");
			setRole(DEFAULT_ROLE);
			setIsAdmin(false);
		}
	}, [user]);

	const userContext: IUserContext = {
		user,
		loading,
		name,
		role,
		isAdmin,
		error,
	};

	return <UserContext.Provider value={userContext}>{children}</UserContext.Provider>;
}
