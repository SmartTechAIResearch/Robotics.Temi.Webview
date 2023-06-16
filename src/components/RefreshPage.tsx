import RefreshIcon from "@mui/icons-material/Refresh";

function RefreshPage() {


return (
    <button id="refreshPage" onClick={() => window.location.reload()}>
        <RefreshIcon sx={{ fontSize: 40 }}></RefreshIcon>
    </button>
)
}

export default RefreshPage;