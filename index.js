const fs = require('fs');
const path = require('path');

const fileName = `${__dirname}/testFolder`;
let previousFiles;
let currentFiles;
let timer;

function readfiles() {
    return new Promise((resolve, reject) => {
        fs.readdir(fileName, (err, files) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(files);
            }
        });
    });
}

async function initialize() {
    previousFiles = await readfiles();
    console.log('Initial files:', previousFiles);
}

initialize();

fs.watch(fileName, async (eventType, filename) => {
    if (timer) {
        clearTimeout(timer);
    }

    timer = setTimeout(async () => {
        currentFiles = await readfiles();
        let hours = new Date().getHours();
        let minutes = new Date().getMinutes();
        let seconds = new Date().getSeconds();
        if (hours > 12) {
            hours -= 12;
        }

        hours = String(hours).padStart(2, '0');
        minutes = String(minutes).padStart(2, '0');
        seconds = String(seconds).padStart(2, '0');

        if (eventType === 'rename') {
            for (let i = 0; i < previousFiles.length; i++) {
                if (!currentFiles.includes(previousFiles[i])) {
                    console.log(`${previousFiles[i]} was removed at ${hours}:${minutes}:${seconds}`);
                } else if (previousFiles.indexOf(previousFiles[i]) !== currentFiles.indexOf(previousFiles[i])) {
                    console.log(`${previousFiles[i]} was moved at ${hours}:${minutes}:${seconds}`);
                }
            }
            for (let i = 0; i < currentFiles.length; i++) {
                if (!previousFiles.includes(currentFiles[i])) {
                    console.log(`${currentFiles[i]} was added at ${hours}:${minutes}:${seconds}`);
                }
            }
            previousFiles = currentFiles;
        }

        if (eventType === 'change') {
            console.log(`${filename} was changed at ${hours}:${minutes}:${seconds}`);
        }

        console.log('Current files:', currentFiles);
    }, 100); 

});
