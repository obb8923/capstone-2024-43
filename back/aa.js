const mecab = require('mecab-ya');

const text = "배송 빠르고 잘 보겠습니다";

const result = mecab.morphsSync(text);

console.log(result);