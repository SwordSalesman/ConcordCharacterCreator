import useFormContext from "../../../hooks/use-form-context";
import useRealmDetails from "../../../hooks/use-realm-details";
import ContentPane from "../../../components/common/ContentPane/ContentPane";
import {
    ReviewContent,
    ReviewHeader,
    ReviewPageWrapper,
    ReviewPaneWrapper,
    ReviewReminder,
    ReviewSection,
    ReviewSubtitles,
    StyledBorder,
} from "./ReviewPage.style";
import {
    getFullSkillsFromSummary,
    getSummarisedSkillNames,
} from "../../../hooks/use-skill-helper";
const graceData = require("../../../data/tables/graces.json");

function ReviewItem({ label, children }) {
    return (
        <ReviewSection>
            <ReviewHeader>{label}</ReviewHeader>
            <ReviewContent>{children}</ReviewContent>
        </ReviewSection>
    );
}

const delimiter = ", ";

function ReviewPage({ user }) {
    const {
        gamesPlayed,
        realm,
        skills,
        investment,
        invTier,
        invOption,
        invRegion,
        spells,
        crafts,
        potions,
        ceremonies,
        heroName,
        archetype,
        grace,
        warband,
        sect,
        getSimpleForm,
    } = useFormContext();
    const realmFull = useRealmDetails(realm);

    const renderedSkills = getSummarisedSkillNames(skills);

    // This simple check avoids the page crashing during a log in form reset
    if (!spells || !crafts || !potions || !ceremonies) {
        return;
    }

    return (
        <ReviewPageWrapper>
            <ReviewPaneWrapper>
                <ContentPane mobileshow='true'>
                    <div className='flex flex-col items-center mt-2 gap-2'>
                        <div>
                            <h2 className='text-xl leading-6'>
                                {heroName ? heroName : "Nameless Hero"}
                            </h2>
                            <ReviewSubtitles>
                                {realmFull ? realmFull.citizen : "Realmless"}
                                {archetype?.length
                                    ? " " + archetype[0].name
                                    : ""}
                            </ReviewSubtitles>
                            {grace && (
                                <ReviewSubtitles>
                                    {grace.map((g) => {
                                        const fullGrace = graceData.find(
                                            (gd) => gd.name === g.name
                                        );
                                        return (
                                            g.name +
                                            ", Graced By " +
                                            fullGrace.sphere
                                        );
                                    })}
                                </ReviewSubtitles>
                            )}
                        </div>
                        <StyledBorder />
                        <ReviewItem label='Summits attended'>
                            {gamesPlayed}
                        </ReviewItem>
                        {investment && (
                            <ReviewItem label='Investment'>
                                {invOption && invOption[0]
                                    ? invOption[0].name + " "
                                    : ""}
                                {investment.map((i) => i.name).toString()}
                                {invRegion && invRegion[0]
                                    ? " in " + invRegion[0].name
                                    : ""}
                            </ReviewItem>
                        )}
                        {(warband || sect) && <StyledBorder />}
                        {warband && (
                            <ReviewItem label='Warband'>{warband}</ReviewItem>
                        )}
                        {sect && <ReviewItem label='Sect'>{sect}</ReviewItem>}
                        <StyledBorder />
                        <ReviewItem label='Skills'>{renderedSkills}</ReviewItem>
                        {spells.length > 0 && (
                            <ReviewItem label='Spells'>
                                {spells.map((s) => s.name).join(delimiter)}
                            </ReviewItem>
                        )}
                        {crafts.length > 0 && (
                            <ReviewItem label='Crafts'>
                                {crafts.map((s) => s.name).join(delimiter)}
                            </ReviewItem>
                        )}
                        {potions.length > 0 && (
                            <ReviewItem label='Potions'>
                                {potions.map((s) => s.name).join(delimiter)}
                            </ReviewItem>
                        )}
                        {ceremonies.length > 0 && (
                            <ReviewItem label='Ceremonies'>
                                {ceremonies.map((s) => s.name).join(delimiter)}
                            </ReviewItem>
                        )}
                    </div>
                </ContentPane>
            </ReviewPaneWrapper>
            {/* <ReviewReminder>Don't forget to submit!</ReviewReminder> */}
        </ReviewPageWrapper>
    );
}

export default ReviewPage;
