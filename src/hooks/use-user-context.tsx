import { UserContext } from "@/context/userContext.tsx";
import { useContext } from "react";

function useUserContext() {
	return useContext(UserContext);
}

export default useUserContext;
