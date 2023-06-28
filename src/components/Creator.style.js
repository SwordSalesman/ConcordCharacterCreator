import { styled } from "styled-components";

// "m-6 w-9/10 min-w-[400px] max-w-[800px] h-[500px] drop-shadow-xl p-2 bg-slate-100 rounded-2xl"
export const CreatorWrapper = styled.div`
  margin: auto;

  width: 90%;
  min-width: 300px;
  max-width: 600px;

  border-style: solid;
`;

// "flex justify-center mb-1 border-b-0 border-gray-200 w-full";
export const TabsWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2px;
`;

// "h-[400px] flex justify-center items-center text-center"
export const ContentWrapper = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  align-items: center;
  height: 400px;
`;

export const NavigationPaneWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;
