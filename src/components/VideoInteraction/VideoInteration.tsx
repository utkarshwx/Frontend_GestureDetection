import { Camera, Upload, Video } from "lucide-react";
import { useState, useRef } from "react";
import Header from "../../Layout/Header/Header";

const VideoInteraction = () => {
  const [file, setFile] = useState<File | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith("video/")) {
      setFile(selectedFile);
      setVideoPreviewUrl(URL.createObjectURL(selectedFile)); // Preview the selected video
    } else {
      alert("Please select a valid video file.");
    }
  };

  // Start recording function
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }

    const recorder = new MediaRecorder(stream);
    const chunks: Blob[] = [];

    recorder.ondataavailable = (event) => chunks.push(event.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/mp4" });
      setRecordedBlob(blob);
      setVideoPreviewUrl(URL.createObjectURL(blob));
      stream.getTracks().forEach((track) => track.stop());
    };

    setMediaRecorder(recorder);
    recorder.start();
    setIsRecording(true);
  };

  // Stop recording function
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  // Handle video upload
  const handleUpload = async () => {
    const uploadFile = file || recordedBlob;
    if (!uploadFile) {
      alert("No video to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("video", uploadFile, file ? file.name : "recorded_video.mp4");

    try {
      setUploadProgress(0);

      // Simulate upload progress
      const simulateProgress = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(simulateProgress);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(simulateProgress);

      if (!response.ok) {
        throw new Error("File upload failed");
      }

      const result = await response.json();
      setDownloadUrl(result.downloadUrl);
    } catch (error) {
      alert("Error uploading file: " + (error as Error).message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      <main className="flex-grow items-center justify-center container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Video Upload & Record
          </h2>
          <div className="space-y-4">
            {/* Progress Bar */}
            {uploadProgress > 0 && (
              <div className="relative w-full bg-gray-200 rounded-lg overflow-hidden h-6">
                <div
                  className="absolute top-0 left-0 h-6 bg-blue-500 text-white text-center font-bold text-sm leading-6"
                  style={{ width: `${uploadProgress}%` }}
                >
                  {uploadProgress}%
                </div>
              </div>
            )}

            {/* File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="video/*"
              className="hidden"
            />
            <button
              className="w-full bg-white hover:bg-black text-black hover:text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center transition duration-150 ease-in-out"
              onClick={() => fileInputRef.current?.click()}
            >
              <Video className="mr-2 h-5 w-5" />
              Select Video
            </button>

            {/* Start/Stop Recording Button */}
            <button
              className={`w-full ${
                isRecording
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center transition duration-150 ease-in-out`}
              onClick={isRecording ? stopRecording : startRecording}
            >
              <Camera className="mr-2 h-5 w-5" />
              {isRecording ? "Stop Recording" : "Start Recording"}
            </button>

            {/* Video Preview */}
            {(videoPreviewUrl && !isRecording) && (
              <video
                src={videoPreviewUrl}
                controls
                className="w-full max-h-64 object-contain bg-black mb-4"
              >
                Your browser does not support the video tag.
              </video>
            )}

            {isRecording && (
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full max-h-64 object-contain bg-black mb-4"
              />
            )}

            {/* Upload Video Button */}
            <button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center transition duration-150 ease-in-out"
              onClick={handleUpload}
            >
              <Upload className="mr-2 h-5 w-5" />
              Upload Video
            </button>

            {downloadUrl && (
              <div className="mt-4">
                <a
                  href={downloadUrl}
                  className="w-full bg-white hover:bg-black text-black hover:text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center transition duration-150 ease-in-out"
                  download="Processed_video.mp4"
                >
                  Download Processed Video
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VideoInteraction;
