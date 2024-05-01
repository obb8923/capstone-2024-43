/*
컨텐츠 기반 유사도 계산을 한다. 
최근에 사용자가 본 리뷰 10개를 데이터베이스에서 가져와 유사도 계산을 해서 유사도 높은 순으로 리뷰를 보여줌.
*/

function tokenizer(document){
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

function build_bag_of_words(tokenized_document){
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

function get_tfidf(bow){
    let tf = [];
    tf.length = bow[0].length;
    tf.fill(0);
    
    // tf 구하기
    for(let i in tf){
        for(let index in bow){
            if(bow[index][i] !== 0){
                tf[i] += 1;
            }
        }
    }
    console.log('term frequency : ', tf);

    let idf = [];
    let N = bow.length; // 전체 문서의 수
    idf.length = bow[0].length;
    idf.fill(0);
    
    // idf 구하기
    for(let i in idf){
        idf[i] = 1 + Math.log(N / (1 + tf[i])); // 자연로그
    }
    console.log('inverse document frequency : ',idf);
    
    let tfidf = [];
    tfidf.length = tf.length;
    tfidf.fill(0);
    
    for(let i = 0; i < tfidf.length; i++){
        tfidf[i] = tf[i] * idf[i];
    }
    
    console.log('TF-IDF : ', tfidf);

    return tfidf;
}

// 두 벡터 간의 내적을 계산하는 함수
function dotProduct(vecA, vecB) {
    let product = 0;
    for (let i = 0; i < vecA.length; i++) {
        product += vecA[i] * vecB[i];
    }
    return product;
}

// 벡터의 크기(매그니튜드)를 계산하는 함수
function magnitude(vec) {
    let sum = 0;
    for (let i = 0; i < vec.length; i++) {
        sum += vec[i] * vec[i];
    }
    return Math.sqrt(sum);
}

// 두 문서 간의 코사인 유사도를 계산하는 함수
function cosine_similarity(tfidf1, tfidf2) {
    return dotProduct(tfidf1, tfidf2) / (magnitude(tfidf1) * magnitude(tfidf2));
}

function similarity_test(document1, document2){
    // 문서 토큰화
    let tokenized_document1 = tokenizer(document1);
    let tokenized_document2 = tokenizer(document2);
    console.log('tokenized_document1 : ', tokenized_document1);
    console.log('tokenized_document2 : ', tokenized_document2);
    
    // 모든 단어에 index 맵핑
    let result1 = build_bag_of_words(tokenized_document1);
    let vocab = result1[0];
    let bow = result1[1];
    
    // 유저가 본 리뷰들의 tfidf 구하기
    let userHistory = get_tfidf(bow);
    
    // 0번 문서와 나머지 문서의 유사도 검사
    let cos_sim = cosine_similarity(userHistory, Index);
    console.log('cosine_similarity : ', cos_sim);
}

module.exports = {
    tokenizer,
    build_bag_of_words,
    get_tfidf,
    dotProduct,
    magnitude,
    cosine_similarity,
    similarity_test,
};

/*
const mysql = require('mysql');

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

    let userHistory = [];
    userHistory.push(results);
*/
//테스트 데이터
let userHistory = [];
userHistory.push('배송도 빠르고 잘 왔어요');
userHistory.push('배송 빠르고 잘 보겠습니다');
userHistory.push('잘 볼게요 배송이 빠르네요');
userHistory.push('선물용으로 구매함. 재미있어요');
//userHistory.push('읽고 쓰고 버린 후에 남은 문장들. 그 문장들이 핑과 퐁으로 만나 핑퐁 같은 대화가 죽 이어진다. 대화가 거듭될수록 펑펑 터지는 앎, 푹푹 빠지는 삶. 유쾌하고도 깊고, 날렵하면서도 묵직한 책이다.');
//userHistory.push('출간소식 전해지자마자 샀네요 ~~^^ 읽는 내내 힘이되고 술술 잘읽혀 너무 신기했습니다. 지혜의 보물창고입니다. 책을 읽는 것과 운동하는 것을 특히 강조하셨는데 자극이됩니다. 손웅정님 너무 존경하고 사랑합니다. 앞으로도 함께하겠습니다. 항상 건강하시고 복많이 받으십시오. ^^ 감사합니다');
console.log(userHistory);
similarity_test(userHistory, '읽고 쓰고 버린 후에 남은 문장들. 그 문장들이 핑과 퐁으로 만나 핑퐁 같은 대화가 죽 이어진다. 대화가 거듭될수록 펑펑 터지는 앎, 푹푹 빠지는 삶. 유쾌하고도 깊고, 날렵하면서도 묵직한 책이다.'); //유사도 오름차순 정렬해서 출력
/*
});

connection.end();
*/