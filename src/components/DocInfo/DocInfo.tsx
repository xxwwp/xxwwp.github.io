import React from "react";
import pngCopyright from "../../images/copyright.png";
import styled, { css } from "styled-components";
import Icon from "../Icon";
import Juejin from "../Icon/Juejin";
import { Link } from "gatsby";
import IconEMail from "../Icon/EMail";

const DocInfoStyle = styled.div`
  @media print {
    .issues,
    .right {
      display: none;
    }
  }

  ${({ theme: { colors: c } }) => css`
    margin: 70px 0;
    padding: 1em;
    background-color: ${c.bg.refer};
    border: 1px solid ${c.primary.main};
    box-shadow: 0px 1px 5px ${c.primary.refer};

    ul {
      list-style: none;
      padding-left: 0;
      font-size: 14px;
      margin: 1em 0;
    }
    li {
      line-height: 1.5em;
    }
    a {
      color: ${c.link.main};
      text-decoration: none;
      &:hover,
      &:active,
      &:focus {
        filter: brightness(1.3);
        text-decoration: underline;
      }
    }
    .middle {
      vertical-align: middle;
      margin: 4px;
    }
    .right {
      float: right;
    }
  `}
`;

export interface DocInfoProps {
  // 最后更新时间，按照 git commit 计算
  lastModify?: string;
  // 源码地址
  sourceLink?: string;
  // 标签
  tags?: string[];
  // 归档
  archives?: string[];
  // 历史地址
  historyLink?: string;
  // 创建时间
  createAt: string;
}

export default function DocInfo({ lastModify, sourceLink, archives, tags, historyLink, createAt }: DocInfoProps) {
  const crTip = "署名-非商业性使用-禁止演绎 4.0 国际 (CC BY-NC-ND 4.0)";

  const tagsLink = tags?.map((v, i) => (
    <Link key={i} to={`/search?keyword=${v}`}>
      {v} &nbsp;
    </Link>
  ));

  const archivesLink = archives?.map((v, i) => (
    <Link key={i} to={`/search?keyword=${v}`}>
      {v} &nbsp;
    </Link>
  ));

  return (
    <DocInfoStyle>
      <h2>关于此文档</h2>
      <ul className="info">
        <li className="right">
          <a href={historyLink} target="_blank">
            更新历史
          </a>
          {" - "}
          <a href={sourceLink} target="_blank">
            编辑此文档
          </a>
        </li>
        <li>
          创建于：{createAt} - 最后更新：{lastModify}
        </li>
        <li>
          版权声明：
          <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/" target="_blank">
            <img className="middle" src={pngCopyright} alt={crTip} title={crTip} />
            {crTip}
          </a>
        </li>
        <li>
          询问或联系作者：
          <a href="mailto:842925337@qq.com" target="_blank">
            <Icon size="32px" fill="blue" vertical="middle" children={<IconEMail color="#0096d3" />} />
            <span>842925337@qq.com</span>
          </a>
          ，
          <a href="https://blog.csdn.net/qq_42881675" target="_blank">
            <span>csdn</span>
          </a>
        </li>
      </ul>
      <ul>
        {tagsLink?.length > 0 && <li key="label">标签：{tagsLink}</li>}
        {archivesLink?.length > 0 && <li key="archives">归档：{archivesLink}</li>}
      </ul>
      <p className="issues">
        对这篇文档存在疑惑？你可以通过发起
        <a href="https://github.com/xxwwp/xxwwp.github.io/issues" target="_blank">
          问题
        </a>
        来讨论这篇文档。
      </p>
    </DocInfoStyle>
  );
}
