import RealmItem from "../components/RealmItem";
import WikiLink from "../components/WikiLink";
import useFormContext from "../hooks/use-form-context";
import { realms } from "../data/tables/realms";

function RealmPage() {
  const { realm, selectRealm } = useFormContext();

  const handleRealmSelect = (r) => {
    if (r === realm) {
      selectRealm(null);
    } else {
      selectRealm(r);
    }
  };

  const renderedLogos = realms.map((r) => {
    return (
      <RealmItem
        key={r.name}
        realm={r}
        onSelect={handleRealmSelect}
        selectedRealm={realm}
      />
    );
  });

  const content = realm ? (
    <div>
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-semibold">{realm.name}</h1>
        <div className="italic opacity-50 text-sm">{realm.subtitle}</div>
        <div className="flex items-center">
          <div className="flex justify-end">
            <WikiLink path={["almanac", "realms", realm.link]} />
          </div>
          <div className="m-2 mt-4">
            <div className="border-l-2 m-2 pl-2 text-left">{realm.desc}</div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="italic opacity-50">Select a realm</div>
  );

  return (
    <div className="flex flex-col mt-6">
      <div className="flex justify-center items-center mb-1">
        {renderedLogos}
      </div>
      <div className="text-center">{content}</div>
    </div>
  );
}

export default RealmPage;
