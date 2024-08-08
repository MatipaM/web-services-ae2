import {cnn} from './rss/cnn_topstories';


export class RSSParser {
    constructor(url) {
        this.url = '../';
        this.feedData = null;
    }


    async fetchData() {
        try {
            let fileContents = cnn
            this.displayFeed(cnn)
    
        } catch (error) {
            console.error(`Error: ${error.message}`);
        }
    }
    
    async displayFeed(fileContents) {
        let titles = [];
        let descriptions = [];
    
        let start = 0;
        const end = fileContents.length;
    
        while (start < end) {
            // Find positions of title tags
            const titlePosStart = fileContents.indexOf("<title>", start) + 7;
            const titlePosEnd = fileContents.indexOf("</title>", titlePosStart)-5;
    
            // Find positions of description tags
            const descriptionPosStart = fileContents.indexOf("<description>", start) + 13;
            const descriptionPosEnd = fileContents.indexOf("</description>", descriptionPosStart)-5;
    
            // Break loop if no more tags are found
            if (titlePosStart === 6 || titlePosEnd === -1 || descriptionPosStart === 12 || descriptionPosEnd === -1) {
                break;
            }
    
            // Extract title and description
            const title = fileContents.slice(titlePosStart, titlePosEnd).trim();
            const description = fileContents.slice(descriptionPosStart, descriptionPosEnd).trim();
    
            // Push to arrays
            titles.push(title);
            descriptions.push(description);
    
            // Update start position to continue searching after the current description
            start = descriptionPosEnd + 14;
        }
    
        // Log results (or handle them as needed)
        console.log("Titles:", titles);
        console.log("Descriptions:", descriptions);
    }

}