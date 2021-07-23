import { Typography, withStyles } from "@material-ui/core";
import Popup from "../../../Popup/Popup";

const AudioInfoView = ({ onDismiss }) => {
    return (
        <Popup
            modal={true}
            askSave={"Don't show again"}
            visibleId={"wearHeadphones"}
            onDismiss={() => onDismiss()}
            title={"USE HEADPHONES"}
            dismissTitle={"GOT IT"}
        >
            <Typography style={{ fontWeight: 600, marginBottom: 20 }} variant={"body1"}>
                To prevent echo, use headphones
            </Typography>
        </Popup>
    );
};

const styles = (theme_) => ({});

export default withStyles(styles)(AudioInfoView);
