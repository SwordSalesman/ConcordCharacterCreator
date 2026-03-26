import { CharacterCreator } from "@/components/characterCreator/CharacterCreator";
import ContentWrapper from "@/components/layout/ContentWrapper";

export default function HeroPage() {
	return (
		<ContentWrapper layout="narrow">
			<CharacterCreator />
		</ContentWrapper>
	);
}
