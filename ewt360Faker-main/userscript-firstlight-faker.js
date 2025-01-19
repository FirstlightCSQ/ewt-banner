// ==UserScript==
// @name            升学e网通 - 反防作弊
// @name:en         EWT360 - Faker
// @version         1.1
// @description     自动通过听课检测。
// @description:en  Automatically passes the listening test.
// @include         *://teacher.ewt360.com/*
// @author          firstlight & ChatGPT
// @match           *://teacher.ewt360.com/*
// @run-at          document-end
// @grant           none
// @license         GPL-3.0-or-later
// ==/UserScript==

(function () {
    'use strict';

    // 定义一个启动观察器的函数
    const startObserver = () => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        // 确保是元素节点
                        if (node.nodeType === 1) {
                            // 检查是否包含目标 class
                            if (node.classList.contains('video_earnest_check_box-1WVDK')) {
                                console.log('发现目标元素！');

                                // 查找按钮
                                const button = node.querySelector('.btn-3LStS');
                                if (button) {
                                    console.log('找到按钮，准备点击！');

                                    // 延时点击按钮
                                    setTimeout(() => {
                                        button.click();
                                        console.log('按钮已点击！');
                                    }, 500); // 延时 500 毫秒点击
                                }
                            }
                        }
                    });
                }
            });
        });

        // 开始监听整个文档的变动
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        console.log('DOM 监听已启动...');
    };

    // 确保脚本在网页加载完成后运行
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', startObserver);
    } else {
        startObserver();
    }
})();
