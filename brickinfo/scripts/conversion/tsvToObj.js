export function tsvToObj(_a) {
    var data = _a.data, downloadType = _a.downloadType;
    var newObj = {};
    console.log('downloadType: ', downloadType);
    var lines = data.split('\r\n');
    console.log(downloadType, 'lines: ', lines);
    lines.forEach(function (line, index) {
        if (index !== 0 && line !== '') {
            var splitLine = line.split("\t");
            switch (downloadType) {
                case 'itemtypes':
                    newObj[splitLine[0]] = splitLine[1];
                    break;
                case 'categories':
                    newObj[splitLine[0]] = splitLine[1];
                    break;
                case 'colors':
                    newObj[splitLine[1]] = splitLine[0];
                    break;
                case 'codes':
                    newObj[splitLine[2]] = { itemId: splitLine[0], colorName: splitLine[1] };
                    break;
                default:
                    console.log({ word: 'Error', data: 'Unexpected tsv, not sure what to do.' });
            }
        }
    });
    return newObj;
}
