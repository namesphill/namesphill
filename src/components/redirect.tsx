import React, { useEffect } from "react";
import { useRouter } from "next/router";
export type RedirectProps = {
  to: string;
  placeholder: string;
  timeout: number;
};
export default function Redirect({
  to = "/",
  placeholder = "",
  timeout = 500
}: RedirectProps): JSX.Element {
  const { replace } = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => replace(to), timeout);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div>
      <p>{placeholder}</p>
    </div>
  );
}
