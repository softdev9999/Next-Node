const api = require("lib/api");

const handler = async function (req, res_, { currentUserId }) {
    const { getMultiActivity, updateCurrentActivity, updateUserActivity, updateRoomActivity, prepareActivity } = require("lib/activity");
    const { lookupContent, browsingContentIdsForService } = require("lib/content");
    // Rest of the API logic
    let { body } = req;
    let response = {};

    switch (req.method) {
        case "POST": {
            if (currentUserId && body.roomId) {
                body.userId = currentUserId;
                let activity = prepareActivity(body);

                if ((activity.service == "youtube" || activity.service == "vimeo") && !activity.roomId) {
                    return { data: { success: true } };
                }
                if (activity.service) {
                    if (
                        activity.title &&
                        activity.duration &&
                        activity.duration > 1 &&
                        !(activity.videoType && (activity.videoType == "AD" || activity.videoType == "PROMO" || activity.videoType == "INTRO"))
                    ) {
                        //  console.log("*** STARTING CONTENT ACTIVITY ***", activity);

                        let lookupRes = await lookupContent(activity);
                        //   console.log("*** STARTING CONTENT ACTIVITY ***", lookupRes);

                        if (lookupRes) {
                            activity.contentId = lookupRes.contentId;
                            activity.contentItemsId = lookupRes.contentItemsId;
                        } else {
                            const { contentId, contentItemsId } = await browsingContentIdsForService(activity.service);
                            activity.contentId = contentId;
                            activity.contentItemsId = contentItemsId;
                        }
                    } else {
                        const { contentId, contentItemsId } = await browsingContentIdsForService(activity.service);
                        activity.contentId = contentId;
                        activity.contentItemsId = contentItemsId;
                    }
                }
                await updateUserActivity(activity);
                await updateCurrentActivity(activity);

                if (activity.roomId) {
                    await updateRoomActivity(activity);
                }

                return { data: { success: true } };
            }

            break;
        }
        case "GET": {
            let userIds = req.query.userIds;
            if (userIds) {
                userIds = userIds.split(",");
                console.log(userIds);
                let activity = await getMultiActivity(userIds);
                return { data: activity };
            }
            break;
        }
        case "PUT": {
            break;
        }
        case "DELETE": {
            break;
        }
    }
    return response;
};
export default api(handler);
