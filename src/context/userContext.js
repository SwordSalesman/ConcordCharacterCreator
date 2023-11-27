import { createContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, getUserDetails } from "../hooks/use-firebase";
import React from "react";

const UserContext = createContext();

function UserContextProvider({ children }) {
    const [user] = useAuthState(auth);
    const [name, setName] = useState("");
    const [role, setRole] = useState(4);
    const [isAdmin, setIsAdmin] = useState(false);

    async function resolveName() {
        const details = await getUserDetails();
        setName(details.name);
        setRole(details.role);
        setIsAdmin(details.role < 3);
    }

    useEffect(() => {
        if (user) {
            resolveName();
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
