import RealmItem from "./RealmItem";
import WikiLink from "../../common/WikiLink/WikiLink";
import useFormContext from "../../../hooks/use-form-context";
import { realms } from "../../../data/tables/realms";
import useRealmDetails from "../../../hooks/use-realm-details";
import { RealmDescriptionWrapper } from "./RealmPage.style";
import React from "react";

function RealmPage() {
    const { realm, selectRealm } = useFormContext();
    const realmFull = useRealmDetails(realm);

    const handleRealmSelect = (r) => {
        if (r === realmFull) {
            selectRealm(null);
        } else {
            selectRealm(r.name);
        }
    };

    const renderedLogos = realms.map((r) => {
        return (
            <RealmItem
                key={r.name}
                realm={r}
                onSelect={handleRealmSelect}
                selectedRealm={realmFull}
            />
        );
    });

    const content = realmFull ? (
        <div>
            <div className='flex flex-col items-center'>
                <h1 className='text-3xl font-semibold'>{realmFull.name}</h1>
                <div className='italic opacity-80 text-sm'>
                    {realmFull.subtitle}
                </div>
                <div className='flex items-center ml-3'>
                    <div className='flex justify-end'>
                        <WikiLink path={realmFull.link} />
                    </div>
                    <div className=' m-2 ml-1 mt-4'>
                        <RealmDescriptionWrapper>
                            {realmFull.desc}
                        </RealmDescriptionWrapper>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div className='italic opacity-50'>Select a realm</div>
    );

    return (
        <>
            <div className='flex flex-col mt-1 w-full z-10'>
                <div className='flex justify-center items-center mb-8 mt-4'>
                    {renderedLogos}
                </div>
                <div className='text-center'>{content}</div>
            </div>
        </>
    );
}

export default RealmPage;
