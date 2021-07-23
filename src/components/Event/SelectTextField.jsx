import React from "react";
import PropTypes from "prop-types";
import { FormGroup, InputLabel, Select, InputBase, IconButton, MenuItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import ServiceIcon from "../Icon/ServiceIcon";

const useStyles = makeStyles((theme) => ({
    paper: {
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0,
        background: theme.gradients.create(30, `${theme.palette.primary.dark} 0%`, `${theme.palette.secondary.light} 100%`)
    },
    formGroup: {
        backgroundColor: theme.functions.rgba(theme.palette.common.white, 0.1),
        minHeight: theme.functions.rems(36),
        flexDirection: "row",
        alignItems: "center",
        marginTop: theme.functions.rems(10),
        marginBottom: theme.functions.rems(10)
    },
    inputLabel: {
        color: theme.palette.common.white,
        fontSize: theme.functions.rems(14),
        fontWeight: 800,
        letterSpacing: 0.25,
        lineHeight: theme.functions.rems(24),
        width: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: theme.functions.rems(36),
        [theme.breakpoints.down("xs")]: {
            fontSize: theme.functions.rems(14),
            width: '60%'
        },
        '@media (max-width: 320px)': {
            fontSize: theme.functions.rems(11),
        }
    },
    inputbase: {
        width: "50%",
        minHeight: theme.functions.rems(36),
        maxHeight: theme.functions.rems(36),
        backgroundColor: "rgba(255,255,255,0.1)",
        [theme.breakpoints.down("xs")]: {
            fontSize: theme.functions.rems(14),
            width: '40%'
        },
    },
    select: {
        paddingLeft: theme.spacing(1.5),
        paddingRight: `${theme.spacing(6)}!important`
    },
    selectMenu: {
        lineHeight: theme.spacing(3.6),
        fontSize: theme.spacing(2),
        letterSpacing: 0.29,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    icon: {
        padding: 0,
        top: "auto",
        height: "100%",
        background: "rgba(255,255,255,0.3)",
        borderRadius: 0,
        width: theme.spacing(5)
    },
    menuItem: {
        padding: theme.spacing(2),
        fontSize: theme.spacing(2.2),
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    menuIcon: {
        height: theme.spacing(2.1)
    }
}));

const IconComponent = (props) => {
    return (
        <IconButton {...props}>
            <KeyboardArrowDownIcon />
        </IconButton>
    );
};

const SelectTextField = ({ selectedValue, options, onChange }) => {
    const classes = useStyles();
    return (
        <FormGroup className={classes.formGroup}>
            <InputLabel component="div" className={classes.inputLabel}>
                Streaming service
            </InputLabel>
            <Select
                classes={{
                    select: classes.select,
                    selectMenu: classes.selectMenu,
                    icon: classes.icon
                }}
                value={selectedValue}
                onChange={onChange}
                input={<InputBase classes={{ root: classes.inputbase }} />}
                MenuProps={{
                    classes: {
                        paper: classes.paper
                    },
                    elevation: 0,
                    anchorReference: null,
                    anchorOrigin: { vertical: "bottom", horizontal: "center" },
                    transformOrigin: { vertical: "top", horizontal: "center" }
                }}
                IconComponent={IconComponent}
            >
                {options &&
                    options.map(
                        (item, index) =>
                            item != "scener" && (
                                <MenuItem key={index} className={classes.menuItem} value={item}>
                                    <ServiceIcon permissionToUse={true} centered name={item} height="1.1rem" />
                                </MenuItem>
                            )
                    )}
            </Select>
        </FormGroup>
    );
};

SelectTextField.propTypes = {
    selectedValue: PropTypes.string,
    options: PropTypes.instanceOf(Array),
    onChange: PropTypes.func
};

SelectTextField.defaultProps = {
    selectedValue: "",
    options: [],
    onChange: () => {}
};

export default SelectTextField;
