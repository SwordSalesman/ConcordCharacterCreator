import useFormContext from "../../hooks/use-form-context";
import ContentPane from "../common/ContentPane";

const border = (
  <div className="w-full h-[2px] m-1 bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
);

function ReviewItem({ label, children }) {
  return (
    <div className="flex w-full justify-between">
      <div className="italic text-left mr-3">{label}</div>
      <div className="text-right">{children}</div>
    </div>
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
    archetype,
    warband,
    sect,
  } = useFormContext();

  return (
    <div className="flex justify-center">
      <ContentPane background={realm ? realm.image : null}>
        <div className="flex flex-col items-center mt-2">
          <div className="text-xl leading-6">
            {heroName ? heroName : "Nameless Hero"}
          </div>
          <div className="italic opacity-70">
            {realm ? realm.name : "Realmless"}
            {archetype ? " " + archetype : ""}
          </div>
          {border}
          <ReviewItem label="Summits attended">{gamesPlayed}</ReviewItem>
          {investments && (
            <ReviewItem label="Investment">
              {investments.map((i) => i.name).toString()}
            </ReviewItem>
          )}
          {(warband || sect) && border}
          {warband && <ReviewItem label="Warband">{warband}</ReviewItem>}
          {sect && <ReviewItem label="Sect">{sect}</ReviewItem>}
          {border}
          <ReviewItem label="Skills">
            {skills?.length > 0
              ? skills.map((s) => " " + s.name).toString()
              : "None"}
          </ReviewItem>
          {spells.length > 0 && (
            <ReviewItem label="Spells">
              {spells.map((s) => " " + s.name).toString()}
            </ReviewItem>
          )}
          {crafts.length > 0 && (
            <ReviewItem label="Crafts">
              {crafts.map((s) => " " + s.name).toString()}
            </ReviewItem>
          )}
          {potions.length > 0 && (
            <ReviewItem label="Potions">
              {potions.map((s) => " " + s.name).toString()}
            </ReviewItem>
          )}
          {ceremonies.length > 0 && (
            <ReviewItem label="Ceremonies">
              {ceremonies.map((s) => " " + s.name).toString()}
            </ReviewItem>
          )}
        </div>
      </ContentPane>
    </div>
  );
}

export default ReviewPage;
