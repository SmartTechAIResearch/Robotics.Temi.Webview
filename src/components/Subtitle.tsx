import { useEffect, useState } from "react";
import { useLocation } from "../context/LocationContext";
import { useSentenceContext } from "../context/SentenceContext";
import { useSocket } from "../context/SocketContext";
import LoadingCircle from "./LoadingCircle";

function estimateReadingTime(text: string) {
    const averageCharsPerSecond = 12.5;
    const marginInSeconds = 0.5;

    // Calculate the estimated time
    if (!text || text === "") return 0;
    const estimatedTime = text.length / averageCharsPerSecond;

    // Add the margin
    const totalEstimatedTime = estimatedTime + marginInSeconds;

    return totalEstimatedTime; // This will be in seconds
  }

function Subtitle({ handleFinish }) {

    const socket = useSocket();
    const { sentenceCounter, setSentenceCounter, currentSentence, setCurrentSentence } = useSentenceContext();
    const {
        currentLocation,
      } = useLocation(); 

    const [readingTime, setReadingTime] = useState<number>(-1);

    // When Temi should start speaking
  useEffect(() => {
    // Start the counter from 0 and up
    if (sentenceCounter >= 0 && currentLocation) {
      // Get the sentence Temi should speak
      let sentence = currentLocation.textList[sentenceCounter];
      console.log("Sending sentence to Temi: ", sentenceCounter, sentence);
      if (sentence) {
       // Send the sentence to Temi, we then await the response to show the subtitles
       setCurrentSentence(sentence);
       socket.emit("tts", sentence)
     }

     // Start a timer to show the next message after estimatedReadingTime for the current sentence has elapsed
     let estimatedReadingTime = estimateReadingTime(sentence);
     setReadingTime(estimatedReadingTime);
     console.log("Estimated reading time: ", estimatedReadingTime);
     setTimeout(() => {
       // If the sentenceCounter is equal to the length of the textList, we are finished
       if (sentenceCounter === currentLocation.textList.length - 1 || currentLocation.textList.length === 0) {
         console.log("We are finished with the location: ", currentLocation.name);
         setReadingTime(-1); // Reset the reading time
         handleFinish();
         return;
       }
       setSentenceCounter(sentenceCounter + 1);
     }, estimatedReadingTime * 1000);
   }

   // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [sentenceCounter]);

    return (
        <>
            <div id="ttsDiv" className="Subtitles">
            <p>{currentSentence}</p>
            </div>
            
            <LoadingCircle key={readingTime} estimatedTimeout={readingTime} />
        </>
      )
}

export default Subtitle;