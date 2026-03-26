import { GroupContext } from "@/context/groupContext";
import { useContext } from "react";

function useGroupContext() {
	return useContext(GroupContext);
}

export default useGroupContext;
