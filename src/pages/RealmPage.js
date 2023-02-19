import { useState } from "react";
import RealmItem from "../components/RealmItem";
import AndashLogo from "../data/images/realm-logos/Abw.jpg";
import BordevarLogo from "../data/images/realm-logos/Bbw.jpg";
import GreenwealdLogo from "../data/images/realm-logos/Gbw.jpg";
import IronValleyLogo from "../data/images/realm-logos/IVbw.jpg";
import LeronaMereLogo from "../data/images/realm-logos/LMbw.jpg";

const realmData = [
  {
    name: "Andash",
    src: AndashLogo,
    desc: "Andash description",
  },
  {
    name: "Bordevar",
    src: BordevarLogo,
    desc: "Bordevar description",
  },
  {
    name: "Greenweald",
    src: GreenwealdLogo,
    desc: "Greenweald description",
  },
  {
    name: "Iron Valley",
    src: IronValleyLogo,
    desc: "Iron Valley description",
  },
  {
    name: "Lerona Mere",
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
      <h1 className="text-3xl font-semibold">{selectedRealm.name}</h1>
      <div>{selectedRealm.desc}</div>
    </div>
  ) : (
    <div className="italic text-gray-500">Select a realm</div>
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
