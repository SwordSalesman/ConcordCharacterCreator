import Head from "next/head";

export function PageMeta() {
	const title = "Concord Character Creator";
	const description = "Register your Concordian Hero with this interactive form.";
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
