import { useAudioRecorder } from "../hooks/useAudioRecorder";

export const PushToTalk = () => {
  const {
    isRecording,
    audioBlob,
    startRecording,
    stopRecording,
    recordingTime,
    formatTime,
  } = useAudioRecorder(240);

  const handleMouseDown = () => {
    startRecording();
  };

  const handleMouseUp = () => {
    stopRecording();
  };

  return (
    <>
      <button
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        className="w-40 h-40 rounded-full bg-red-700 text-white font-bold font-mono cursor-pointer active:bg-red-900"
      >
        {isRecording ? "Recording..." : "Push to Talk"}
      </button>

      {audioBlob && (
        <div>
          <p>Preview recording:</p>
          <audio controls src={URL.createObjectURL(audioBlob)} />
          <span>{formatTime(recordingTime)}</span>
        </div>
      )}
    </>
  );
};
