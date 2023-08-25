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

    const renderedSkills =
        skills?.length > 0
            ? skills
                  .filter((s) => {
                      let num = parseInt(s.name.split(" ").slice(-1));
                      if (!num) {
                          return true;
                      } else {
                          let name = s.name.split(" ").slice(0, -1).join(" ");
                          return !skills
                              .map((skill) => skill.name)
                              .includes(name + " " + (num + 1));
                      }
                  })
                  .map((s) => s.name)
                  .join(delimiter)
                  .toString()
            : "None";

    return (
        <ReviewPageWrapper>
            <ReviewPaneWrapper>
                <ContentPane mobileShow={true}>
                    <div className='flex flex-col items-center mt-2 gap-2'>
                        <div>
                            <h2 className='text-xl leading-6'>
                                {heroName ? heroName : "Nameless Hero"}
                            </h2>
                            <ReviewSubtitles>
                                {realmFull ? realmFull.citizen : "Realmless"}
                                {archetypes ? " " + archetypes : ""}
                            </ReviewSubtitles>
                            {graces && (
                                <ReviewSubtitles>
                                    {graces.map((g) => (
                                        <>
                                            {g.name + ", Graced By " + g.sphere}
                                        </>
                                    ))}
                                </ReviewSubtitles>
                            )}
                        </div>
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
            <ReviewReminder>Don't forget to submit!</ReviewReminder>
        </ReviewPageWrapper>
    );
}

export default ReviewPage;
