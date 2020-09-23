const redis = require('async-redis')
const redisPath = "//redis-10336.c232.us-east-1-2.ec2.cloud.redislabs.com:10336"
const redisPassword = "csani1234"

module.exports = async () => {
  return await new Promise((resolve, reject) => {
    const client = redis.createClient({
      url: redisPath,
      no_ready_check: true,
      auth_pass: redisPassword
    })

    client.on('error', (err) => {
      console.error('Redis: ', err)
      client.quit()
      reject(err)
    })

    client.on('ready', () => {
      resolve(client)
    })
  })
}