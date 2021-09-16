import React, { ComponentPropsWithoutRef, ReactNode } from "react";
import { Link } from "gatsby";
import styled from "styled-components";
import Icon, { Tag, Archive, Time } from "../Icon";

const H2 = styled.h2`
  margin: 5px 0;
  font-size: 16px;
`;

const LinkS = styled(Link)`
  color: ${(p) => p.theme.colors.text.main};
  text-decoration: none;
  &:hover,
  &:focus,
  &:active {
    color: ${(p) => p.theme.colors.text.refer};
  }
`;

const P = styled.p`
  font-size: 14px;
  color: ${(p) => p.theme.colors.text.refer};
  margin: 5px 0;
`;

const Info = styled.p`
  color: #f7917f;
  margin: 5px 0;
  color: ${(p) => p.theme.colors.text.main};
  font-size: 12px;
`;

const IconS = styled((props: ComponentPropsWithoutRef<typeof Icon>) => (
  <Icon vertical="middle" size="12px" fill="#f7917f" {...props} />
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
    <>
      <H2>
        <LinkS to={p.path}>{p.title}</LinkS>
      </H2>
      <P>{p.excerpt}</P>
      <Info>
        <InfoItem>
          <IconS children={<Time />} />：{p.createAt}
        </InfoItem>

        <InfoItem>
          <IconS children={<Tag />} />：{p.archives}
        </InfoItem>

        <InfoItem>
          <IconS children={<Archive />} />：{p.tags}
        </InfoItem>
      </Info>
    </>
  );
}
