import { parse } from 'csv-parse';
import fs from 'node:fs';

const csvPath = new URL('./tasks.csv', import.meta.url);

const stream = fs.createReadStream(csvPath);

const OPTIONS = parse({
    delimiter: ",",
    fromLine: 2, 
    skipEmptyLines: true,
});


async function readFile(){
    const URL = 'http://localhost:8888/tasks'
    const linesParse = stream.pipe(OPTIONS);

    for await (const line of linesParse) {
      const [title, description] = line;
      await fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description})
      })

    }
}

readFile()
