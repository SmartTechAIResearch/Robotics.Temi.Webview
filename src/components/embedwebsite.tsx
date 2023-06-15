import React from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/system";


const CloseButton = styled(IconButton)({
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#44c8f5",
    color: "white",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "#44c8f5",
    },
  });

function EmbedWebsite({showIframe, closeIframe, url}) {

  return (
    <div>
      {showIframe && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div style={{ position: "relative", height: "90%", width: "90%", margin: "5% auto", backgroundColor: "white" }}>
          <CloseButton onClick={closeIframe}>
              <CloseIcon />
            </CloseButton>
            <iframe src={url} title="Embedded site" style={{ width: "100%", height: "100%" }}></iframe>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmbedWebsite;
