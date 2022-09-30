import { setAdmin } from "../settings.js";

// 登录事件
async function onLogin(user) {
    log.info('登陆微信', '%s 登陆', user)
    setAdmin()
    // const contactList = await wechaty.Contact.findAll()
    // for (let i = 0; i < contactList.length; i++) {
    //     const contact = contactList[i]
    //     // if (contact.type() === wechaty.Contact.Type.Personal) {
    //         log.info('contact',contact)
    //         // log.info('Bot', `personal ${i}: ${contact.name()} : ${contact.id}`)
    //     // }
    // }
}

export { onLogin }