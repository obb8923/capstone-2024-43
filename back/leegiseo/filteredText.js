// 글자 수로 필터링
function checkTextLength(text) {
    // 텍스트의 길이를 확인
    if (text.length < 100) {
        return null; // 100자 미만이면 null
    } else {
        return text; // 100자 이상이면 텍스트 리턴
    }
}

// 비속어 필터링, 스포일러 필터링
function negativeWordFilter(text, stopword) { //리뷰 텍스트, 필터링 단어
    const pattern = stopword.split('').join('(?:[^\uAC00-\uD7A3])*'); // 필터링 단어 사이에 다른 문자가 들어가는 경우도 필터링
    const regex = new RegExp(pattern, 'gi');
    return text.replace(regex, '*');
}

//비속어는 스탑워드 파일을 가져오거나 직접 만들어서 적용함
//스포일러는 api에서 제목, 작가, 번역 등 가져와서 필터링 단어로 설정한다 (줄거리를 필터링해야할까?? 어려워질 거 같음)

console.log(negativeWordFilter("안1dd녕하세요 반갑습니다", "안녕"));