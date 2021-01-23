import Head from "next/head";

export default function Error({ statusCode }) {
  return (
    <>
      <Head>
        <title>RRT Directory - Error</title>
        <meta name="description" content="Kerala RRT Directory" />
      </Head>
      <div className="items-center self-center flex flex-col mb-6 mt-12 mx-6 my-auto overflow-hidden w-full">
        <span className="sm:text-2xl md:text-2xl">
          {statusCode
            ? `An error ${statusCode} occurred on server`
            : "An error occurred on client"}
        </span>
      </div>
    </>
  );
}

export async function getServerSideProps({ res, err }) {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return {
    props: { statusCode },
  };
}
