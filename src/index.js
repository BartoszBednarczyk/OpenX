const fetch = require('node-fetch')

async function getPosts() {
    const posts = await fetch("https://jsonplaceholder.typicode.com/posts").then((response) => response.json())
                                                                           .catch( (e) => {
                                                                            return null
                                                                           })
    return posts
  }
  
async function getUsers() {
  const users = await fetch("https://jsonplaceholder.typicode.com/users").then((response) => response.json())
                                                                         .catch( (e) => {
                                                                         return null
                                                                         })
  return users
}

  async function joinData(postsList, usersList) {
    for (const post of postsList) {
      let i = usersList.findIndex(x => x.id == post.userId)
      !usersList[i].posts && (usersList[i].posts = [])
      usersList[i].posts.push({ id: post.id, title: post.title, body: post.body })
    }
      return usersList
  }

  async function countUserPosts(data) {
      let count = []
      data.map(user => count.push(`${user.name} napisał(a) ${user.posts ? user.posts.length : 0} postów`))
      return count
  }

  async function checkIfPostTitleUnique(data) {
    let posts = data.map(i => i.posts)
    posts = posts.flat(1)
    let duplicatedPosts = []
    for (post of posts) {
        let count = 0
        posts.map(p => p.title === post.title && count++)
        if ( count > 1 ) {duplicatedPosts.push({id: post.id, title: post.title})}
    }
    return duplicatedPosts
  }

  function checkDistance(data) {
    var p = 0.017453292519943295   // PI / 180
    var cos = Math.cos
    var closestUsers = []
    for(let i = 0; i<data.length; i++) {
        let lowestDistance = null
        let closestUser
        for(let j = 0; j<data.length; j++) {
            if (i !== j) {
                let lat1 = data[i].address.geo.lat
                let lat2 = data[j].address.geo.lat
                let lon1 = data[i].address.geo.lng
                let lon2 = data[j].address.geo.lng
                var a = 0.5 - cos((lat2 - lat1) * p)/2 + 
                        cos(lat1 * p) * cos(lat2 * p) * 
                        (1 - cos((lon2 - lon1) * p))/2
                var d = Math.round(12742 * Math.asin(Math.sqrt(a))) // 2 * R; R = 6371 km
                if (d < lowestDistance || lowestDistance === null) { lowestDistance = d, closestUser = j }
            }
        }
        closestUsers.push({user: data[i].name, closestUser: data[closestUser].name, distance: d})
    }
    return closestUsers
  }
  
  async function main() {
    let posts = await getPosts()
    let users = await getUsers()
    let data = await joinData(posts, users)
    await countUserPosts(data)
    data[0].posts[0].title = "qui est esse"
    await checkIfPostTitleUnique(data)
    checkDistance(data)
  }

  module.exports = {
    getPosts,
    getUsers,
    joinData,
    countUserPosts,
    checkIfPostTitleUnique,
    checkDistance
  }

  