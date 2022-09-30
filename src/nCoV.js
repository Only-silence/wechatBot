import request from "request";
import urlencode from "urlencode";

// 疫情查询API
export default class nCoV {
    constructor() {
        this.newRequest = request.defaults({
            baseUrl: "https://lab.isaaclin.cn",
            Headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    getOverall() {
        return new Promise((resolve, reject) => {
            // 全国 全球
            this.newRequest(`/nCoV/api/overall`, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    const data = JSON.parse(body).results
                    const Count = `---- 全国疫情🦠 ----\n现存确诊人数: ${data[0].currentConfirmedCount} \n累计确诊人数: ${data[0].confirmedCount} \n疑似感染人数: ${data[0].suspectedCount} \n已经治愈人数: ${data[0].curedCount} \n已经死亡人数: ${data[0].deadCount} \n重症病例人数: ${data[0].seriousCount}`
                    resolve(Count)
                }
            })
        })
    }

    getArea(city) {
        return new Promise((resolve, reject) => {
            // 国家、省份、自治区或直辖市
            this.newRequest(`/nCoV/api/area?latest=1&province=${urlencode(city)}`, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    const data = JSON.parse(body).results
                    console.log(data, data.length, data.length == 0)
                    if (!data.length) {
                        resolve(`未查询到，当前只支持国家、省份、自治区或直辖市`)
                    } else {
                        const Count = `- ${city}疫情🦠 -\n现存确诊人数: ${data[0].currentConfirmedCount} \n累计确诊人数: ${data[0].confirmedCount} \n疑似感染人数: ${data[0].suspectedCount} \n已经治愈人数: ${data[0].curedCount} \n已经死亡人数: ${data[0].deadCount}`
                        resolve(Count)
                    }
                }
            })
        })
    }
}