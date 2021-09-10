import React, { ComponentPropsWithoutRef } from "react";

interface AnchorProps extends ComponentPropsWithoutRef<"a"> {}

export default function Anchor(props: AnchorProps) {
  return /^https?:\/\//.test(props.href) ? <a target="_blank" {...props} /> : <a {...props} />;
}
