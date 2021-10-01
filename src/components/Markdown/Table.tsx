import React, { ComponentPropsWithoutRef } from "react";

interface TableProps extends ComponentPropsWithoutRef<"table"> {}

export default function Table(props: TableProps) {
  return (
    <div className="table-box">
      <table {...props} />
    </div>
  );
}
