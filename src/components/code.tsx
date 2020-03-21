import Prism from "prismjs";
import ReactJSXParser from "@zeit/react-jsx-parser";
import "prismjs/components/prism-jsx";
import dynamicComponents from "./dynamic";
export type CodeProps = {
  content: TextProp;
  language: string;
};
export default function Code({
  content,
  language = "javascript"
}: CodeProps): JSX.Element {
  const [[text]] = content;
  if (language === "LiveScript") {
    return (
      <ReactJSXParser
        jsx={text}
        components={dynamicComponents}
        componentsOnly={false}
        renderInpost={false}
        allowUnknownElements={true}
        blacklistedTags={["script", "style"]}
      />
    );
  }
  return (
    <>
      <pre>
        <code
          dangerouslySetInnerHTML={{
            __html: Prism.highlight(
              text,
              Prism.languages[language.toLowerCase()] ||
                Prism.languages.javascript
            )
          }}
        />
      </pre>
      <style jsx>{`
        pre {
          tab-size: 2;
        }

        code {
          overflow: auto;
          display: block;
          padding: 0.8rem;
          line-height: 1.5;
          background: #f5f5f5;
          font-size: 0.75rem;
          border-radius: var(--radius);
        }
      `}</style>
    </>
  );
}
