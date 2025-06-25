export const formatNumber = function (number: any, precision = 2) {
    let parsedNumber = parseFloat(number);
    if(isNaN(parsedNumber)) parsedNumber = 0;
    return parsedNumber.toFixed(2);
}

