import { PENDING } from "../../../helpers/constants";
import {
    ApprovalStatus,
    CharacterListWrapper,
    ListItem,
    ListItemRow,
    ListItemTitle,
    TitleGradient,
} from "./CharacterList.style";

function CharacterList({ characters, handleSelect, activeCharacter }) {
    const renderedList =
        characters.length > 0
            ? characters.map((c, i) => {
                  const active =
                      activeCharacter?.heroName === c.heroName &&
                      activeCharacter?.email === c.email;
                  return (
                      <ListItem
                          key={i}
                          onClick={() => handleSelect(c)}
                          active={active}
                      >
                          <ListItemTitle>
                              <TitleGradient active={active} />
                              <b>{c.heroName}</b>
                          </ListItemTitle>
                          <ListItemRow>
                              <p>{c.player}</p>
                              <p>{c.date}</p>
                          </ListItemRow>
                          <ApprovalStatus>
                              {c.approval?.status ?? PENDING}
                          </ApprovalStatus>
                      </ListItem>
                  );
              })
            : null;
    // <p style={{ textAlign: "center", paddingTop: "20px" }}>
    //     Loading submissions...
    // </p>

    return <CharacterListWrapper>{renderedList}</CharacterListWrapper>;
}

export default CharacterList;
