/*
컨텐츠 기반 유사도 계산을 한다. 
1. 최근에 사용자가 본 리뷰 10개를 데이터베이스에서 가져온다.
2. 카테고리, 최근 작성된 리뷰 20개 이상 가져온다.
3. 1번 리뷰들 기준으로 2번 리뷰들을 tf-idf계산 후 코사인 유사도 계산한다.
4. 상위 유사도 20개를 사용자에게 포스팅해준다.

@@@@@@@@@
문제점 : 2번 리뷰들에 연관성이 없는 리뷰들만 있다면?? -> 2번 리뷰들끼리 상대적으로 비교하는 것은 한계가 있음, 절대적인 유사도 수치 기준이 필요함 절대적인 유사도 수치가 넘는
리뷰가 20개 미만이라면?? 
*/

function tokenizer(document){//모든 단어 추출
    let mecab = require('mecab-ya');
    let tokenized_document = [];
    for(let i in document){
        tokenized_document.push(mecab.morphsSync(document[i], function(err, result){
            if (err) {
                console.error(err);
                return;
            }
            console.log(result);
        }));
    }
    return tokenized_document;
}

function build_bag_of_words(tokenized_document){//문서 내 단어 등장횟수 세기
    let word_to_index = new Map();
    let total_bow = [];
    let total_document = [];
    let bow = [];
    
    // 하나의 문서로 통합
    for(let index in tokenized_document){
        for(let j in tokenized_document[index]){
            total_document.push(tokenized_document[index][j]);
        }
    }
    console.log('total document : ', total_document);
    
    // 단어에 index 맵핑
    for(let word in total_document){
        if(word_to_index.get(total_document[word]) == null){
            // 처음 등장하는 단어 처리
            word_to_index.set(total_document[word], word_to_index.size);
            total_bow.splice(word_to_index.size - 1, 0, 1);
        }
        else{
            // 재등장하는 단어 처리
            let index = word_to_index.get(total_document[word]);
            total_bow[index] = total_bow[index] + 1;
        }
    }
    
    for(let index in tokenized_document){
        let bow_temp = [];
        bow_temp.length = word_to_index.size;
        bow_temp.fill(0);
        
        // 개별 문서의 BOW 구하기(tf 구하기)
        for(let word in bow_temp){
            let i = word_to_index.get(tokenized_document[index][word]);
            bow_temp[i] = bow_temp[i] + 1;
        }
        
        // NaN 제거
        bow_temp = bow_temp.filter(function(item){
          return item !== null && item !== undefined && item !== '';
        });
        
        bow.push(bow_temp);
    }
    
    console.log('vocabulary : ', word_to_index);
    console.log('bag of words vectors(term frequency) : ', bow);
    
    return [word_to_index, bow];
}

function get_idf(bow){//단어별 중요도 구하기 - 많이 나온 단어는 안중요함
    let df = [];
    df.length = bow[0].length;
    df.fill(0);
    
    // df 구하기
    for(let i in df){
        for(let index in bow){
            if(bow[index][i] !== 0){
                df[i] += 1;
            }
        }
    }
    console.log('document frequency : ', df);

    let idf = [];
    let N = bow.length; // 전체 문서의 수
    idf.length = bow[0].length;
    idf.fill(0);
    
    // idf 구하기
    for(let i in idf){
        idf[i] = 1 + Math.log(N / (1 + df[i])); // 자연로그
    }
    console.log('inverse document frequency : ',idf);
    
    return idf;
}

function get_tfidf(bow, idf){//build_bag_of_words * get_idf 총 중요도 구하기
    // tfidf 구하기
    let tfidf = [];
    
    for(let i in bow){
        let tfidf_temp = [];
        tfidf_temp.length = bow[0].length;
        tfidf_temp.fill(0);
        
        for(let j in bow[0]){
            tfidf_temp[j] = bow[i][j] * idf[j];
        }
        
        tfidf.push(tfidf_temp);
    }
    console.log('TF-IDF : ', tfidf);
    
    return tfidf;
}

function cosine_similarity(tfidf, docIndex){//1번 리뷰랑 2번 리뷰 유사도 비교,정렬
    // docIndex 문서와 다른 모든 문서를 비교해서 코사인 유사도를 구함
    let cos_sim = [];
    let normalized_doc = normalize(tfidf[docIndex]); // 비교 문서
    
    for(let i in tfidf){
        let scalar_product = 0;
        for(let j in tfidf[i]){
            // docIndex번 벡터와 i번 벡터의 스칼라곱
            scalar_product += tfidf[docIndex][j] * tfidf[i][j];
        }
        
        let cos_sim_temp = 0;
        if(scalar_product === 0){
            // 분자가 0이면 코사인 유사도 = 0
            cos_sim_temp = 0;
        }
        else{
            // 분자가 0이 아니면 코사인 유사도 공식 사용
            cos_sim_temp = scalar_product / (normalized_doc * normalize(tfidf[i]));
            cos_sim_temp = Number(cos_sim_temp.toFixed(5));
        }
        
        let cos_sim_obj = {
            index: i,
            similarity: cos_sim_temp
        };
        cos_sim.push(cos_sim_obj);
    }

    // 유사도 오름차순 정렬    
    cos_sim.sort(function(a, b) {
        return b.similarity - a.similarity;
    });
    
    console.log('cosine_similarity : ', cos_sim);
    
    return cos_sim;
}

