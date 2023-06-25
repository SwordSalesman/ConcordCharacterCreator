import Creator from "./components/Creator";
import IntroPage from "./components/intro/IntroPage";
import RealmPage from "./components/realm/RealmPage";
import SkillsPage from "./components/skills/SkillsPage";
import OptionsPage from "./components/options/OptionsPage";
import BackgroundPage from "./components/background/BackgroundPage";
import ReviewPage from "./components/review/ReviewPage";
import { StyledApp } from "./styles/Global";
import { useState } from "react";
import { ThemeProvider } from "styled-components";
import { light, dark } from "./styles/Theme.styled";
import Button from "./components/common/Button/Button";
import { BiAdjust } from "react-icons/bi";

const tabs = [
  { name: "Intro", content: <IntroPage /> },
  { name: "Realm", content: <RealmPage /> },
  { name: "Skills", content: <SkillsPage /> },
  { name: "Options", content: <OptionsPage /> },
  { name: "Background", content: <BackgroundPage /> },
  { name: "Review", content: <ReviewPage /> },
];

function App() {
  const [theme, setTheme] = useState(light);

  const toggleTheme = () => {
    if (theme === light) {
      setTheme(dark);
    } else {
      setTheme(light);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <StyledApp>
        <Creator tabs={tabs} toggleTheme={toggleTheme} />
      </StyledApp>
    </ThemeProvider>
  );
}

export default App;
