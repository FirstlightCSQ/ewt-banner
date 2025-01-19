// ==UserScript==
// @name            升学e网通 - 自动跳课
// @name:en         EWT360 - Jumper
// @version         1.9
// @description     自动检测任务完成，支持手动停止和重新开始自动跳转。
// @description:en  Automatically detects task completion with options to stop or restart auto-jumping.
// @include         *
// @author          firstlight & ChatGPT
// @match           *://teacher.ewt360.com/*
// @run-at          document-end
// @grant           none
// @license         GPL-3.0-or-later
// ==/UserScript==

(function () {
    'use strict';

    console.log('升学e网通 - 自动跳课脚本已启动');

    let isAutoJumpEnabled = true; // 控制是否启用自动跳课的标志
    let observer; // 用于存储 MutationObserver 实例

    // 添加控制按钮
    function addControlButtons() {
        const controlPanel = document.createElement('div');
        controlPanel.style.position = 'fixed';
        controlPanel.style.bottom = '10px';
        controlPanel.style.right = '10px';
        controlPanel.style.zIndex = '9999';
        controlPanel.style.backgroundColor = 'rgba(10, 36, 99, 0.9)'; // 深蓝色背景
        controlPanel.style.color = '#fff'; // 白色文字
        controlPanel.style.padding = '10px';
        controlPanel.style.borderRadius = '5px';
        controlPanel.style.fontSize = '14px';
        controlPanel.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        controlPanel.style.display = 'flex';
        controlPanel.style.gap = '10px';

        // 停止按钮
        const stopButton = document.createElement('button');
        stopButton.textContent = '停止自动跳课';
        stopButton.style.backgroundColor = '#fff';
        stopButton.style.color = '#0a2463'; // 深蓝字
        stopButton.style.border = 'none';
        stopButton.style.borderRadius = '3px';
        stopButton.style.padding = '5px 10px';
        stopButton.style.cursor = 'pointer';
        stopButton.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
        stopButton.onclick = () => {
            isAutoJumpEnabled = false;
            if (observer) observer.disconnect(); // 停止观察
            console.log('自动跳课已停止');
        };

        // 重新开始按钮
        const startButton = document.createElement('button');
        startButton.textContent = '重新开始自动跳课';
        startButton.style.backgroundColor = '#fff';
        startButton.style.color = '#0a2463'; // 深蓝字
        startButton.style.border = 'none';
        startButton.style.borderRadius = '3px';
        startButton.style.padding = '5px 10px';
        startButton.style.cursor = 'pointer';
        startButton.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
        startButton.onclick = () => {
            if (!isAutoJumpEnabled) {
                isAutoJumpEnabled = true;
                console.log('重新开始自动跳课');
                observeLearningProgress(); // 重新启动观察
            }
        };

        controlPanel.appendChild(stopButton);
        controlPanel.appendChild(startButton);
        document.body.appendChild(controlPanel);
    }

    // 定义观察函数
    function observeLearningProgress() {
        if (!isAutoJumpEnabled) return; // 如果被禁用，则不启动观察

        console.log('正在监控任务完成状态...');

        if (observer) observer.disconnect(); // 防止重复绑定
        observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    // 检测是否出现目标元素
                    const progressElement = document.querySelector('.learning-progress-9vkNF');
                    if (progressElement) {
                        console.log('检测到学习进度提示框！准备跳转到下一节课程...');

                        // 停止观察，避免多次触发
                        observer.disconnect();

                        // 执行跳转到下一节课程的逻辑
                        if (isAutoJumpEnabled) {
                            jumpToNextLesson(); // 立即跳转
                        }
                    }
                }
            }
        });

        // 开始监控整个文档
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 跳转到下一个课程的函数
    async function jumpToNextLesson() {
        if (!isAutoJumpEnabled) return; // 如果被禁用，则不执行跳转

        // 查找所有课程项
        const allLessons = Array.from(document.querySelectorAll('.item-IPNWw'));
        if (allLessons.length === 0) {
            console.log('未找到课程列表，请确保页面加载完毕。');
            return;
        }

        // 找到当前课程的索引
        let currentIndex = allLessons.findIndex((item) =>
            item.classList.contains('active-1MWMf')
        );

        // 获取下一个课程
        const nextLesson = allLessons[currentIndex + 1];
        if (nextLesson) {
            console.log('下一节课程已找到：', nextLesson);

            // 模拟点击操作
            nextLesson.click();

            console.log('已跳转到下一节课程！');

            // 阻塞 1 秒
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 重新启动监控
            observeLearningProgress();
        } else {
            console.log('没有下一个课程或下一个元素不符合要求，脚本结束。');
        }
    }

    // 初始化
    addControlButtons();
    observeLearningProgress();
})();
