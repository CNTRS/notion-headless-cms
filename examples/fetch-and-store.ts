/**
 * This is an example of how to use this library to fetch all pages
 * from given database with its content and store it in json file
 */
import NotionCMS from "../src/cms";
import fs from "fs";

(async () => {
    const access_token = String(process.env.NOTION_TOKEN);
    const database_id = String(process.env.NOTION_DB);

    try {
        const client = new NotionCMS({ token: access_token, db: database_id });

        const data = await client.getAllPagesContent();

        fs.writeFileSync("data.json", JSON.stringify({ data }));
    } catch (err) {
        console.log("Error caching data from Notion API:", err);
        throw err;
    }
})();
