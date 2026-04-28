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
let found = false;
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('http://localhost') || content.includes('http://127.0.0.1') || content.includes('/api/api')) {
        console.log('Found in', file);
        found = true;
    }
});
if (!found) {
    console.log('No hardcoded URLs found.');
}
