import React, { ChangeEvent, ComponentPropsWithoutRef } from "react";
import styled, { useTheme } from "styled-components";
import Icon from "../Icon";
import Search from "../Icon/Search";

const Fieldset = styled.fieldset`
  border: none;
  border-bottom: 2px solid ${(p) => p.theme.colors.secondary.main};
  border-radius: 5px;
  padding: 10px 20px;

  display: flex;

  transition: box-shadow 0.2s;

  &:focus-within {
    box-shadow: 0 0 5px ${(p) => p.theme.colors.primary.main};
  }
`;

function SearchIcon() {
  const { colors } = useTheme();
  return (
    <Icon
      style={{ margin: "0 10px" }}
      vertical="middle"
      size="20px"
      fill={colors.secondary.main}
      children={<Search />}
    />
  );
}

const Input = styled.input`
  flex-basis: 100%;
  font-size: 1.2rem;
  border: none;
  outline: none;
  &::-webkit-search-cancel-button {
    display: none;
  }
`;

interface SearchIconProps extends ComponentPropsWithoutRef<"form"> {
  value?: string;
  onSearchInput?: (e: ChangeEvent<HTMLInputElement>) => void;
}
export default function SearchBar({ value, onSearchInput, ...rest }: SearchIconProps) {
  return (
    <form {...rest}>
      <Fieldset>
        <SearchIcon />
        <Input autoFocus type="search" defaultValue={value} onChange={onSearchInput} placeholder="search...." />
      </Fieldset>
    </form>
  );
}
