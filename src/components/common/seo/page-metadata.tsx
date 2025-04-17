import Head from "next/head";
import React from "react";

interface PageMetadataProps {
  title: string;
  description: string;
}

const PageMetadata: React.FC<PageMetadataProps> = ({ title, description }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="My Awesome App" />
        <meta property="og:description" content={description} />
      </Head>
    </>
  );
};

export default PageMetadata;
