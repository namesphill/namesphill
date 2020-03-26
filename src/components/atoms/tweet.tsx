import React, { useEffect } from "react";
export default function Tweet({ html }: { html: string }) {
  useEffect(() => {
    const twitterSrc = "https://platform.twitter.com/widgets.js";
    if ((window as any)?.twttr?.widgets) {
      (window as any).twttr.widgets.load();
    } else if (!document.querySelector(`script[src="${twitterSrc}"]`)) {
      const script = document.createElement("script");
      script.src = twitterSrc;
      script.async = true;
      document.querySelector("body").appendChild(script);
    }
  }, []);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
