import '../styles/globals.css'
import '../styles/index.module.scss';

import App from "next/app"
import Layout from '../pages/components/layout'

const PATH_TO_PAGE = {
  '/eating': 'eati'
};

const getSelectedPage = (path) => {
  return path.substring(1);
}

function MyApp({ Component, pageProps, router }) {
  console.log("selercterd route", router.route);
  const selected_page = getSelectedPage(router.route);
console.log("selercterd perge", selected_page);
  return <Layout selectedPage={selected_page}>
    <Component {...pageProps} />
  </Layout>;
}

export default MyApp
