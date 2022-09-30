import { setRoom } from "../settings.js";
import { checkStatus } from "../settings.js";
import urlencode from "urlencode";
import request from "request";
import { contains } from "../utils/tools.js";
import "./nCoV.js";
import nCoV from "./nCoV.js";

/**
 * @description 参数设置 控制机器人
 * privateBotStatus: 私聊开关
 * roomBotStatus:    群聊开关
 * admin:            管理员信息 用来匹配管理员
 * setRoomId:        设置机器人所在群房间的ID
 */
var privateBotStatus = false
var roomBotStatus = false
var admin = {
    alias: 'admin',
    name: 'Q .',
    friend: true,
}
var setRoomId = null

// 接收消息事件
async function onMessage(msg) {
    log.info('监听信息', msg.toString())
    console.log('是否本人===>', msg.self())
    // 是否本机器人
    const myself = msg.self()
    console.log(msg.payload)
    // 当前对话群ID
    const roomId = msg.payload.roomId
    // 消息类型
    const type = msg.payload.type
    // 接收者ID
    const listenerId = msg.payload.listenerId

    /**
     * MessageType.Unknown     1:未知
     * MessageType.Attachment  2:附件
     * MessageType.Audio       3:音频
     * MessageType.Contact     4:电话
     * MessageType.Emoticon    5:表情
     * MessageType.Image       6:图片
     * MessageType.Text        7:文本
     * MessageType.Video       8:视频
     * MessageType.Url         9:链接
     * MessageType.Recalled   13:撤回消息
     */
    if (type === 1) return  // 未知类型 可能是公众号消息

    // 处理文件传输助手消息
    if (listenerId === 'filehelper') {
        await filehelper(msg)
        return
    }

    // 判断是机器人退出流程
    if (myself) return

    // 处理非群聊消息
    if (!roomId && privateBotStatus) {  // 非群聊
        await msg.say(`---- 🤖️ ----\n自动回复：当前在忙，请稍后......`)
        return
    }

    // 处理所设置群聊消息
    if (!setRoomId) return
    if (roomId === setRoomId) {
        if (await msg.mentionSelf() && roomBotStatus) {
            // @机器人处理流程
            mentionSelf(msg)
        } else {
            roomControl(msg)
        }
    }
}

// 判断是否管理员
async function isAdmin(msg) {
    const talker = await msg.talker().payload
    console.log('是否管理员===>', contains(talker, admin))
    return contains(talker, admin)
}

// 处理文件传输助手收到的消息
async function filehelper(msg) {
    const filehelper = wechaty.Contact.load('filehelper')

    const nCoVs = new nCoV()
    const str = msg.text()
    switch (true) {
        case /^状态$/i.test(str):
            await filehelper.say(`自动回复状态为：${privateBotStatus ? '开启' : '关闭'}`)
            break;
        case /^关闭$/i.test(str):
            privateBotStatus = false
            await filehelper.say(`已经关闭自动回复！`)
            break;
        case /^开启$/i.test(str):
            privateBotStatus = true
            await filehelper.say(`已经开启自动回复！`)
            break;
        case /设置房间/i.test(str):
            // const room = str.match(/^设置房间(.+)$/i)[1]
            const room = str.split('：')[1] || str.split(':')[1]
            setRoomId = await setRoom(room)
            await filehelper.say(`${setRoomId ? '设置成功！' : '设置有误！'}`)
            break;
        case /疫情查询/.test(str):
            const city = str.split('：')[1] || str.split(':')[1]
            const area = await nCoVs.getArea(city)
            await filehelper.say(area)
            break;
        case /^全国疫情$/i.test(str):
            const overall = await nCoVs.getOverall()
            await filehelper.say(overall)
            break;
        default:
            break;
    }
}

// @机器人事件
async function mentionSelf(message) {
    const room = message.room()
    if (!room) {
        throw new Error('此消息不属于群聊消息！')
    }
    // console.info('list', await message.mentionList())
    // console.info('@机器人收到的消息，去除了@名', await message.mentionText())
    const talker = message.talker()
    // 调用AI回复API
    const messageText = await requestRobot(await message.mentionText())
    await room.say(`${messageText} @${talker.name()}`)
}

// 处理群内指令
async function roomControl(msg) {
    // 拦截消息撤回
    if (msg.type() === 13 && roomBotStatus) {
        const recalledMessage = await msg.toRecalled()
        msg.say(`消息：${recalledMessage.text()} 已撤回`)
    }

    const nCoVs = new nCoV()
    const str = msg.text()
    const admin = await isAdmin(msg)

    // 管理员指令
    if (admin) {
        switch (true) {
            case /^状态$/i.test(str):
                await msg.say(`机器人当前状态为：${roomBotStatus ? '开启' : '关闭'}`)
                break;
            case /^开启$/i.test(str):
                roomBotStatus = true
                await msg.say(`机器人已开启!`)
                break;
            case /^关闭$/i.test(str):
                roomBotStatus = false
                await msg.say(`机器人已关闭!`)
                break;
            default:
                break;
        }
    }
    // 未开启退出
    if (!roomBotStatus) return

    // 普通用户指令
    switch (true) {
        case /疫情查询/.test(str):
            const city = str.split('：')[1] || str.split(':')[1]
            // console.log('city',city)
            const area = await nCoVs.getArea(city)
            await msg.say(area)
            break;
        case /^全国疫情$/i.test(str):
            const overall = await nCoVs.getOverall()
            await msg.say(overall)
            break;
        default:
            break;
    }
}

/**
 * @description 机器人请求接口 处理函数
 * @param {String} info 发送文字
 * @return {Promise} 相应内容
 */
function requestRobot(info) {
    return new Promise((resolve, reject) => {
        let url = `https://open.drea.cc/bbsapi/chat/get?keyWord=${urlencode(info)}`;
        request(url, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                let res = JSON.parse(body);
                if (res.isSuccess) {
                    let send = res.data.reply;
                    // 免费的接口，所以需要把机器人名字替换成为自己设置的机器人名字
                    send = send.replace(/Smile/g, process.env.name);
                    resolve(send);
                } else {
                    resolve(`${res.code == 1010 ? '没事别老艾特我，我还以为爱情来了' : '你在说什么，我听不懂'}`)
                }
            } else {
                resolve("你在说什么，我脑子有点短路诶！");
            }
        });
    });
}

export { onMessage }