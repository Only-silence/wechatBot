import {
    ScanStatus
} from 'wechaty'
import qrTerm from 'qrcode-terminal'

// 生成登录二维码
function onScan(qrcode, status) {
    if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
        qrTerm.generate(qrcode, { small: true })  // 控制台显示登录二维码

        const qrcodeImageUrl = [
            'https://wechaty.js.org/qrcode/',
            encodeURIComponent(qrcode),
        ].join('')

        log.info('启动机器人', '扫码: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl)
    } else {
        log.info('启动机器人', '扫码: %s(%s)', ScanStatus[status], status)
    }
}

export { onScan }