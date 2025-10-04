import { Creator } from "@/components/creator/Creator";
import ContentWrapper from "@/components/layout/ContentWrapper";
import { FormContextProvider } from "@/context/formContext";

export default function Hero() {
	return (
		<ContentWrapper>
			<Creator />
		</ContentWrapper>
	);
}
