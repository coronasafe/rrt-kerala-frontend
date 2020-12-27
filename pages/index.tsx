import { InferGetStaticPropsType } from "next";
import Head from "next/head";
import React from "react";

import Search from "../components/search";
import { generateSearchList, getLsgs } from "../lib/utils";

export default function IndexPage({
  searchList,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>RRT Directory</title>
      </Head>
      <div className="container flex flex-col">
        <h1 className="text-5xl text-center mb-10 font-bold">RRT DIRECTORY</h1>
        <Search searchList={searchList} />
      </div>
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
