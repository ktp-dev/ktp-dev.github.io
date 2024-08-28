// parseCsv.js
import Papa from 'papaparse';

export function parseCsv(file, callback) {
    Papa.parse(file, {
        download: true,
        header: true,
        complete: function (results) {
            callback(results.data);
        }
    });
}
