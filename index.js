const express = require('express')
const axios = require('axios')
const app = express();
const port = 8008;

app.get('/numbers',async(req,res) => {
    const urls = req.query.url;
    if(!urls || !Array.isArray(urls)) {
        return res.status(400)
    }
    
    const validUrls = urls.filter(url => isValidURL(url));

    try{
        const responses = await Promise.allSettled(validUrls.map(fetchNum));
        const validResponses = responses.filter(response => response.status === 'fulfilled')
        const numbers = mergeSort(validResponses.map(response => response.value ));
        res.json({numbers});
    }
    catch (error) {
        console.error('Error:' , error);
        res.status(500);
    }
     
})

app.listen(port , () => {
    console.log(`Server listening at http://localhost:${port}`);
});

function isValidURL(url) {
    try {
        new URL(url);
        return true;
    }
    catch (error) {
        return false;
    }
}

async function fetchNum(url) {
    try {
        const response = await axios.get(url, {timeout : 500});
        return {status: 'fulfilled', value: response.data.numbers};

    }catch (error) {
        return {status: 'rejected'}
    }
}

function mergeSort(arrays) {
    const merged = [].concat(...arrays);
    return [...new Set(merged)].sort((a,b) => a -b);
}
