import Image from "next/image";
import React, { memo } from "react";

const PlayButton = ({ play, ...opts }) => {
  return (
    <div {...opts}>
      <Image
        src={"/icons/" + (!play ? "play" : "pause") + ".svg"}
        height={24}
        width={24}
        layout="fixed"
      />
    </div>
  );
};

export default memo(PlayButton);
