import WikiLink from "../../common/WikiLink/WikiLink";
import useFormContext from "../../../hooks/use-form-context";
import { CivilServiceRealm, RealmData, realms } from "../../../data/tables/realms";
import Image from "next/image";
import { useRouter } from "next/router";

function RealmPage() {
	const { form, setField } = useFormContext();
	const { query } = useRouter();
	const { realm } = form;

	const showCivilService = query.civilservice === "true";
	const realmList: RealmData[] = showCivilService ? [CivilServiceRealm] : realms;

	const realmFull = realmList.find((r) => r.name === realm);

	const handleRealmSelect = (r: RealmData) => {
		if (r === realmFull) {
			setField("realm", undefined);
		} else {
			setField("realm", r.name);
		}
	};

	const renderedLogos = realmList.map((r) => {
		const active = realmFull?.name === r.name;
		return (
			<div
				key={r.name}
				onClick={() => {
					handleRealmSelect(r);
				}}
				className={`
					w-[70px] h-[70px] sm:w-[100px] sm:h-[100px] cursor-pointer
					transition-all duration-200
					brightness-0 dark:invert
					${!active && realmFull ? "blur-[2px] opacity-50" : ""}
					${active ? "scale-[1.35] hover:scale-[1.35]" : "hover:scale-[1.15]"}
					`}
			>
				<Image alt={r.name} src={r.image} width={300} height={300} />
			</div>
		);
	});

	const content = realmFull ? (
		<div>
			<div className="flex flex-col items-center">
				<h1 className="text-3xl font-semibold">{realmFull.name}</h1>
				<div className="italic opacity-80 text-sm">{realmFull.subtitle}</div>
				<div className="flex items-center ml-3">
					<div className="flex justify-end">
						<WikiLink path={realmFull.link} />
					</div>
					<div className=" m-2 ml-1 mt-4">
						<div className="border-l-1 m-2 pl-2 text-left">{realmFull.desc}</div>
					</div>
				</div>
			</div>
		</div>
	) : (
		<div className="italic opacity-50">Select a realm</div>
	);

	return (
		<>
			<div className="flex flex-col mt-1 w-full z-10">
				<div className="flex justify-center items-center mb-8 mt-4">{renderedLogos}</div>
				<div className="text-center">{content}</div>
			</div>
		</>
	);
}

export default RealmPage;
