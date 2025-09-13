// src/styled.d.ts
import "styled-components";
import { CustomTheme } from "./Theme.styled"; // Adjust path as needed

declare module "styled-components" {
	export interface DefaultTheme extends CustomTheme {}
}
