/*
연관없는 내용 - 배송 기간, 포장상태, 해택을 위한 의미없는 리뷰는 내용이 비슷하거나 짧다.
1. 특정 글자 수(100자) 미만의 리뷰들을 데이터로 사용한다. 워드임베딩 후 유사도 계산을 해서 연관없는 내용 리뷰 모델을 만든다. 이 모델을 사용해서 연관없는 내용 필터링
-> 아직 미완성
2. 연관없는 내용의 리뷰들을 많이 찾아본 결과, 빠르다, 느리다, 상태, 받았다, 재밌다 등 정형화된 표현들 발견 -> 이러한 단어들 필터링과 특정 글자 수 미만 필터링을 
같이 하면 효과적일 것으로 예상함 -> 무식해보임 1번 방법이 좋을 듯
*/

function tokenizer(document){
    let mecab = require('mecab-ya');
    let tokenized_document = [];
    for(let i in document){
        tokenized_document.push(mecab.morphsSync(document[i]));
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

function get_idf(bow){
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

function get_tfidf(bow, idf){
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

function cosine_similarity(tfidf, docIndex){
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

function similarity_test(document, Index){
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

function normalize(vector){
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

//테스트
let document = [];
document.push('배송도 빠르고 잘 왔어요 배송 빠르고 잘 보겠습니다 잘 볼게요 배송이 빠르네요 선물용으로 구매함. 빨리 왔음'); 
/*
document.push('배송도 빠르고 잘 왔어요');
document.push('배송 빠르고 잘 보겠습니다');
document.push('잘 볼게요 배송이 빠르네요');
document.push('선물용으로 구매함. 빨리 왔음');
console.log(document);
*/
tokenizer(document); //유사도 오름차순 정렬해서 출력

/*
인덱스 기준 문서로 유사도 계산을 한다. 여기에 필터링 기준이 되는 모델을 넣으면 될듯
유사도 몇 기준으로 필터링할지??, 필터링 모델을 어떻게 만들지?? 얘기가 필요함
*/