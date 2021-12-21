/*
 * @Description:
 * @Author: yuany
 * @Date: 2021-12-20 14:18:59
 * @LastEditors: yuany
 */

export const sendMessage = (cmd, data) => {
  return new Promise(resolve => {
    chrome.extension.sendMessage({ cmd, data }, resolve)
  })
}

export const getCookie = (domain = '', name) => {
  return new Promise((resolve, reject) => {
    chrome.cookies.getAll(
      {
        domain,
        name
      },
      function (cookie) {
        if (!cookie) return reject(chrome.extension.lastError)
        resolve(cookie)
      }
    )
  })
}
