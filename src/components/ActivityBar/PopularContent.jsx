import useSWR from "swr";
import { Grid, Button, Typography, CircularProgress } from "@material-ui/core";
import config from "../../config";
import ActivityBarSection from "./ActivityBarSection";
import NavLink from "../NavLink/NavLink";
import GetScenerButton from "../GetScenerButton/GetScenerButton";

const PopularContent = ({ service }) => {
    const { data: content, error } = useSWR(() => "/content/popular" + (service ? "?service=" + service : ""));
    if (content) {
        return (
            <ActivityBarSection title={"Popular" + (service && config.SERVICE_LIST[service] ? " on " + config.SERVICE_LIST[service].name : "")}>
                <Grid container spacing={0} style={service ? null : { padding: "1rem" }}>
                    {content.items.length > 0 &&
                        content.items
                            .filter((c) => c.img)
                            .slice(0, 5)
                            .map((c) => (
                                <Grid
                                    key={c.id}
                                    item
                                    container
                                    alignItems="stretch"
                                    justify="space-between"
                                    wrap="nowrap"
                                    spacing={0}
                                    style={{ marginBottom: ".75rem", backgroundColor: "rgba(255,255,255,.07)", height: "8rem" }}
                                >
                                    <div
                                        style={{
                                            flex: "0 0 26.7%",
                                            height: "100%",
                                            backgroundImage: `url(${c.img})`,
                                            backgroundSize: "cover",
                                            backgroundPosition: "center center"
                                        }}
                                    ></div>
                                    <div style={{ flex: "0 1 100%", height: "100%" }}>
                                        <Grid item container alignContent="space-between" justify="flex-start">
                                            {!service && (
                                                <Grid item xs={12}>
                                                    <Typography variant="overline" style={{ borderBottom: "solid 1px white", margin: "1rem" }}>
                                                        {config.SERVICE_LIST[c.service] ? config.SERVICE_LIST[c.service].name : c.service}
                                                    </Typography>
                                                </Grid>
                                            )}
                                            <Grid item xs={12}>
                                                <Typography
                                                    align="left"
                                                    variant="subtitle1"
                                                    style={{
                                                        margin: "0.5rem 1rem",
                                                        WebkitLineClamp: "2",
                                                        WebkitBoxOrient: "vertical",
                                                        display: "-webkit-box",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis"
                                                    }}
                                                >
                                                    {c.title}
                                                </Typography>
                                            </Grid>


                                            <Grid item xs={12}>
                                              <GetScenerButton
                                                  invert={true}
                                                  contentId={c.id}
                                                  invertedColor="primary"
                                                  style={{ whiteSpace: "normal", margin: "0.5rem 1rem" }}
                                                  source="Popular"
                                              />

                                            </Grid>
                                        </Grid>
                                    </div>
                                </Grid>
                            ))}
                </Grid>
            </ActivityBarSection>
        );
    } else if (error) {
        return <></>;
    } else {
        return (
            <Grid container justify="center">
                <Grid item>
                    <CircularProgress size={"5rem"} />
                </Grid>
            </Grid>
        );
    }
};

export default PopularContent;
