import "styled-components";
import { ThemeType } from "./constants/Theme";

// and extend them!
declare module "styled-components" {
  export interface DefaultTheme extends ThemeType {}
}
