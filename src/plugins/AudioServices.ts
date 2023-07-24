export const playAudioBuffet = (url: string) => {
  const audioCtx = new window.AudioContext();
  // Fetch the MP3 file from the server
  fetch(url)
    // Return the data as an ArrayBuffer
    .then((response) => response.arrayBuffer())
    // Decode the audio data
    .then((buffer) => audioCtx.decodeAudioData(buffer))
    .then((decodedData) => {
      // ...
      const source = audioCtx.createBufferSource();
      source.buffer = decodedData;
      source.connect(audioCtx.destination);
      source.start();
    });
};
