# YouTube 字幕下載器

這是一個簡單的命令列工具，用於下載 YouTube 影片的字幕檔案。

## 功能特點

- 支援所有 YouTube 影片的可用字幕
- 提供互動式字幕語言選擇介面
- 自動下載選定的字幕檔案
- 將字幕保存為 VTT 格式

## 系統需求

- Node.js (建議版本 12.0.0 或更高)
- npm (Node.js 套件管理器)

## 安裝步驟

1. Clone 專案：
```bash
git clone [repository-url]
cd yt-cc-downloader
```

2. 安裝必要的依賴套件：
```bash
npm install
```

## 使用方法

1. 執行程式：
```bash
node app.js
```

2. 在提示時輸入 YouTube 影片網址

3. 從顯示的語言列表中選擇想要下載的字幕語言

4. 程式會自動下載選定的字幕檔案，並保存為 VTT 格式

## 注意事項

- 確保影片有可用的字幕
- 下載的字幕檔案會以 `subtitle_[語言代碼].vtt` 的格式命名

## 授權

MIT License 