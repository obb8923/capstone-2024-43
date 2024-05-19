function spoilerFilter(reviewData, spoilerWord) { //리뷰 텍스트, 필터링 단어
    const pattern = spoilerWord.map(word => `(${word})`).join('|'); // 필터링 단어 사이에 다른 문자가 들어가는 경우도 필터링
    const regex = new RegExp(pattern, 'gi');

    for (let i = 0; i < reviewData.length; i++) {
        reviewData[i] = reviewData[i].replace(regex, '***');
    }

    return reviewData
}

module.exports = {
    spoilerFilter,
}