function similarity_test(document, Index){//다른 함수들 실행시켜줌
    // 문서 토큰화
    let tokenized_document = tokenizer(document);
    console.log('tokenized_document : ', tokenized_document);
    
    // 모든 단어에 index 맵핑
    let result = build_bag_of_words(tokenized_document);
    let vocab = result[0];
    let bow = result[1];

    // 모든 단어의 idf 구하기
    let idf = get_idf(bow);
    
    // 모든 문서의 tfidf 구하기
    let tfidf = get_tfidf(bow, idf);
    
    // 0번 문서와 나머지 문서의 유사도 검사
    let cos_sim = cosine_similarity(tfidf, Index);
}

function normalize(vector){//벡터 정규화 기능
    // 벡터 정규화 공식
    let sum_square = 0;
    for(let i in vector){
        sum_square += vector[i] * vector[i];
    }
    
    return Math.sqrt(sum_square);
}

module.exports = {
    tokenizer,
    build_bag_of_words,
    get_idf,
    get_tfidf,
    cosine_similarity,
    similarity_test,
};

/*
const mysql = require('mysql'); //mysql2로 사용

const connection = mysql.createConnection({
  host:aaa,
  user:aaa,
  password:aaa,
  database:aaa,
});

connection.connect((err) => {
  if (err) {
    console.error('연결 에러: ' + err.stack);
    return;
  }
});

//데이터베이스에서 유저가 본 리뷰를 시간 순으로 10개를 가져옴
const query = 'SELECT * FROM 유저 기록 테이블 WHERE user_id = '해당 사용자의 ID' ORDER BY 리뷰를 본 날짜 DESC LIMIT 10'; 

connection.query(query, (error, results, fields) => {
    if (error) throw error;
    // console.log(results);
*/

//1번 리뷰 테스트 데이터
let document = [];
document.push('출간소식 전해지자마자 샀네요 ~~^^ 읽는 내내 힘이되고 술술 잘읽혀 너무 신기했습니다. 지혜의 보물창고입니다. 책을 읽는 것과 운동하는 것을 특히 강조하셨는데 자극이됩니다. 손웅정님 너무 존경하고 사랑합니다. 앞으로도 함께하겠습니다. 항상 건강하시고 복많이 받으십시오. ^^ 감사합니다'); 
document.push('제목처럼 읽었고 쓰는 대신 밑줄치고 버렸습니다. 인터뷰 내용이 너무 산만하게 느껴져서 차라리 노트와 생각을 정리해서 출간했으면 어땠을까 아쉬웠습니다. ');
document.push('독서와 사색의 시간으로 다져진 손웅정 감독님의 삶을 읽는 통찰이 다양한 시각에서 공감을 불러 일으키는 내용으로 묻어났습니다. 인터뷰 형식으로 작성되어 읽기에도 편했구요. 친한 동생에게 조언보다 이 책을 선물하고 싶은 그런 마음입니다.');
document.push('첫 번째 책이랑 비슷하겠지? 하고 두번째 책을 샀는데인터뷰형식이라 느낌이 완전 달라 또 다르네요.바로 앞에서 손웅정님이 말해주는 것 처럼 그 분의 어법이 바로 느껴져 쉽게 전달이 됐어요. 손웅정님의 인생ㆍ가정교육ㆍ축구에 대한 철학을 이 책 한권으로 또 배워나갑니다.');
document.push('책장을 한장 넘겼을 뿐인데 2시간이 훌쩍 흘렀습니다. 인터뷰 형식으로 되어 있어 호불호가 갈릴 수 있겠으나 저의 경우에는 오히려 더 좋았습니다. 여러 주제에 대한 감독님의 생각을 두루두루 들을 수 있어 간만에 뜻깊은 독서시간이었습니다.');

//1번 리뷰들 하나의 문서로 퉁합
let total_document = [];
for(let i in document){
    total_document += document[i];
}

let data = [];
data.push(total_document);

// 2번 리뷰 테스트 데이터
data.push('출간되자마자 구매했어요! 필력과 삶의 내공이 범상치 않음이 느껴집니다. 가볍게 읽히지만 묵직한 울림을 주는 책입니다. 아이에게도 권할만큼 좋았습니다. 손웅정님 파이팅 입니다!');
similarity_test(data, 0); //1번 리뷰들(인덱스 0번) 기준으로 2번 리뷰들(인덱스 1 ~ N) 유사도 계산

/*
});

connection.end();
*/