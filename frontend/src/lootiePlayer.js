// src/LottiePlayer.js
import React from 'react';
import '@lottiefiles/lottie-player'; // Import lottie-player library

const LottiePlayer = ({ src, height, width }) => {
  return (
    <lottie-player
      autoplay
      loop
      mode="normal"
      src={src}
      style={{ height, width }}
    ></lottie-player>
  );
};

export default LottiePlayer;
