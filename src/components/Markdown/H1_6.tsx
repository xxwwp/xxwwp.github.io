import React from "react";

const H1_6 = {};

[1, 2, 3, 4, 5, 6].forEach(
  (level) =>
    (H1_6[`h${level}`] = ({ children, ...rest }) =>
      React.createElement(`h${level}`, { id: children, ...rest }, [
        <a key={children} href={`#${children}`}>
          {children}
        </a>,
      ]))
);

export default H1_6;
