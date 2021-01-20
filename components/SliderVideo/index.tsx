import React, { memo } from "react";
import { Form } from "react-bootstrap";

const Slider = ({ videoDuration, videoCurrentTime, ...opts }) => {
  return (
    <Form.Control
      type="range"
      min={0}
      step={0.001}
      value={videoCurrentTime}
      max={videoDuration}
      custom
      {...opts}
    />
  );
};

export default memo(Slider);
