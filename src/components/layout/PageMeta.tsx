import { PATH_HERB_GARDEN } from "@/utils/constants";
import Head from "next/head";
import { useRouter } from "next/router";

export function PageMeta() {
	const { pathname } = useRouter();

	const pathName: Record<string, string> = {
		// "/": "Home",
		"/hero": "Hero",
		"/groups": "Groups",
		"/maintenance": "Maintenance",
		"/approvals": "Approvals",
		[PATH_HERB_GARDEN]: "Herb Garden",
	};

	const name = pathName[pathname];

	const title = `${name ? `${name} | ` : ""}Waystone`;
	const description = "The Portal for Concordian Heroes";
	const image = "https://i.imgur.com/4DM5P9x.png";
	const url = "https://charactercreator.concordlarp.com/";

	return (
		<Head>
			<title>{title}</title>
			<meta property="og:title" content={title} />
			<meta name="description" content={description} />
			<meta property="og:description" content={description} />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<meta property="og:image" content={image} />
			<meta name="twitter:image" content={image} />
			<meta property="og:type" content="website" />
			<meta property="og:url" content={url} />
			<meta property="og:site_name" content={title} />
			<link rel="icon" href="/favicon.ico" />
		</Head>
	);
}
