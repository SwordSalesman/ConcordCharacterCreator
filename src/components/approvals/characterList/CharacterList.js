import { PENDING } from "../../../helpers/constants";
import {
    ApprovalStatus,
    CharacterListWrapper,
    ListItem,
    ListItemRow,
    ListItemTitle,
    TitleGradient,
} from "./CharacterList.style";

function CharacterList({ characters, handleSelect }) {
    const renderedList =
        characters.length > 0
            ? characters.map((c, i) => {
                  return (
                      <ListItem key={i} onClick={() => handleSelect(c)}>
                          <ListItemTitle>
                              <TitleGradient />
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
