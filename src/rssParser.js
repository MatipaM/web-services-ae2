import {cnn} from './rss/cnn';
import {bbc} from './rss/bbc';
import {nytimes} from './rss/nytimes';


export class RSSParser {
    constructor(name) {
        this.fileName = name
    }


    async displayArticle() {
        // let fileContents = fileName
        let fileContents = cnn

        let titles = [];
        let descriptions = [];
    
        let start = 0;
        const end = fileContents.length;
    
        while (start < end) {
            // Find positions of title tags
            const titlePosStart = fileContents.indexOf("<title>", start) + 17;
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
            let description = fileContents.slice(descriptionPosStart, descriptionPosEnd).trim();
            description = description.replace(`<![CDATA[`,` `)
            console.log(description)
    
            // Push to arrays
            titles.push(title);
            descriptions.push(description);
    
            // Update start position to continue searching after the current description
            start = descriptionPosEnd + 14;
        }
    
        // Log results (or handle them as needed)
        console.log("Titles:", titles);

        let dictionary = {};

        for (let i = 2; i < titles.length; i++) {
            dictionary[titles[i]] = descriptions[i];
}
        console.log("Descriptions:", dictionary);
        return dictionary
        // return(titles, description)
    }

   

}