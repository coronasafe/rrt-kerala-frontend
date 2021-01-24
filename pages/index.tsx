import { InferGetStaticPropsType } from "next";
import Head from "next/head";

import PathTree from "../components/pathtree";
import Search from "../components/search";
import { getLsgs } from "../lib/utils";

export default function IndexPage({
  lsgs,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>RRT Directory</title>
        <meta name="description" content="Kerala RRT Directory" />
      </Head>
      <Search lsgs={lsgs} />
      <PathTree lsgs={lsgs} />
    </>
  );
}

export async function getStaticProps() {
  const lsgs = await getLsgs();
  return {
    props: {
      lsgs,
    },
  };
}
