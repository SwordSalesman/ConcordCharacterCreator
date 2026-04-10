import { FormContext } from "@/context/formContext";
import { useContext } from "react";

function useFormContext() {
	return useContext(FormContext);
}

export default useFormContext;
