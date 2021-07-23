import { DialogContent, DialogActions, Typography, Button } from "@material-ui/core";
const RemoveCoHostConfirmation = ({ onDismiss, user }) => {
    return (
        <>
            <DialogContent>
                <Typography variant="h4">Are you sure?</Typography>
                <Typography>You can reinvite @{user.username} to co-host.</Typography>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="primary" onClick={() => onDismiss(false)}>
                    CANCEL
                </Button>
                <Button variant="contained" color="secondary" onClick={() => onDismiss(true)} fullWidth>
                    REMOVE
                </Button>
            </DialogActions>
        </>
    );
};
export default RemoveCoHostConfirmation;
