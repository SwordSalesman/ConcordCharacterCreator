import { useState } from "react";
import RealmItem from "../components/RealmItem";
import AndashLogo from "../data/images/realm-logos/Abw.jpg";
import BordevarLogo from "../data/images/realm-logos/Bbw.jpg";
import GreenwealdLogo from "../data/images/realm-logos/Gbw.jpg";
import IronValleyLogo from "../data/images/realm-logos/IVbw.jpg";
import LeronaMereLogo from "../data/images/realm-logos/LMbw.jpg";
import WikiLink from "../components/WikiLink";

const realmData = [
  {
    name: "Andash",
    subtitle: '"My brethren, what can we save from the past?"',
    link: '"andash"',
    src: AndashLogo,
    desc: "Andash description",
  },
  {
    name: "Bordevar",
    subtitle: '"By my steel and by my soul, I will not fail again."',
    link: "bordevar",
    src: BordevarLogo,
    desc: "Bordevar description",
  },
  {
    name: "Greenweald",
    subtitle:
      '"The forest is dark and holds many secrets, but we are the light that seeks the truth."',
    link: "greenweald",
    src: GreenwealdLogo,
    desc: "Greenweald description",
  },
  {
    name: "Iron Valley",
    subtitle: '"We stand together."',
    link: "iron",
    src: IronValleyLogo,
    desc: "Iron Valley description",
  },
  {
    name: "Lerona Mere",
    subtitle: '"Everyone a King! Everyone a Captain!"',
    link: "lerona",
    src: LeronaMereLogo,
    desc: "Lerona Mere description",
  },
];

function RealmPage() {
  const [selectedRealm, setSelectedRealm] = useState(null);

  const handleRealmSelect = (realm) => {
    if (realm === selectedRealm) {
      setSelectedRealm(null);
    } else {
      setSelectedRealm(realm);
    }
  };

  const renderedLogos = realmData.map((realm) => {
    return (
      <RealmItem
        key={realm.name}
        realm={realm}
        onSelect={handleRealmSelect}
        selectedRealm={selectedRealm}
      />
    );
  });

  const content = selectedRealm ? (
    <div>
      <div>
        <h1 className="text-3xl font-semibold">{selectedRealm.name}</h1>
        <div className="italic opacity-50 text-sm">
          {selectedRealm.subtitle}
        </div>
        <div className="my-4">{selectedRealm.desc}</div>
      </div>
      {selectedRealm.link ? (
        <div className="flex justify-end">
          <WikiLink path={["almanac", "realms", selectedRealm.link]} />
        </div>
      ) : null}
    </div>
  ) : (
    <div className="italic opacity-50">Select a realm</div>
  );

  return (
    <div className="flex flex-col">
      <div className="flex justify-center items-center mb-1">
        {renderedLogos}
      </div>
      <div className="text-center">{content}</div>
    </div>
  );
}

export default RealmPage;
