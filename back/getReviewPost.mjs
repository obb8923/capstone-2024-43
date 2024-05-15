import { Builder, Browser, By, until, Key } from 'selenium-webdriver';
import fs from 'fs';
import mysql from 'mysql2';
import db_config from './db-config.json' assert { type: "json" };
import { requestAladin } from './bookAPI/aladin.js';

const sleep = ms => new Promise( resolve => setTimeout(resolve, ms) );
const connection = mysql.createConnection({
    host:db_config.host,
    user:db_config.user,
    password:db_config.password,
    database:db_config.database,
});
connection.connect();

const uid = "8O6VMedKBRUI7VLsmmC6NpAWbYI3";
const today = new Date().toISOString().slice(0, 10);

export const saveReviewPost = async () => {
    const driver = await new Builder().forBrowser(Browser.CHROME).build();
    // console.log(book.link);
    await driver.get(`https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=${itemId}`);
    // await driver.get(book.link);
    
    let hundred_list = [];
    let my_review_list = [];

    try {
        await driver.executeScript("window.scrollTo(0, document.body.scrollHeight)");
        await driver.wait(until.elementLocated(By.id("CommentReviewList"), 500));
        
        let tabTotal = await driver.wait(until.elementLocated(By.id("tabTotal")), 500);
        await tabTotal.sendKeys(Key.ENTER);
        console.log(">> 100자평 전체 목록 전환");

        await driver.executeScript(`document.getElementById("hfReviewMorePageSize").value = 100`);
        await driver.executeScript(`fn_CommunityReviewMore()`);
        await sleep(1000);
        console.log(">> 100자평 목록 확장");

        for await (let element of await driver.findElements(By.xpath(
            `//div[contains(@id, "div_commentReviewPaper")]/div/a[1]`))) {
            hundred_list.push(await element.getText());
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
            my_review_list.push(await element.getAttribute("innerHTML"));
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
        
        hundred_list.forEach(review => {
            connection.query(
                `INSERT IGNORE INTO posts (postID, body, UID, status, create_at, isbn, title)
                VALUES ("${uid+today}", "${review}", "${uid}", "good", "${today}", "${book.isbn}", "", )`)
        });
        
        my_review_list.forEach(review => {
            connection.query(
                `INSERT IGNORE INTO posts (postID, body, UID, status, create_at, isbn, title)
                VALUES ("${uid+today}", "${review}", "${uid}", "good", "${today}", "${book.isbn}", "", )`)
        });

    }    
}


requestAladin('lookUp', '9788954442718').then(res => {
    let book = res.item;
    saveReviewPost(book);
});
