// import { Creator } from "@/components/creator/Creator";

import { FormContextProvider } from "@/context/formContext";

export default function Home() {
	return (
		<FormContextProvider>
			<p>Home</p>
		</FormContextProvider>
	);
	// return <p>Home</p>;
}
