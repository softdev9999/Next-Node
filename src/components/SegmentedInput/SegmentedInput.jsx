import React, { useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Typography, TextField } from "@material-ui/core";
import { useState } from "react";
import { useRef } from "react";
const useStyles = makeStyles((theme) => ({
    container: {
        display: "flex",
        flexFlow: "row nowrap",
        justifyContent: "center",
        alignItems: "center",
        padding: theme.spacing(1, 0)
    }
}));

const SegmentedInput = ({
    segments,
    divider,
    placeholders,
    placeholdersAreLabels,
    inputProps,
    onChange,
    value,
    error,
    helperText,
    label,
    segmentProps
}) => {
    const classes = useStyles();
    const [internalValue, setInternalValue] = useState(value);
    const [segmentValues, setSegmentValues] = useState(new Array(segments.length).fill(""));
    const inputRefs = useRef([]).current;
    const theme = useTheme();
    const onUpdate = (val, index) => {
        if (val.length <= segments[index]) {
            setSegmentValues((iv) => {
                let nvs = iv.slice();
                nvs.splice(index, 1, val);
                return nvs;
            });
        } else {
            setSegmentValues(() => {
                let strippedVal = val.replace(/[^a-zA-Z0-9]/gi, "");
                console.log(strippedVal);
                let nvs = [];
                for (let i = 0; i < segments.length && strippedVal.length > 0; i++) {
                    nvs.push(strippedVal.substring(0, segments[i]));
                    strippedVal = strippedVal.substring(segments[i]);
                }
                return nvs;
            });
        }
        if (val.length == segments[index] && index < segments.length) {
            inputRefs[index + 1] && inputRefs[index + 1].focus();
        }
    };
    const setInputRef = (el, index) => {
        inputRefs[index] = el;
    };

    useEffect(() => {
        let vs = value.split(divider);
        let newvs = [];
        for (let i = 0; i < segments.length; i++) {
            if (vs[i]) {
                newvs.push(vs[i]);
            } else {
                newvs.push("");
            }
        }
        setSegmentValues(newvs);
    }, [value, segments]);

    useEffect(() => {
        if (segmentValues) {
            setInternalValue(segmentValues.join(divider));
        }
    }, [segmentValues]);

    useEffect(() => {
        if (internalValue != value) {
            onChange(internalValue);
        }
    }, [internalValue]);

    const getSegmentProps = (index) => {
        if (segmentProps && segmentProps[index]) {
            return segmentProps[index];
        } else {
            return {};
        }
    };

    return (
        <>
            {label && (
                <Typography align="left" variant="h6" gutterBottom>
                    {label}
                </Typography>
            )}
            <div className={classes.container}>
                {segments.map((s, i) => (
                    <div
                        key={2 * i - 1}
                        style={{
                            order: 2 * i - 1,
                            flex: "0 1 " + theme.spacing(5 * s)
                        }}
                    >
                        <TextField
                            error={error}
                            label={placeholders && placeholdersAreLabels ? placeholders[i] : null}
                            inputRef={(el) => setInputRef(el, i)}
                            placeholder={placeholders && !placeholdersAreLabels ? placeholders[i] : null}
                            value={segmentValues[i]}
                            {...inputProps}
                            {...getSegmentProps(i)}
                            onChange={({ currentTarget }) => onUpdate(currentTarget.value, i)}
                        />
                    </div>
                ))}
                {segments.map(
                    (s, i) =>
                        i < segments.length - 1 && (
                            <div
                                key={2 * i}
                                xs={1}
                                style={{
                                    order: 2 * i,
                                    flex: "0 0 2rem",
                                    marginLeft: theme.spacing(0),
                                    marginRight: theme.spacing(0)
                                }}
                            >
                                <Typography variant={"h3"} align="center">
                                    {divider}
                                </Typography>
                            </div>
                        )
                )}
            </div>
            {helperText && <Typography color="error">{helperText}</Typography>}
        </>
    );
};
SegmentedInput.defaultProps = {
    segments: [1],
    divider: "-"
};
export default SegmentedInput;
