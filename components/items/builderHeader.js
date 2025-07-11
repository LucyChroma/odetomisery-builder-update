import React from 'react';
import styles from '../../styles/BuilderHeader.module.css';
import EditIcon from '@mui/icons-material/Edit';

export default function BuilderHeader(data) {
    let text = data.text;
    let setText = data.setText;

    const [editing, setEditing] = React.useState(false);
    const [loaded, setLoaded] = React.useState(false);
    const [tempText, setTempText] = React.useState("Monumenta Builder");

    React.useEffect(() => {
        if (data.parentLoaded) {
            let tempName = "Monumenta Builder";
            if(data.build) {
                let buildParts = (data.build)[0].split("&");
                tempName = (buildParts.find(str => str.includes("name="))?.split("name=")[1]);
                if(tempName === undefined) tempName = "Monumenta Builder";
            }
            setText(decodeURIComponent(tempName));
            setTempText(decodeURIComponent(tempName));
            setLoaded(true);
        }
    }, [data.parentLoaded]);

    function editButtonClicked(e){
        setEditing(true);
    }

    function hasfocus(e){
        e.target.select();
    }

    function keydown(e){
        if (e.key === "Enter" || e.key === "Escape") {
            stopEditing();
        }
    }

    function lostfocus(e){
        stopEditing();
    }

    function stopEditing(){
        // react state is async so i need... multiple layers of temporary text
        let reallyTempText = tempText;
        if(reallyTempText.trim() == "") {
            reallyTempText = "Monumenta Builder";
        }
        setTempText(reallyTempText);
        setText(reallyTempText); // text and temptext are split so window title isn't updated by builder.js while we're typing
        setEditing(false);
        data.setUpdateLink(true);
    }

    function textchanged(e){
        setTempText(e.target.value);
    }

    function getPlaceholderBuildName() {
        // temporarily puts the name until useState loads, everything else is populated, etc
        try {
            return decodeURIComponent((data.build)[0].split("&").find(str => str.includes("name="))?.split("name=")[1] || "Monumenta Builder")
        } catch (e) {
            return "Monumenta Builder"
        }
    }

    return (
        <div className="row mb-4">
            <div className="col-12 text-center">
                <span className={styles.builderHeader}>
                    {
                        editing
                        ? <input type="text" value={tempText} 
                            onChange={textchanged} onKeyDown={keydown} spellCheck="false" 
                            className={styles.theTextbox} autoFocus onFocus={hasfocus} onBlur={lostfocus} />
                        : <h1 className={styles.builderHeaderText}>{
                            loaded ? text : getPlaceholderBuildName()
                        }</h1>
                    }
                    <span className={styles.spacer}></span>
                    <EditIcon className={styles.builderHeaderEditIcon} fontSize="large" onClick={editButtonClicked}/>
                </span>
            </div>
        </div>
    )
}