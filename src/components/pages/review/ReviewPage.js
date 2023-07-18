import useFormContext from "../../../hooks/use-form-context";
import useRealmDetails from "../../../hooks/use-realm-details";
import useRealmImage from "../../../hooks/use-realm-image";
import ContentPane from "../../../components/common/ContentPane/ContentPane";
import {
    ReviewContent,
    ReviewHeader,
    ReviewPageWrapper,
    ReviewSection,
    ReviewSubtitles,
    StyledBorder,
} from "./ReviewPage.style";

function ReviewItem({ label, children }) {
    return (
        <ReviewSection>
            <ReviewHeader>{label}</ReviewHeader>
            <ReviewContent>{children}</ReviewContent>
        </ReviewSection>
    );
}

function ReviewPage() {
    const {
        gamesPlayed,
        realm,
        skills,
        investments,
        spells,
        crafts,
        potions,
        ceremonies,
        heroName,
        archetypes,
        graces,
        warband,
        sect,
    } = useFormContext();
    const realmFull = useRealmDetails(realm);
    const realmImage = useRealmImage(realm);

    return (
        <ReviewPageWrapper>
            <ContentPane
                mobileShow={true}
                imageCenter={true}
                background={realmFull ? realmImage : null}
            >
                <div className='flex flex-col items-center mt-2'>
                    <div className='text-xl leading-6'>
                        {heroName ? heroName : "Nameless Hero"}
                    </div>
                    <ReviewSubtitles>
                        {realmFull ? realmFull.citizen : "Realmless"}
                        {archetypes ? " " + archetypes : ""}
                    </ReviewSubtitles>
                    {graces && (
                        <ReviewSubtitles>
                            {graces.map((g) => (
                                <>{g.name + ", Graced By " + g.sphere}</>
                            ))}
                        </ReviewSubtitles>
                    )}
                    <StyledBorder />
                    <ReviewItem label='Summits attended'>
                        {gamesPlayed}
                    </ReviewItem>
                    {investments && (
                        <ReviewItem label='Investment'>
                            {investments.map((i) => i.name).toString()}
                        </ReviewItem>
                    )}
                    {(warband || sect) && <StyledBorder />}
                    {warband && (
                        <ReviewItem label='Warband'>{warband}</ReviewItem>
                    )}
                    {sect && <ReviewItem label='Sect'>{sect}</ReviewItem>}
                    <StyledBorder />
                    <ReviewItem label='Skills'>
                        {skills?.length > 0
                            ? skills.map((s) => " " + s.name).toString()
                            : "None"}
                    </ReviewItem>
                    {spells.length > 0 && (
                        <ReviewItem label='Spells'>
                            {spells.map((s) => " " + s.name).toString()}
                        </ReviewItem>
                    )}
                    {crafts.length > 0 && (
                        <ReviewItem label='Crafts'>
                            {crafts.map((s) => " " + s.name).toString()}
                        </ReviewItem>
                    )}
                    {potions.length > 0 && (
                        <ReviewItem label='Potions'>
                            {potions.map((s) => " " + s.name).toString()}
                        </ReviewItem>
                    )}
                    {ceremonies.length > 0 && (
                        <ReviewItem label='Ceremonies'>
                            {ceremonies.map((s) => " " + s.name).toString()}
                        </ReviewItem>
                    )}
                </div>
            </ContentPane>
        </ReviewPageWrapper>
    );
}

export default ReviewPage;
