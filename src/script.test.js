const { it, expect, describe } = require("@jest/globals")
const { getPosts, getUsers, joinData, countUserPosts, checkIfPostTitleUnique, checkDistance } = require('./index')
const { mockUser, mockPost, mockData } = require('./mockup')

describe('Fetching data', () => {

    test("Fetching users from API", async () => {
        let users = await getUsers()
        await expect(users).toContainEqual(mockUser[0])
    })

    test("Fetching posts from API", async () => {
        let posts = await getPosts()
        await expect(posts).toContainEqual(mockPost[0])
    })

})


describe('Connecting data', () => {
    test("Connecting users with posts", async () => {
        let data = await joinData(mockPost, mockUser)
        await expect(data).toEqual(mockData)
    })
})


test('Counting users posts', async () => {
    let data = await countUserPosts(mockData)
    await expect(data).toEqual(['Leanne Graham napisał(a) 1 postów','Ervin Howell napisał(a) 1 postów'])
})


test('Checking duplicated posts', async () => {
    let data = await checkIfPostTitleUnique(mockData)
    await expect(data).toEqual([])
})

test('Checking closest users', async () => {
    let closestUsers = await checkDistance(mockData)
    await expect(closestUsers).toEqual([{user: mockData[0].name, closestUser: mockData[1].name, distance: 8898},
                                        {user: mockData[1].name, closestUser: mockData[0].name, distance: 8898}])
})