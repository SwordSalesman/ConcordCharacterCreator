import { useTheme } from "styled-components";
import useRealmDetails from "./use-realm-details";

export default function useRealmImage(name) {
    const realmFull = useRealmDetails(name);
    return realmFull ? realmFull.image : null;
}
