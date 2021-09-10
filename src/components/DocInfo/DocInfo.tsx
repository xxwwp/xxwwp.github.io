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
  li {
    line-height: 1.5em;
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
  // 历史地址
  historyLink?: string;
  // 创建时间
  createAt: string;
}

export default function DocInfo({ lastModify, sourceLink, archives, tags, historyLink, createAt }: DocInfoProps) {
  const crTip = "署名-非商业性使用-禁止演绎 4.0 国际 (CC BY-NC-ND 4.0)";

  const tagsLink = tags?.map((v) => (
    <a key={v} className="hor-margin" href={`/search?tag=${v}`}>
      {v}
    </a>
  ));

  const archivesLink = archives?.map((v) => (
    <a key={v} className="hor-margin" href={`/search?archive=${v}`}>
      {v}
    </a>
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
          <a href="https://juejin.cn/user/3069492197065453" target="_blank">
            掘金
          </a>
        </li>
      </ul>
      <ul>
        {tagsLink?.length > 0 && <li>标签：{tagsLink}</li>}
        {archivesLink?.length > 0 && <li>归档：{archivesLink}</li>}
      </ul>
      <p>
        对这篇文档存在疑惑？你可以通过发起
        <a href="https://github.com/xxwwp/xxwwp.github.io/issues" target="_blank">
          问题
        </a>
        来讨论这篇文档。
      </p>
    </DocInfoStyle>
  );
}
