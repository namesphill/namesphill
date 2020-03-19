export default (
  props: React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  >
) => <a {...props} rel="noopener" target={props.target || "_blank"} />;
