import Image from "next/image";
import React, { memo } from "react";

const FullscreenButton = ({ fullscreen, ...opts }) => {
  return (
    <div {...opts}>
      <Image
        src={"/icons/" + (!fullscreen ? "maximize" : "minimize") + ".svg"}
        height={24}
        width={24}
        layout="fixed"
      />
    </div>
  );
};

export default memo(FullscreenButton);
