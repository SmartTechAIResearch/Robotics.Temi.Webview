import React from 'react';

function FeedbackPage({ sendLocation, afterFinishEvent, afterFinishText }) {

  return (
    <>
      <div id="currentLocation">
        <h1>Feedback</h1>
        <p>Wat vond je van deze rondleiding? <br />
          Laat gerust een opmerking achter bij mijn menselijke collega's!</p>
      </div>
      <div className="lowerRight multiDestinations destinations1 destination-sm">
        <button
          className="btn-next"
          onClick={(event) => afterFinishEvent(event)}
        >
            {afterFinishText}
        </button>
      </div>
      {/* <img src="/qr.jpg" id="qr" alt="mctLgo"></img> */}
    </>
  );
}

export default FeedbackPage;
