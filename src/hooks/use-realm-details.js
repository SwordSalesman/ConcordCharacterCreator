import { realms } from "../data/tables/realms";

export default function useRealmDetails(name) {
  return realms.find((r) => r.name === name);
}
