import React, { ComponentPropsWithoutRef, ReactNode } from "react";
import { Link } from "gatsby";
import styled from "styled-components";
import Icon, { Tag, Archive, Time } from "../Icon";

const Content = styled.div`
  border-bottom: 1px solid #eee;
`;

const H2 = styled.h2`
  margin: 5px 0;
  font-size: 16px;
`;

const LinkS = styled(Link)`
  color: #434343;
  text-decoration: none;
  &:hover,
  &:focus,
  &:active {
    color: #777;
  }
`;

const P = styled.p`
  font-size: 14px;
  color: #777;
  margin: 5px 0;
`;

const Info = styled.p`
  margin: 5px 0;
  color: #333;
  font-size: 12px;
`;

const IconS = styled((props: ComponentPropsWithoutRef<typeof Icon>) => (
  <Icon vertical="middle" size="12px" {...props} />
))`
  margin-right: 1ex;
`;

const InfoItem = styled.span`
  margin-right: 3ex;
`;

interface PostCardProps {
  title: ReactNode;
  path: string;
  createAt: ReactNode;
  excerpt?: string;
  tags?: ReactNode;
  archives?: ReactNode;
}

export default function PostCard(p: PostCardProps) {
  return (
    <Content>
      <H2>
        <LinkS to={p.path}>{p.title}</LinkS>
      </H2>
      <P>{p.excerpt}</P>
      <Info>
        <InfoItem>
          <IconS vertical="middle" size="12px" children={<Time />} />：{p.createAt}
        </InfoItem>

        <InfoItem>
          <IconS vertical="middle" size="12px" children={<Tag />} />：{p.archives}
        </InfoItem>

        <InfoItem>
          <IconS vertical="middle" size="12px" children={<Archive />} />：{p.tags}
        </InfoItem>
      </Info>
    </Content>
  );
}
