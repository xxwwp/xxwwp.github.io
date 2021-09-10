import { graphql, PageProps } from "gatsby";
import React, { useEffect, useState } from "react";

function emKeyword(raw: string, key: string) {
  const rawSplit = raw.split(key);
  const emNode = [];

  for (let i = 0; i < rawSplit.length; i++) {
    emNode.push(rawSplit[i]);
    emNode.push(<em key={i}>{key}</em>);
  }
  emNode.pop();
  console.log(raw, rawSplit, emNode);
  return emNode;
}

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
        }
      }
    }
  }
`;

export default function Search({ data }: PageData) {
  const [keyword, setSearch] = useState("");
  // 多关键字的类型没有判断，这部分还是要重写
  const list =
    keyword === ""
      ? []
      : data.allMarkdownRemark.nodes.filter(({ frontmatter: { archives, tags, title } }) =>
          // 整理归档、标签和标题，如果含有 keyword 的则满足过滤条件
          [...(archives ?? []), ...(tags ?? []), title].some((v) => v.search(keyword) !== -1)
        );

  return (
    <div>
      <form>
        <input type="search" value={keyword} onChange={(e) => setSearch(e.target.value)} />
      </form>
      {list.length > 0 && (
        <ul>
          {list.map((v, i) => (
            <li key={i}>
              <h2>{v.frontmatter.title}</h2>
              <p>
                标签：
                {v.frontmatter.tags?.map((v, i) => (
                  <span key={i}>{emKeyword(v, keyword)}</span>
                ))}
              </p>
              <p>归档：{v.frontmatter.archives?.join("")}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** gql 数据 */
interface DData {
  allMarkdownRemark: {
    nodes: {
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
