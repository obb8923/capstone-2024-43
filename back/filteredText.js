// 글자 수로 필터링
function checkTextLength(text) {
    // 텍스트의 길이를 확인
    if (text.length < 50) {
        return null; // 50자 미만이면 null
    } else {
        return text; // 50자 이상이면 텍스트 리턴
    }
}

// 스포일러 필터링
// 스포일러는 api에서 제목, 작가, 번역 등 가져와서 필터링 단어로 설정한다 (줄거리를 필터링해야할까?? 어려워질 거 같음)
// 스탑워드는 리스트 형태
function spoilerFilter(text, stopword) { //리뷰 텍스트, 필터링 단어
    const pattern = stopword.map(word => `(${word})`).join('|'); // 필터링 단어 사이에 다른 문자가 들어가는 경우도 필터링
    const regex = new RegExp(pattern, 'gi');
    return text.replace(regex, '*');
}