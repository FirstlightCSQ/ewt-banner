// ==UserScript==
// @name            去你大爷的升学e网通
// @name:en         Fuck for EWT360
// @version         2
// @description     去你大爷的升学e网通。
// @description:en  Fuck the EWT360.
// @include         *://teacher.ewt360.com/*
// @author          Ryan & ChatGPT
// @match           *://teacher.ewt360.com/*
// @run-at          document-start
// @grant           none
// @license         GPL-3.0-or-later
// ==/UserScript==

(function () {
    'use strict';

    // 醒目的日志输出
    function fakeLog(message) {
        console.log('%c' + message, 'font-family: "PingFang SC", HarmonyOS_Regular, "Helvetica Neue", "Microsoft YaHei", sans-serif; font-size: 1.5em; color: white; font-weight: bold; background-color:rgb(87, 0, 185); padding: 8px; border-radius: 6px;');
    }

    fakeLog('反防作弊启动');

    // 查找视频播放器
    async function findVideo() {
        fakeLog('查找视频播放器');
        for (let times = 0; times <= 20; times++) {
            const video = await new Promise(resolve => {
                setTimeout(() => {
                    // 尝试查找视频播放器
                    const video = document.querySelector('[aria-label="视频播放器"]');
                    if (video) {
                        fakeLog('找到视频播放器');
                        resolve(video);
                    } else {
                        fakeLog('未找到视频播放器，3 秒后继续查找');
                        resolve(null);
                    }
                }, 3000);
            });
            if (video) return video;
        }
        return null;
    }

    // 监听视频播放器
    function listenVideo(video) {
        fakeLog('开始监听视频播放器');
        // 定义监听器
        const videoListener = new MutationObserver((obj, items) => {
            for (let subObj of obj) {
                if (subObj.type === 'childList') {
                    // 遍历变化的子节点
                    for (let node of subObj.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 通过子串匹配类名，查找防作弊窗口
                            if (Array.from(node.classList).some(className => className.startsWith('video_earnest_check_box'))) {
                                fakeLog('找到防作弊窗口');
                                // 随机等待时间
                                const randomTime = Math.random() * 2 + 1;
                                fakeLog(`等待 ${randomTime.toFixed(2)} 秒`);
                                setTimeout(() => {
                                    // 遍历元素的子节点
                                    var BtnIsFound = false;
                                    for (let child of video.querySelectorAll('span')) {
                                        if (child.className && child.className.match(/^btn-.+/)) {
                                            fakeLog('找到按钮，模拟点击');
                                            child.click(); // 点击
                                            BtnIsFound = true;
                                            break;
                                        }
                                    }
                                    if (!BtnIsFound) fakeLog('未找到按钮');
                                }, randomTime * 1000);
                            } else if (Array.from(node.classList).some(className => className.startsWith('lesson-finished-container'))) {
                                fakeLog('课程完成，寻找下一节课');
                                // 查找课程列表
                                const list = document.querySelectorAll('[class*="listCon-"]');
                                list.forEach(listItem => {
                                    // 查找当前课程
                                    const current = listItem.querySelector('[class*="active-"]');
                                    if (current) {
                                        // 定位到下一个课程
                                        const next = current.nextElementSibling;
                                        // 是否已经听完
                                        if (/^noMore-.+/.test(next.className)) {
                                            // 如果匹配，弹窗
                                            alert('你已经刷完当前列表全部课程');
                                            fakeLog('当前列表没有更多课程');
                                        } else {
                                            fakeLog('找到下一节课');
                                            // 随机等待时间
                                            const randomTime = Math.random() * 2 + 1;
                                            fakeLog(`等待 ${randomTime.toFixed(2)} 秒`);

                                            setTimeout(() => {
                                                next.click();
                                                fakeLog('进入下一节课');
                                            }, randomTime * 1000);
                                        }
                                    }
                                });
                            }
                        }
                    }
                }
            }
        });
        // 开始监听
        videoListener.observe(video, { childList: true });

        // 定义视频播放器的移除事件监听器
        const videoRemovalListener = new MutationObserver((obj, items) => {
            for (const subObj of obj) {
                // 检查是否是元素被移除
                if (subObj.type === 'childList') {
                    // 遍历移除的节点
                    subObj.removedNodes.forEach(removedNode => {
                        if (removedNode === video) {
                            fakeLog('视频播放器被移除');
                            videoListener.disconnect();
                            videoRemovalListener.disconnect();
                            setTimeout(main, 3000);
                            return;
                        }
                    });
                }
            }
        });
        // 开始监听
        videoRemovalListener.observe(document.body, { childList: true, subtree: true });
    }

    // 主执行逻辑
    async function main() {
        const video = await findVideo();
        if (video) {
            listenVideo(video);
        }
    }

    main(); // 启动程序
})();
