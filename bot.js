// 加载环境变量
import dotenv from "dotenv";
dotenv.config()

// 引入工具包
import {
    WechatyBuilder, log
} from 'wechaty'

// 全局日志
global.log = log

// 引入模块
import { onScan } from "./src/onScan.js";
import { onLogin } from "./src/onLogin.js";
import { onLogout } from "./src/onLogout.js";
import { onMessage } from "./src/onMessage.js";
import { onRoomJoin } from "./src/onRoomJoin.js";
import { onRoomLeave } from "./src/onRoomLeave.js";
import { onError } from "./src/onError.js";

// 初始化机器人服务
const wechaty = WechatyBuilder.build({
    name: process.env.NAME,
    // Enable UOS for web login for new WeChat account. See detail: https://www.npmjs.com/package/wechaty-puppet-wechat
    puppet: process.env.PUPPET,
    puppetOptions: {
        uos: true, // 开启uos协议
    },
})

// 全局服务
global.wechaty = wechaty

// 入口 开启机器人
async function main() {
    // 监听事件
    wechaty
        .on('scan', onScan)
        .on('login', onLogin)
        .on('logout', onLogout)
        .on('message', onMessage)
        .on('room-join', onRoomJoin)
        .on('room-leave', onRoomLeave)
        .on('error', onError)
        .start()
}

// 捕获异常
main().catch(async e => {
    log.error('机器人出错了！', e)
    await wechaty.stop()
    process.exit(1)
})