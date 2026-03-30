import { Realm } from "@/data/tables/realms";
import toast from "react-hot-toast";

export function copyText(text: string) {
	navigator.clipboard.writeText(text);
	toast.success(`Copied '${text}' to clipboard`);
}

export function realmicPlayerGroupsLink(realm?: Realm) {
	if (!realm) return "Player_Groups";

	if (realm === "Greenweald Baronies") {
		return "Player_Groups_in_the_Greenweald_Baronies";
	}
	return `Player_Groups_in_${realm?.replaceAll(" ", "_")}`;
}
