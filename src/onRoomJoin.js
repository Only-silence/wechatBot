// 新人进群事件
async function onRoomJoin(room, inviteeList, inviter) {
    log.info('Bot', 'EVENT: room-join - Room "%s" got new member "%s", invited by "%s"',
        await room.topic(),
        inviteeList.map(c => c.name()).join(','),
        inviter.name(),
    )
    console.log('bot room-join room id:', room.id)
    const topic = await room.topic()
    await room.say(`欢迎加入 "${topic}"!`, inviteeList[0])
}

export { onRoomJoin }