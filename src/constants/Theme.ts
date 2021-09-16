interface Color {
  main?: string;
  refer?: string;
}

export interface ThemeType {
  colors?: {
    primary?: Color;
    secondary?: Color;
    bg?: Color;
    text?: Color;
    link?: Color;
    green?: Color;
    yellow?: Color;
    black?: Color;
  };
}

const Theme: ThemeType = {
  colors: {
    primary: {
      main: "#e375ff",
      refer: "#f8dbff",
    },
    secondary: {
      main: "#ff35c9",
      refer: "#f3c2ff",
    },
    bg: {
      main: "#fff",
      refer: "#f5f5f5",
    },
    text: {
      main: "#424242",
      refer: "#666",
    },
    link: {
      main: "#8a82fd",
      refer: "#b0aafc",
    },
    green: {
      main: "#68d167",
      refer: "#478d46",
    },
    yellow: {
      main: "#d29d07",
      refer: "#fdca8c",
    },
    black: {
      main: "#20232a",
      refer: "#282c34",
    },
  },
};

export default Theme;
