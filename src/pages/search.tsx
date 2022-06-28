import { graphql, PageProps, navigate } from "gatsby";
import React, { ChangeEvent, ReactNode, useEffect, useState } from "react";
import styled from "styled-components";
import { useDebounce } from "../utils";
import qs from "query-string";
import Root from "../components/Root/Root";
import Header from "../components/Header";
import PostList from "../components/PostList";
import SearchBar from "../components/SearchBar/SearchBar";
import Box from "../components/Box";
import { Helmet } from "react-helmet";

const Em = styled.em`
  color: ${(p) => p.theme.colors.yellow.main};
  font-style: normal;
`;

/**
 * 匹配关键字
 * @param raw 原生字符串
 * @param key 需要匹配的关键字
 * @returns 匹配的迭代器
 */
function getMatchs(raw: string, key: string) {
  const keys = key.trim().split(/\s+/);
  const reg = keys.reduce((prev, v) => (prev += `(${v})|`), "");

  return [...raw.matchAll(RegExp(reg.substr(0, reg.length - 1), "ig"))];
}

/**
 * 柯里化强调文本函数
 * 示例：
 * emText('foo')('foo text foo') // 返回 [<em>foo</em>,' text ',<em>foo</em>]
 * @param key 关键字
 */
const emText =
  (key: string) =>
  /**
   * 提供一个输入文本返回强调文本组件数组的函数
   * @param raw 需要强调的文本
   * @param diffKey 用于组件 key 的后缀补充
   */
  (raw: string, diffKey: string = "") => {
    const matchs = getMatchs(raw, key);
    const emNode: ReactNode[] = [];

    for (var ri = 0, mi = 0; mi < matchs.length; mi++) {
      const item = matchs[mi];

      if (typeof item.index === "number") {
        emNode.push(raw.substring(ri, item.index));
        emNode.push(<Em key={mi + diffKey}>{item[0]}</Em>);
        ri = item.index + item[0].length;
      }
    }

    emNode.push(raw.substr(ri));

    return {
      vNode: emNode,
      count: matchs.length,
    };
  };

/**
 * 返回一个对关键字进行匹配过滤后的列表
 * @param list 数据列表
 * @param keyword 关键字
 * @param degree 匹配程度
 * @returns
 */
function matchList(list: DData["allMarkdownRemark"]["nodes"], keyword: string, degree = 0.5) {
  // 匹配柯里化
  const emMatch = emText(keyword);
  let maxWeight = 0;

  if (keyword === "") return [];

  return list
    .map((node) => {
      const {
        frontmatter: { archives, tags, title, createAt },
      } = node;

      // 权重
      let weight = 0;

      const emTitle = emMatch(title);
      weight += emTitle.count;

      const emCreateAt = emMatch(createAt);
      weight += emCreateAt.count;

      function emMap(v: string, i: number) {
        const item = emMatch(v, i.toString());
        weight += item.count;
        return item.vNode;
      }

      const emArchives = archives?.map(emMap);
      const emTags = tags?.map(emMap);

      // 追踪最大权重值
      if (weight > maxWeight) {
        maxWeight = weight;
      }

      return {
        node,
        weight,
        vNodes: {
          title: emTitle.vNode,
          createAt: emCreateAt.vNode,
          archives: emArchives,
          tags: emTags,
          path: node.fields.path,
        },
      };
    })
    .filter((item) => {
      return item.weight / maxWeight > degree;
    })
    .sort((prev, next) => (prev.weight < next.weight ? 1 : -1))
    .map((item) => item.vNodes);
}

const DivS = styled.div`
  max-width: 600px;
  padding: 20px;
  margin: auto;
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

export default function Search({ data, location }: PageData) {
  const nodes = data.allMarkdownRemark.nodes;
  const [renderLi, setRenderLi] = useState<ReturnType<typeof matchList>>([]);
  const keyword = (qs.parse(location.search).keyword as string) ?? "";

  useEffect(() => {
    setRenderLi(matchList(nodes, keyword, 0.6));
  }, [nodes, keyword]);

  const handleKeyword = useDebounce(function (e: ChangeEvent<HTMLInputElement>) {
    navigate(`?${qs.stringify({ keyword: e.target.value })}`, { replace: true });
  }, 250);

  return (
    <Root>
      <Helmet title="检索"></Helmet>
      <Header location={location} />
      <Box p={[40, 20]}>
        <SearchBar value={keyword} onSearchInput={handleKeyword} />
        {renderLi.length > 0 && <PostList list={renderLi} />}
      </Box>
    </Root>
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
