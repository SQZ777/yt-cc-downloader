const request = require('request');
const readline = require('readline');
const fs = require('fs');

// 取得 YouTube 頁面的 HTML 內容
function getHtml(url, callback) {
    request(url, (error, response, body) => {
        if (error) {
            callback(error);
        } else {
            callback(null, body);
        }
    });
}

// 從 HTML 中提取 ytInitialPlayerResponse 對象
function extractPlayerResponse(html) {
    const regex = /ytInitialPlayerResponse\s*=\s*({.*?});/s;
    const match = html.match(regex);
    if (match) {
        try {
            console.log(JSON.parse(match[1]));
            return JSON.parse(match[1]);
        } catch (e) {
            return null;
        }
    }
    return null;
}

// 從 playerResponse 中獲取字幕軌道
function getCaptionTracks(playerResponse) {
    if (playerResponse && playerResponse.captions && playerResponse.captions.playerCaptionsTracklistRenderer) {
        return playerResponse.captions.playerCaptionsTracklistRenderer.captionTracks;
    }
    return [];
}

// 獲取可用字幕語言及其軌道
function getAvailableLanguages(url, callback) {
    getHtml(url, (error, html) => {
        if (error) {
            callback(error);
        } else {
            const playerResponse = extractPlayerResponse(html);
            const captionTracks = getCaptionTracks(playerResponse);
            callback(null, captionTracks);
        }
    });
}

// 選擇字幕語言
function chooseLanguage(languages, callback) {
    console.log('可用的字幕語言：');
    languages.forEach((lang, index) => {
        console.log(`${index + 1}. ${lang.name} (${lang.code})`);
    });
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('請輸入數字選擇語言：', (answer) => {
        rl.close();
        const choice = parseInt(answer) - 1;
        if (choice >= 0 && choice < languages.length) {
            callback(null, languages[choice]);
        } else {
            callback(new Error('無效的選擇'));
        }
    });
}

// 下載字幕
function downloadSubtitle(url, langCode, callback) {
    request(url, (error, response, body) => {
        if (error) {
            callback(error);
        } else {
            const filename = `subtitle_${langCode}.vtt`;
            fs.writeFile(filename, body, (err) => {
                if (err) {
                    callback(err);
                } else {
                    callback(null, filename);
                }
            });
        }
    });
}

// 獲取用戶輸入的 YouTube 連結
function getUserInput(callback) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('請輸入 YouTube 視頻連結：', (url) => {
        rl.close();
        callback(url);
    });
}

function main() {
    getUserInput((url) => {
        getAvailableLanguages(url, (error, captionTracks) => {
            if (error) {
                console.error('錯誤：', error);
                return;
            }
            if (captionTracks.length === 0) {
                console.log('此影片沒有可用的字幕。');
                return;
            }
            const languages = captionTracks.map(track => ({
                code: track.languageCode,
                name: track.name.simpleText
            }));
            chooseLanguage(languages, (err, selectedLang) => {
                if (err) {
                    console.error('錯誤：', err);
                    return;
                }
                const selectedTrack = captionTracks.find(track => track.languageCode === selectedLang.code);
                if (selectedTrack) {
                    const subtitleUrl = selectedTrack.baseUrl;
                    downloadSubtitle(subtitleUrl, selectedLang.code, (downloadErr, filename) => {
                        if (downloadErr) {
                            console.error('下載字幕時出錯：', downloadErr);
                        } else {
                            console.log(`字幕已下載：${filename}`);
                        }
                    });
                } else {
                    console.error('未找到所選語言的字幕。');
                }
            });
        });
    });
}

// 啟動程序
main();