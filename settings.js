// 设置管理员
async function setAdmin(name) {
    const admin = await wechaty.Contact.findAll({ name: 'Q .' })
    console.log('admin', admin)
    admin.say('Hello')
}

// 设置管理房间
async function setRoom(topic) {
    const room = await wechaty.Room.find({ topic })
    if(room?.id){
        return room.id
    }else {
        return null
    }
}

// 检查机器人状态
function checkStatus() {
    console.log('检查状态', wechaty.logonoff())
    return wechaty.logonoff()
}

export { setAdmin, setRoom, checkStatus }