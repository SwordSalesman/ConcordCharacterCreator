import Accordion from "../components/Accordion";
import ContentPane from "../components/ContentPane";
import useFormContext from "../hooks/use-form-context";

const tabs = [
  {
    label: "Combat",
    content: <div className="text-red-500">'These are the combat skills'</div>,
  },
  {
    label: "Magical",
    content: (
      <div className="text-blue-500">'These are the magical skills'</div>
    ),
  },
  {
    label: "Crafting",
    content: (
      <div>
        <div className="text-black">'These are the crafting skills'</div>
        <div className="text-black">
          'These are the crafting skills blahda woduhaw ufhao wuhfiuwefiua
          erlgyba erlkygb aelrygb lesr bgdryzhvkzdybrhkgudzhbrlkgub zdrkgub
          dr.kvgb zdkrsugvb .KSRh.kS ; ghosrg iusr gi sg js s j s o gj soir gof
          swero jfgsuero gwseoifjojswo eghowe hgoswrh gouwrh gowhr gowhr egs
          oregh osrehogshrhgjshj gosrh go usgo sjg jowierj
          gouiwjhgowhroghweoruhg osuh o oiguwso ijf owi erou wh ouifh woehfw
          ihoegfi wp i'
        </div>
        <div className="text-black">
          'These are the crafting skills blahda woduhaw ufhao wuhfiuwefiua
          erlgyba erlkygb aelrygb lesr bgdryzhvkzdybrhkgudzhbrlkgub zdrkgub
          dr.kvgb zdkrsugvb .KSRh.kS ; ghosrg iusr gi sg js s j s o gj soir gof
          swero jfgsuero gwseoifjojswo eghowe hgoswrh gouwrh gowhr gowhr egs
          oregh osrehogshrhgjshj gosrh go usgo sjg jowierj
          gouiwjhgowhroghweoruhg osuh o oiguwso ijf owi erou wh ouifh woehfw
          ihoegfi wp i'
        </div>
      </div>
    ),
  },
  {
    label: "Religious",
    content: (
      <div className="text-yellow-500">'These are the religios skills'</div>
    ),
  },
  {
    label: "Surgical",
    content: (
      <div className="text-purple-500">'These are the surgical skills'</div>
    ),
  },
];

function SkillsPage() {
  const { realm } = useFormContext();

  return (
    <div>
      <div className="flex">
        <ContentPane background={realm ? realm.image : null}>
          Hey, this is where you would pick your skills. Have a look on the side
          and pick some skills which take your fancy, or don't! I'm not your
          mother.
        </ContentPane>
        <ContentPane>
          <Accordion items={tabs}></Accordion>
        </ContentPane>
      </div>
    </div>
  );
}

export default SkillsPage;
