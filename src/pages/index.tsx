import { PageProps } from "gatsby";
import * as React from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Root from "../components/Root/Root";
import Helmet from "react-helmet";

interface IndexProps extends PageProps {}

export default function Index({ location }: IndexProps) {
  return (
    <Root>
      <Header location={location} />
      <Helmet title="玄晓乌屋"></Helmet>
      <Content>
        <Heading1>玄晓乌屋</Heading1>
        <List>
          <LItem children={<Logo />} />
          <LItem children={"to"} />
          <LItem style={{ filter: "url(#feTurbulence)" }} children={<Logo />} />
        </List>
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          width="0"
          height="0"
          viewBox="0 0 10 10"
        >
          <defs>
            <filter id="feTurbulence">
              <feTurbulence
                baseFrequency="0.03"
                numOctaves="1"
                seed="7"
                stitchTiles="noStitch"
                type="fractalNoise"
                result="turbulenceResult"
              ></feTurbulence>
              <feColorMatrix in="turbulenceResult" type="hueRotate" values="0" result="hueRotateResult">
                <animate attributeName="values" from="0" to="360" dur="6s" repeatCount="indefinite" />
              </feColorMatrix>
              <feDisplacementMap
                in="SourceGraphic"
                in2="hueRotateResult"
                scale="50"
                xChannelSelector="R"
                yChannelSelector="R"
                result="dispResult"
              ></feDisplacementMap>
              <feOffset in="dispResult" dx="-0.3" dy="-0.3"></feOffset>
            </filter>
          </defs>
        </svg>
      </Content>
    </Root>
  );
}

const Content = styled.main`
  text-align: center;
  color: ${(p) => p.theme.colors.secondary.refer};
  letter-spacing: 0.8em;
`;

const Heading1 = styled.h1`
  font-size: 30px !important;
  font-weight: normal;
`;

const List = styled.ul`
  padding-left: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const LItem = styled.li`
  letter-spacing: 0;
  color: silver;
  svg {
    width: 200px;
    height: 200px;
  }
`;

function Logo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
      <circle r="45" cx="50" cy="50" fill="#a3e4ff" stroke="#10baff" strokeWidth="5"></circle>
      <path d="M20 20 c55 0,30 50,60 60 c-55 0,-30 -50,-60 -60" fill="white"></path>
      <path d="M10 60 Q40 35 ,90 40 Q 60 65,10 60" fill="#10baff"></path>
      <text
        x={50}
        y={50}
        textAnchor="middle"
        fill="#10baff"
        strokeWidth={1}
        stroke="white"
        fontWeight="bold"
        dominantBaseline="middle"
        fontSize={14}
      >
        玄
      </text>
    </svg>
  );
}
