import React, { memo } from "react";

const Timer = ({ videoCurrentTime, videoDuration }) => {
  return (
    <div className="d-flex justify-content-start">
      <span>
        {(videoCurrentTime / 60 < 10 ? "0" : "") +
          Math.floor(videoCurrentTime / 60) +
          ":" +
          (videoCurrentTime % 60 < 10 ? "0" : "") +
          Math.floor(videoCurrentTime % 60)}
      </span>
      /
      <span>
        {(videoDuration / 60 < 10 ? "0" : "") +
          Math.floor(videoDuration / 60) +
          ":" +
          (videoDuration % 60 < 10 ? "0" : "") +
          Math.floor(videoDuration % 60)}
      </span>
    </div>
  );
};

export default memo(Timer);
