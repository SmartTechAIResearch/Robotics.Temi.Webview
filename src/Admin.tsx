import "./css/Admin.css";
function Admin(){
    return (
        <div className="admin">
            <button id="BackButton">Back</button>
            <div className="adminTitle">
                <h1>Adminpanel</h1>
            </div>
            <div>
                <button>Shutdown Robot</button>
            </div>
        </div>
    );
}

export default Admin;