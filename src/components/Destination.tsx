import { AppState } from "../interfaces/interfaces";
import { useSocket } from "../context/SocketContext";
import { useLocation } from "../context/LocationContext";



function Destination({ onClickHandler }) {

    const socket = useSocket();
    const {
      stepperData,
      stepperCounter
    } = useLocation();

    return (
      <button
      id="GoToNextLocation"
      onClick={onClickHandler}
  >
    
    {
      stepperData.length === 1
        ? "Welkom in " + stepperData[0]
        :
        stepperCounter >= stepperData.length - 1
          ? "Ga naar einde"
          : "Ga naar " + stepperData[stepperCounter + 1].split('-').join(" ")

    }
  </button>
    )
}

export default Destination;