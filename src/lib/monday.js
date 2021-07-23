module.exports.createItemInBoard = (user, category, description) => {
    const mondaySdk = require("monday-sdk-js")();
    mondaySdk.setToken(process.env.MONDAY_API_TOKEN);
    let stage_tags = { prod: 6767999, beta: 6768000, test: 6894835, dev: 6894837 };
    let stageTag = stage_tags[process.env.STAGE];
    let columnValues = JSON.stringify({
        user_id3: "" + user.id,
        text4: user.email,
        long_text: { text: description },
        category: { labels: [category] },
        tags: { tag_ids: [6894674, stageTag] }
    });
    let q = `
        mutation createItem($columnValues: JSON!){
        create_item (
            board_id: 725141553, 
         
            item_name: "${description.substring(0, 30)}", 
            column_values: $columnValues) {
            id
        }

        }
    `;
    // let q = `query { tags { name id }}`;
    console.log(q);
    return mondaySdk
        .api(q, {
            variables: {
                columnValues
            }
        })
        .then((res) => {
            console.log(JSON.stringify(res));
            return res;
        })
        .catch((e) => {
            console.log(e);
            return null;
        });
};
