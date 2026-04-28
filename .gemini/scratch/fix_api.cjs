const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.js') || file.endsWith('.vue')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('./src');
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;
    
    if (content.includes('clientApi')) {
        // Regex to replace 'import clientApi from "..."' or 'import clientApi from "..."'
        content = content.replace(/import\s+clientApi\s+from\s+(['"])(.*?)\/clientApi\1/g, 'import api from $1$2/api$1');
        
        // Sometimes getApiErrorMessage is imported from clientApi
        content = content.replace(/import\s+\{\s*getApiErrorMessage\s*\}\s+from\s+(['"])(.*?)\/clientApi\1/g, 'import { getApiErrorMessage } from $1$2/api$1');
        
        // Method calls
        content = content.replace(/clientApi\./g, 'api.');
        
        // Any remaining standalone references
        content = content.replace(/\bclientApi\b/g, 'api');
        changed = true;
    }
    
    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated', file);
    }
});
