export default function createRecorder({ name, duration }) {
  return new CCapture({
    verbose: false,
    display: true,
    framerate: 60,
    quality: 100,
    format: "png",
    timeLimit: duration,
    name,
  });
}
