import { Builder, Browser, By, until, Key } from 'selenium-webdriver';
import mysql from 'mysql2';
import db_config from './db-config.json' assert { type: "json" };
import { requestAladin } from './bookAPI/aladin.js';
import { createHash } from 'crypto';

const sleep = ms => new Promise( resolve => setTimeout(resolve, ms) );
const connection = mysql.createConnection({
    host:db_config.host,
    user:db_config.user,
    password:db_config.password,
    database:db_config.database,
});
connection.connect();

export const saveReviewPost = async (book) => {
    const driver = await new Builder().forBrowser(Browser.CHROME).build();
    await driver.get(book.link);
    
    let hundred_list = [];
    let my_review_list = [];

    try {
        await driver.wait(until.elementLocated(By.className("Ere_bo_title")), 5000);
        for (let i = 0; i < 50; i++) {
            await driver.executeScript(
                "window.scrollBy(0, window.innerHeight)");
            await sleep(100);
        }
        await driver.wait(until.elementLocated(By.id("CommentReviewList"), 5000));
        
        let tabTotal = await driver.wait(until.elementLocated(By.id("tabTotal")), 5000);
        await tabTotal.sendKeys(Key.ENTER);
        console.log(">> 100자평 전체 목록 전환");

        await driver.executeScript(`document.getElementById("hfReviewMorePageSize").value = 100`);
        await driver.executeScript(`fn_CommunityReviewMore()`);
        await sleep(1000);
        console.log(">> 100자평 목록 확장");

        for await (let element of await driver.findElements(By.xpath(
            `//div[contains(@id, "div_commentReviewPaper")]/div/a[1]`))) {
            let reviewText = await element.getText();
            if (reviewText.length > 0)
                hundred_list.push(reviewText);
        }
        console.log(">> 100자평 리스트 추가");

        
        await driver.executeScript(`fn_IsOrdererMyReview(2);`);
        console.log(">> 마이리뷰 전체 목록 전환");

        await driver.executeScript(`document.getElementById("hfMyReviewCurrentPage").value = 100`);
        await driver.executeScript(`MyReviewMore()`);
        await sleep(1000);
        await driver.executeScript(`document.querySelectorAll('div[id^="divPaper"]>a').forEach(e=>e.click())`);
        await sleep(1000);
        console.log(">> 마이리뷰 목록 확장");

        for await (let element of await driver.findElements(By.xpath(
            `//div[@class='paper-contents']/a`))) {
            let reviewText = await element.getAttribute("innerHTML");
            if (reviewText.length > 0)
                my_review_list.push(reviewText);
        }
        console.log(">> 마이리뷰 리스트 추가");

        // fs.writeFileSync(`${isbn}.json`, JSON.stringify({
        //     hundred_list: hundred_list,
        //     my_review_list: my_review_list
        // }));
    } catch (e) {
        console.log(e);
    } finally {
        await driver.quit();
    }

    const uid = "8O6VMedKBRUI7VLsmmC6NpAWbYI3";
    const today = new Date().toISOString().slice(0, 10);
    
    const getTimestamp = () => Math.floor(Date.now() / 1000).toString();
    const getHash = (str) => 
        createHash('sha256').update(str+getTimestamp()).digest('hex').slice(0, 42);

    hundred_list.forEach(review => {
        connection.query(
            "INSERT IGNORE INTO posts (postID, body, UID, status, create_at, isbn, title) VALUE (?, ?, ?, ?, ?, ?, ?);",
            [getHash(uid+review), review, uid, "good", today, book.isbn13, ""]
        );
    });
    
    my_review_list.forEach(review => {
        connection.query(
            "INSERT IGNORE INTO posts (postID, body, UID, status, create_at, isbn, title) VALUE (?, ?, ?, ?, ?, ?, ?);",
            [getHash(uid+review), review, uid, "good", today, book.isbn13, ""]
        );
    });

    return;
}

// requestAladin('lookUp', '9788954442718').then(async res => {
//     let book = res.item;
//     await saveReviewPost(book);
//     process.exit();
// });

connection.query("SELECT isbn FROM books", async (queryError, queryResponse) => {
    for (let b of queryResponse) {
        if (b.isbn.length < 13) continue;
        await requestAladin('lookUp', b.isbn).then(async res => {
            let book = res.item;
            await saveReviewPost(book);
        })
    }

    connection.destroy();
});