import toast from "react-hot-toast";
import { Button } from "../common/Button/Button";
import { saveGroupList } from "@/hooks/use-firebase";

export function UploadGroupList() {
	return (
		<Button
			variant="outline"
			size="sm"
			onClick={() => {
				toast.promise(
					saveGroupList({
						list: {
							bands: [
								{ realm: "Andash", name: "Al-Safir" },
								{ realm: "Andash", name: "Clan Jadis" },
								{ realm: "Andash", name: "The Bevanese" },
								{ realm: "Lerona Mere", name: "Alta Marea" },
								{ realm: "Lerona Mere", name: "The Mudlarks" },
								{ realm: "Lerona Mere", name: "The Ga'Toni's" },
								{
									realm: "Lerona Mere",
									name: "Voyants Wandering Emporium",
								},
								{ realm: "Kingdom of Bordevar", name: "House Eldermere" },
								{ realm: "Kingdom of Bordevar", name: "House Greenguard" },
								{
									realm: "Kingdom of Bordevar",
									name: "The House of Silverguard",
								},
								{
									realm: "Kingdom of Bordevar",
									name: "House Thorne of Bordevar",
								},
								{
									realm: "Kingdom of Bordevar",
									name: "Noble House Mon'star",
								},
								{ realm: "Kingdom of Bordevar", name: "Order of Avalon" },
								{ realm: "Kingdom of Bordevar", name: "The Jackalopes" },
								{
									realm: "Kingdom of Bordevar",
									name: "The Knights of the Everguarde",
								},
								{
									realm: "Kingdom of Bordevar",
									name: "The Order of The Cruel Shepherd",
								},
								{
									realm: "Greenweald Baronies",
									name: "Chronisten der Mahlströme",
								},
								{ realm: "Greenweald Baronies", name: "Crimson Haven" },
								{
									realm: "Greenweald Baronies",
									name: "Crows of Cleansing Steel",
								},
								{
									realm: "Greenweald Baronies",
									name: "Crows of The Sanguine Stone",
								},
								{
									realm: "Greenweald Baronies",
									name: "The Hearthbanished of Einfell Hollow",
								},
								{
									realm: "Greenweald Baronies",
									name: "The Penitent Blades",
								},
								{
									realm: "Greenweald Baronies",
									name: "The War-Forged Souls",
								},
								{
									realm: "Greenweald Baronies",
									name: "The Whispervein Enclave",
								},
								{ realm: "Greenweald Baronies", name: "Vaffenschmied" },
								{
									realm: "Greenweald Baronies",
									name: "Weavers of the Grove",
								},
								{ realm: "Iron Valley", name: "The Scaled" },
								{ realm: "Iron Valley", name: "The Troupe of the Valley" },
								{ realm: "Iron Valley", name: "The Valley Vipers" },
								{ realm: "Iron Valley", name: "The Iron Wolves" },
								{ realm: "Iron Valley", name: "The Gilded Stag" },
								{ realm: "Iron Valley", name: "The Ironhide Mining Clan" },
							],
							sects: [],
						},
					}),
					{
						success: "Group list uploaded!",
						error: "Failed to upload group list",
						loading: "Uploading group list...",
					},
				);
			}}
		>
			<p>Upload groupList</p>
		</Button>
	);
}
