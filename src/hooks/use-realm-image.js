import { useTheme } from "styled-components";
import useRealmDetails from "./use-realm-details";

export default function useRealmImage(name) {
  const realmFull = useRealmDetails(name);
  const lightTheme = useTheme().name === "light";
  return realmFull ? (lightTheme ? realmFull.image : realmFull.imageInv) : null;
}
