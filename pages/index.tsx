import { InferGetStaticPropsType } from "next";
import Head from "next/head";
import React from "react";

import Search from "../components/search";
import { generateSearchList, getLsgs, useLSGSelected } from "../lib/utils";

export default function IndexPage({
  searchList,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [selected, setSelected] = useLSGSelected(null);
  return (
    <>
      <Head>
        <title>RRT Directory</title>
        <meta name="description" content="Kerala RRT Directory" />
      </Head>
      <Search
        searchList={searchList}
        selected={selected}
        setSelected={setSelected}
      />
    </>
  );
}

export async function getStaticProps() {
  const lsgs = await getLsgs();
  const searchList = generateSearchList(lsgs);
  return {
    props: {
      searchList,
    },
  };
}
