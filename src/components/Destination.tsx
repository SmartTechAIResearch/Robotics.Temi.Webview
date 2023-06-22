import { AppState, iLocationData } from "../interfaces/interfaces";
import { useEffect, useState } from "react";
import { useStateContext } from "../context/StateContext";

interface DestinationProps {
  onClickHandler?: () => void; 
  nextLocation?: iLocationData; // The question mark makes this prop optional
  name?: string;
  visited?: boolean;
}


const Destination: React.FC<DestinationProps> = ({ onClickHandler, visited, name}) => {

    const [destinationText, setDestinationText] = useState<string>("");
    const [visitedClass, setVisitedClass] = useState<boolean>(false);

    const { setAppState } = useStateContext();

    useEffect(() => {
      if (name != null) {
        console.log(`The name of the destination is ${name}`);
        setDestinationText(`Ga naar ${name}`);
      }
      if (name == null) {
        setAppState(AppState.LastPage);
      }
    }, [name]);

    useEffect(() => {
      // If we have visited this location
      if (visited != null) {
        setVisitedClass(visited);
      }
    }, [visited]);


    return (
      <button
      className={`btn-next destination ${visitedClass ? "visited" : ""}` }
      onClick={onClickHandler}
      >
        {destinationText}
      </button>
    )
}

export default Destination;