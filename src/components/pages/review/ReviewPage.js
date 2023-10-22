import useFormContext from "../../../hooks/use-form-context";
import useRealmDetails from "../../../hooks/use-realm-details";
import ContentPane from "../../../components/common/ContentPane/ContentPane";
import {
    InvalidWarning,
    ReviewContent,
    ReviewHeader,
    ReviewPageWrapper,
    ReviewPaneWrapper,
    ReviewSection,
    ReviewSubtitles,
    StyledBorder,
} from "./ReviewPage.style";
import { getSummarisedSkillNames } from "../../../hooks/use-skill-helper";
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
        invOption,
        invRegion,
        invTerritory,
        spells,
        crafts,
        potions,
        ceremonies,
        heroName,
        archetype,
        grace,
        warband,
        sect,
        validateForm,
    } = useFormContext();
    const realmFull = useRealmDetails(realm);

    const { valid, validRealm, validName, validInvestment } = validateForm();

    const renderedSkills = getSummarisedSkillNames(skills);

    // This simple check avoids the page crashing during a log in form reset
    if (!spells || !crafts || !potions || !ceremonies) {
        return;
    }

    console.debug({
        gamesPlayed: gamesPlayed,
        realm: realm,
        skills: skills,
        investment: investment,
        invOption: invOption,
        invRegion: invRegion,
        invTerritory: invTerritory,
        spells: spells,
        crafts: crafts,
        potions: potions,
        ceremonies: ceremonies,
        heroName: heroName,
        archetype: archetype,
        grace: grace,
        warband: warband,
        sect: sect,
    });

    const invalidWarning = (
        <InvalidWarning>
            <p>Before you submit, fill in the following: </p>
            <ul>
                {!validName ? <li> - Hero Name</li> : null}
                {!validRealm ? <li> - Realm</li> : null}
                {!validInvestment ? <li> - Investment</li> : null}
            </ul>
        </InvalidWarning>
    );

    return (
        <ReviewPageWrapper>
            <ReviewPaneWrapper>
                <ContentPane mobileshow='true'>
                    {!valid ? invalidWarning : null}
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
                                    ? `${invOption[0].name} `
                                    : ""}
                                {investment && investment[0]
                                    ? investment[0].name
                                    : ""}
                                {invTerritory && invTerritory[0]
                                    ? ` in ${invTerritory[0].name}`
                                    : ""}
                                {invRegion && invRegion[0]
                                    ? `, ${invRegion[0].name}`
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
