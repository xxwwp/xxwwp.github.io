import React, { ComponentPropsWithoutRef, useState } from "react";
import { Link } from "gatsby";
import styled from "styled-components";
import { navigate } from "gatsby";

const PaginationStyle = styled("div")`
  display: flex;
  align-items: center;
  .form {
    margin-left: auto;
    input {
      width: 50px;
      text-align: center;
      margin: 0 20px;
      border-radius: 5px;
      border: 1px solid #666;
      outline: none;
      line-height: 20px;
    }
    span {
      font-size: 12px;
      color: #666;
    }
  }
  a {
    color: #383980;
    text-decoration: none;
  }
  a:hover,
  a:visited,
  a:active {
    filter: brightness(1.5);
  }
`;

interface PaginationProps extends ComponentPropsWithoutRef<"div"> {
  currentPage: number;
  total: number;
}

export default function Pagination({ currentPage, total }: PaginationProps) {
  const [page, setPage] = useState(currentPage.toString());
  const baseURL = "/post-list/";

  // 操作跳转页面
  function handlePage(e) {
    const v = e.target.value;

    if (!/^\d*$/.test(v) || v === "0") return;

    if (+v > total) {
      setPage(total.toString());
      return;
    }

    setPage(e.target.value);
  }

  // 提交跳转页面
  function handleSubmit(e) {
    e.preventDefault();
    navigate(baseURL + (page === "1" ? "" : page));
  }

  return (
    <PaginationStyle>
      {currentPage !== 1 && <Link to={currentPage === 2 ? baseURL : baseURL + (currentPage - 1)}>上一页</Link>}
      <form className="form" onSubmit={handleSubmit}>
        <span>共 {total} 页</span>
        <input type="text" value={page} onChange={handlePage} />
      </form>
      {currentPage !== total && <Link to={baseURL + (currentPage + 1)}>下一页</Link>}
    </PaginationStyle>
  );
}
