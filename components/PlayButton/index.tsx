import Image from "next/image";
import React, { memo } from "react";
import { Spinner } from "react-bootstrap";

const PlayButton = ({ play, loading, ...opts }) => {
  return (
    <div {...opts}>
      {!loading ? (
        <Image
          src={"/icons/" + (!play ? "play" : "pause") + ".svg"}
          height={24}
          width={24}
          layout="fixed"
        />
      ) : (
        <Spinner animation="border" size="sm" />
      )}
    </div>
  );
};

export default memo(PlayButton);
