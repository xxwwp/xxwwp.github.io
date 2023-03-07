import React, { ComponentPropsWithoutRef } from "react";
import { Link } from "gatsby";
import styled, { css } from "styled-components";
import classNames from "classnames";
import { page } from "../../constants/conf";
import { WindowLocation } from "@reach/router";

const Box = styled.header`
  @media print {
    display: none;
  }

  ${({ theme: { colors: c } }) => css`
    /* background: linear-gradient(to bottom right, ${c.secondary.main}, ${c.primary.main}); */
    /* background: ${c.secondary.main}; */
    background: skyblue;
  `}
`;

const Nav = styled.nav`
  display: flex;
  align-items: flex-end;
  max-width: 1200px;
  padding: 10px 20px;
  margin: auto;
  flex-wrap: wrap;

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

const Title = styled(Link)`
  font-size: 1.8rem;
  margin-right: 20px;
  @media screen and (max-width: 500px) {
    width: 100%;
    margin-bottom: 20px;
  }
`;

const navs = [
  {
    path: page.record,
    name: "记录",
  },
  {
    path: page.search,
    name: "检索",
  },
  {
    path: page.draft,
    name: "草稿",
  },
];

interface HeaderProps extends ComponentPropsWithoutRef<"header"> {
  location: WindowLocation;
}

export default function Header({ location }: HeaderProps) {
  return (
    <Box>
      <Nav>
        <Title to="/">玄晓乌屋</Title>
        {navs.map((v) => (
          <Link
            key={v.path}
            to={v.path}
            className={classNames({ active: RegExp("^" + v.path).test(location.pathname) })}
          >
            {v.name}
          </Link>
        ))}
        <a href="https://xxwwp.github.io/jnet-basic/" target="_blank" referrerPolicy="no-referrer">
          # jnet basic
        </a>
      </Nav>
    </Box>
  );
}
