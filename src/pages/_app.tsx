import "../styles/global.scss";
import Footer from "../components/molecules/footer";
import { AppType } from "next/dist/next-server/lib/utils";

const App: AppType = ({ Component, pageProps }) => (
  <>
    <Component {...pageProps} />
    <Footer />
  </>
);

export default App;
