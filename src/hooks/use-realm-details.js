import { realms } from "../data/tables/realms";

function useRealmDetails(name) {
  return realms.find((r) => r.name === name);
}

export default useRealmDetails;
