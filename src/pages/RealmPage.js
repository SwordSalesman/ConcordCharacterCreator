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
      <div>
        <h1 className="text-3xl font-semibold">{realm.name}</h1>
        <div className="italic opacity-50 text-sm">{realm.subtitle}</div>
        <div className="my-4">{realm.desc}</div>
      </div>
      {realm.link ? (
        <div className="flex justify-end">
          <WikiLink path={["almanac", "realms", realm.link]} />
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
