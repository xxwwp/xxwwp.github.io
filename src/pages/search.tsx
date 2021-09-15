import { graphql, PageProps, Link } from "gatsby";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useDebounce } from "../utils";
import qs from "query-string";
import PostCard from "../components/PostCard";

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

  return [...raw.matchAll(RegExp(reg, "ig"))];
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
    allMarkdownRemark(sort: { fields: frontmatter___createAt, order: DESC }) {
      nodes {
        excerpt
        fields {
          path
        }
        frontmatter {
          title
          archives
          createAt(formatString: "yyyy-MM-DD")
          tags
        }
      }
    }
  }
`;

export default function Search({ data, location, navigate }: PageData) {
  const [list, setList] = useState<DData["allMarkdownRemark"]["nodes"]>([]);
  const keyword = (qs.parse(location.search).keyword as string) ?? "";

  const emK = useCallback((raw: string) => emKeyword(raw, keyword), [keyword]);

  useEffect(() => {
    if (keyword === "") return void setList([]);

    const wNodes: { node: typeof list[number]; w: number }[] = data.allMarkdownRemark.nodes.map((v) => ({
      node: v,
      w: 0,
    }));

    const filters = wNodes
      .filter((item) => {
        const {
          node: {
            frontmatter: { archives, tags, title, createAt },
          },
        } = item;
        // 整理归档、标签和标题，写入权重，过滤掉没有匹配成功项目
        [...(archives ?? []), ...(tags ?? []), title, createAt].forEach((v) => {
          const matchs = getMatchs(v, keyword);
          item.w += matchs.length;
          return matchs.length !== 0;
        });
        return item.w > 0;
      })
      .sort((prev, next) => (prev.w > next.w ? -1 : 1));

    setList(filters.map((v) => v.node));
  }, [keyword, data]);

  const handleKeyword = useDebounce(function (e: ChangeEvent<HTMLInputElement>) {
    navigate(`/search?${qs.stringify({ keyword: e.target.value })}`, { replace: true });
  }, 250);

  return (
    <DivS>
      <form>
        <input type="search" defaultValue={keyword} onChange={handleKeyword} />
      </form>
      {list.length > 0 && (
        <ul>
          {list.map((v, i) => (
            <li key={i}>
              <PostCard
                title={emK(v.frontmatter.title)}
                path={v.fields.path}
                createAt={emK(v.frontmatter.createAt)}
                excerpt={v.excerpt}
                tags={v.frontmatter.tags?.map((v, i) => (
                  <span key={i}>{emK(v)}&nbsp;&nbsp;</span>
                ))}
                archives={v.frontmatter.archives?.map((v, i) => (
                  <span key={i}>{emK(v)}&nbsp;&nbsp;</span>
                ))}
              />
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
      excerpt: string;
      fields: {
        path: string;
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