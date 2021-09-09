import React from "react";
import pngCopyright from "../../images/copyright.png";
import styled from "styled-components";

const DocInfoStyle = styled.div`
  margin-top: 70px;
  color: #fff;
  padding: 1em;
  background-color: #0a213b;
  ul {
    list-style: none;
    padding-left: 0;
    font-size: 14px;
    margin: 1em 0;
  }
  a {
    color: #8a82fd;
    text-decoration: none;
    &:hover,
    &:active,
    &:focus {
      color: #b0aafc;
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
  .hor-margin {
    margin-left: 0.5em;
    margin-right: 0.5em;
  }
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
}

export default function DocInfo({ lastModify, sourceLink, archives, tags }: DocInfoProps) {
  const crTip = "署名-非商业性使用-禁止演绎 4.0 国际 (CC BY-NC-ND 4.0)";

  const tagsLink = tags?.map((v) => (
    <a className="hor-margin" href={`/search?tag=${v}`}>
      {v}
    </a>
  ));

  const archivesLink = archives?.map((v) => (
    <a className="hor-margin" href={`/search?archive=${v}`}>
      {v}
    </a>
  ));

  return (
    <DocInfoStyle>
      <ul className="info">
        <li></li>
        <li className="right">
          <a href={sourceLink}>编辑此文档</a>
        </li>
        <li>最后更新：{lastModify}</li>
        <li>
          版权声明：
          <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/">
            <img className="middle" src={pngCopyright} alt={crTip} title={crTip} />
            {crTip}
          </a>
        </li>
        <li>
          对这篇文档存在疑惑？你可以通过发起
          <a href="https://github.com/xxwwp/xxwwp.github.io/issues">问题</a>来讨论这篇文档。
        </li>
        <ul>
          <li>标签：{tagsLink}</li>
          <li>归档：{archivesLink}</li>
        </ul>
      </ul>
    </DocInfoStyle>
  );
}
