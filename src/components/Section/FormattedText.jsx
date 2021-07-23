import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme_) => ({
    text: {}
}));

function FormattedText({ text, tags, links, style }) {
    const parseText = (textstring, allowedtags, uselinks) => {
        import("sanitize-html").then(({ default: sanitizeHtml }) => {
            import("linkifyjs/html").then(({ default: linkifyHtml }) => {
                if (allowedtags && allowedtags.includes("br")) {
                    // also convert line breaks since we allow br
                    textstring = textstring.replace(/(?:\r\n|\r|\n)/g, "<br />");
                }

                const cleaned = sanitizeHtml(textstring, {
                    allowedTags: allowedtags ? allowedtags : [],
                    allowedAttributes: {}
                });

                let linkcleaned = uselinks
                    ? linkifyHtml(cleaned, {
                          defaultProtocol: "https"
                      })
                    : cleaned;

                setFormattedText(linkcleaned);
            });
        });
    };

    const classes_ = useStyles();
    const [formattedText, setFormattedText] = useState(null);

    useEffect(() => {
        if (text) {
            parseText(text, tags, links);
        }
    }, [text, tags, links]);

    return <>{formattedText && <div style={style} dangerouslySetInnerHTML={{ __html: formattedText }}></div>}</>;
}

export default FormattedText;
