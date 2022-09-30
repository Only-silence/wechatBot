// 退群事件
async function onRoomLeave(room, leaverList) {
    log.info('Bot', 'EVENT: room-leave - Room "%s" lost member "%s"',
        await room.topic(),
        leaverList.map(c => c.name()).join(','),
    )
    const topic = await room.topic()
    const name = leaverList[0] ? leaverList[0].name() : 'no contact!'
    await room.say(`"${name}" 已退出 "${topic}"!`)
}

export { onRoomLeave }