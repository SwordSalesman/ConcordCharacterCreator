import { createContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, getUserDetails } from "../hooks/use-firebase";

const UserContext = createContext();

function UserContextProvider({ children }) {
    const [user] = useAuthState(auth);
    const [name, setName] = useState("");
    const [role, setRole] = useState(4);

    async function resolveName() {
        const details = await getUserDetails();
        setName(details.name);
        setRole(details.role);
    }

    useEffect(() => {
        resolveName();
        console.log(user);
    }, [user]);

    const userContext = {
        user,
        name,
        role,
    };

    return (
        <UserContext.Provider value={userContext}>
            {children}
        </UserContext.Provider>
    );
}

export { UserContextProvider };
export default UserContext;
