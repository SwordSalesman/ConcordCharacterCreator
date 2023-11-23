import { useContext } from "react";
import UserContext from "../context/userContext";

function useUserContext() {
    return useContext(UserContext);
}

export default useUserContext;
