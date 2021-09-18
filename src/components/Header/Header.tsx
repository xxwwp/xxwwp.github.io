import React from "react";
import { Link } from "gatsby";
import styled, { css } from "styled-components";

const Box = styled.header`
  ${({ theme: { colors: c } }) => css`
    background: linear-gradient(to bottom right, ${c.secondary.main}, ${c.primary.main});
    color: white;
  `}
`;

const Nav = styled.nav`
  display: flex;
  align-items: flex-end;
  max-width: 1200px;
  padding: 10px 20px;
  margin: auto;
  a {
    color: white;
    margin: 0 10px;
    text-decoration: none;
    position: relative;

    &:hover,
    &:active {
      color: ${(p) => p.theme.colors.primary.refer};
    }

    &.active::after {
      content: "";
      position: absolute;
      bottom: -10px;
      left: -5px;
      right: -5px;
      height: 5px;
      border-radius: 2.5px;
      background-color: ${(p) => p.theme.colors.yellow.refer};
    }
  }
`;

const Title = styled.div`
  font-size: 1.8rem;
  margin-right: 20px;
`;

const navs = [
  {
    path: "/post-list",
    name: "文章列表",
  },
  {
    path: "/search",
    name: "检索",
  },
];

export default function Header() {
  console.log(location.pathname);

  return (
    <Box>
      <Nav>
        <Title>玄晓乌屋</Title>
        {navs.map((v) => (
          <Link key={v.path} to={v.path} className={v.path === location.pathname && "active"}>
            {v.name}
          </Link>
        ))}
      </Nav>
    </Box>
  );
}
