// parseCsv.js
import Papa from 'papaparse';

export function parseCsv(csvData, callback) {
    Papa.parse(csvData, {
        header: true,
        complete: function (results) {
            callback(results.data);
        }
    });
}
