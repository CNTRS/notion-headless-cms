/**
 * This is an example of how to use this library to fetch all pages
 * from given database with its content and store it in json file
 */
import { createDefaultCMS } from "../src/main";
import fs from "fs";

(async () => {
    const access_token = String(process.env.NOTION_TOKEN);
    const database_id = String(process.env.NOTION_DB);

    try {
        const cms = createDefaultCMS(access_token, database_id);
        const data = await cms.getAllPagesContent();

        fs.writeFileSync("data.json", JSON.stringify({ data }));
    } catch (err) {
        console.log("Error caching data from Notion API:", err);
        throw err;
    }
})();
