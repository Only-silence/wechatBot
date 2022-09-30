// 退出登录事件
function onLogout(user) {
    log.info('退出登录', '%s 退出', user)
    stop().then(res => {
        setTimeout(() => {
            start()
        }, 5000);
    })
}

export { onLogout }