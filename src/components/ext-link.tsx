export default function ExtLink(
  props: React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  >
): JSX.Element {
  return <a {...props} rel="noopener" target={props.target || "_blank"} />;
}
