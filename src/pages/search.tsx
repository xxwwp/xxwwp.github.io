import { graphql, PageProps } from "gatsby";
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

/**
 * 匹配关键字
 * @param raw 原生字符串
 * @param key 需要匹配的关键字
 * @returns 匹配的迭代器
 */
function getMatchs(raw: string, key: string) {
  const keys = key.trim().split(/\s+/);
  let reg = keys.reduce((prev, v) => (prev += `(${v})|`), "");
  reg = reg.substr(0, reg.length - 1);

  return [...raw.matchAll(RegExp(reg, "g"))];
}

/**
 * 强调字符串中的关键字
 * @param raw 原生字符串
 * @param key 需要匹配的关键字
 * @returns 强调关键字的渲染列表
 */
function emKeyword(raw: string, key: string) {
  const matchs = getMatchs(raw, key);
  const emNode = [];

  for (var ri = 0, mi = 0; mi < matchs.length; mi++) {
    const item = matchs[mi];
    emNode.push(raw.substr(ri, item.index));
    emNode.push(<em key={mi}>{item[0]}</em>);
    ri = item.index + item[0].length;
  }

  emNode.push(raw.substr(ri));

  return emNode;
}

const DivS = styled.div`
  em {
    color: red;
    font-style: normal;
  }
`;

export const query = graphql`
  query SearchQuery {
    allMarkdownRemark {
      nodes {
        frontmatter {
          title
          createAt
          tags
          archives
        }
        fields {
          path
          mini
        }
      }
    }
  }
`;

export default function Search({ data }: PageData) {
  const [keyword, setSearch] = useState("");
  const [list, setList] = useState<DData["allMarkdownRemark"]["nodes"]>([]);

  const handleList = useCallback(() => {
    if (keyword === "") return void setList([]);

    const wNodes: { node: typeof list[number]; w: number }[] = data.allMarkdownRemark.nodes.map((v) => ({
      node: v,
      w: 0,
    }));

    const filters = wNodes
      .filter((item) => {
        const {
          node: {
            frontmatter: { archives, tags, title },
          },
        } = item;
        // 整理归档、标签和标题，写入权重，过滤掉没有匹配成功项目
        [...(archives ?? []), ...(tags ?? []), title].forEach((v) => {
          const matchs = getMatchs(v, keyword);
          item.w += matchs.length;
          return matchs.length !== 0;
        });
        return item.w > 0;
      })
      .sort((prev, next) => (prev.w > next.w ? -1 : 1));

    setList(filters.map((v) => v.node));
  }, [keyword, data]);

  // 防抖
  useEffect(() => {
    const timer = setTimeout(handleList, 1000);
    return () => clearTimeout(timer);
  }, [handleList]);

  return (
    <DivS>
      <form>
        <input type="search" value={keyword} onChange={(e) => setSearch(e.target.value)} />
      </form>
      {list.length > 0 && (
        <ul>
          {list.map((v, i) => (
            <li key={i}>
              <h2> {emKeyword(v.frontmatter.title, keyword)}</h2>
              <p>
                标签：
                {v.frontmatter.tags?.map((v, i) => (
                  <span key={i}>
                    {emKeyword(v, keyword)}
                    &nbsp;&nbsp;
                  </span>
                ))}
              </p>
              <p>
                归档：
                {v.frontmatter.archives?.map((v, i) => (
                  <span key={i}>
                    {emKeyword(v, keyword)}
                    &nbsp;&nbsp;
                  </span>
                ))}
              </p>
              <p>{v.fields.mini}</p>
            </li>
          ))}
        </ul>
      )}
    </DivS>
  );
}

/** gql 数据 */
interface DData {
  allMarkdownRemark: {
    nodes: {
      fields: {
        path: string;
        mini: string;
      };
      frontmatter: {
        title: string;
        createAt: string;
        archives?: string[];
        tags?: string[];
      };
    }[];
  };
}

/** 页面数据 */
interface PageData extends PageProps {
  data: DData;
}
