import { Modal, Box } from "@mui/material";

const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    // width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

function TutorialVideo( {openTutorial, handleClose }) {

return (
    <div key="modal">
        <Modal
          open={openTutorial}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <iframe
              width="1120"
              height="630"
              src="https://www.youtube.com/embed/_FNKdQrZekk"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </Box>
        </Modal>
      </div>
)
}

export default TutorialVideo;