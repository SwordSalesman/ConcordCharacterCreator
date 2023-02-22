import { useContext } from "react";
import FormContext from "../context/formContext";

function useFormContext() {
  return useContext(FormContext);
}

export default useFormContext;
