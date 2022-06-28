import React from "react";
import { Link } from "gatsby";
import styled from "styled-components";
import StyleLink from "../StyleLink";

interface FrontAndBackPagesProps {
  prev?: string;
  next?: string;
}

/** 上下页翻页器 */
export default function FrontAndBackPages(p: FrontAndBackPagesProps) {
  return (
    <Container>
      {p.prev && <Prev children={<StyleLink to={p.prev}>上一篇：{p.prev.split("/").pop()}</StyleLink>} />}
      {p.next && <Next children={<StyleLink to={p.next}>下一篇：{p.next.split("/").pop()}</StyleLink>} />}
    </Container>
  );
}

const Container = styled.div`
  display: flow-root;
`;

const Prev = styled.div`
  float: left;
`;

const Next = styled.div`
  float: right;
`;
