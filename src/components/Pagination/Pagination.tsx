import React, { ChangeEvent, ComponentPropsWithoutRef, FormEvent, useState } from "react";
import styled from "styled-components";
import { navigate } from "gatsby";
import StyleLink from "../StyleLink";

const PaginationStyle = styled("div")`
  display: flex;
  .form {
    margin-left: auto;

    input {
      width: 50px;
      text-align: center;
      margin: 0 20px;
      border-radius: 5px;
      border: 1px solid ${(p) => p.theme.colors.primary.refer};
      outline: none;
      line-height: 20px;
    }
    span {
      color: #666;
    }
  }
`;

interface PaginationProps extends ComponentPropsWithoutRef<"div"> {
  currentPage: number;
  total: number;
  baseURL: string;
}

export default function Pagination({ currentPage, total, baseURL }: PaginationProps) {
  const [page, setPage] = useState(currentPage.toString());

  // 操作跳转页面
  function handlePage(e: ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;

    if (!/^\d*$/.test(v) || v === "0") return;

    if (+v > total) {
      setPage(total.toString());
      return;
    }

    setPage(e.target.value);
  }

  // 提交跳转页面
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    navigate(baseURL + (page === "1" ? "" : page));
  }

  return (
    <PaginationStyle>
      {currentPage !== 1 && (
        <StyleLink to={currentPage === 2 ? baseURL : baseURL + (currentPage - 1)}>上一页</StyleLink>
      )}
      <form className="form" onSubmit={handleSubmit}>
        <span>共 {total} 页</span>
        <input type="text" value={page} onChange={handlePage} />
      </form>
      {currentPage !== total && <StyleLink to={baseURL + (currentPage + 1)}>下一页</StyleLink>}
    </PaginationStyle>
  );
}
