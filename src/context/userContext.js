import { createContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, getUserDetails } from "../hooks/use-firebase";
import React from "react";

const DEFAULT_ROLE = 0;

const UserContext = createContext();

function UserContextProvider({ children }) {
    const [user] = useAuthState(auth);
    const [name, setName] = useState("");
    const [role, setRole] = useState(DEFAULT_ROLE);
    const [isAdmin, setIsAdmin] = useState(false);

    async function updateUserDetails() {
        const details = await getUserDetails();
        setName(details.name);
        setRole(details.role);
        setIsAdmin(details.role >= 3);
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

    const userContext = {
        user,
        name,
        role,
        isAdmin,
    };

    return (
        <UserContext.Provider value={userContext}>
            {children}
        </UserContext.Provider>
    );
}

export { UserContextProvider };
export default UserContext;
