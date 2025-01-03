const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const authorsWithLikes = [
    { author: "Michael Chan", likes: 7 },
    { author: "Edsger W. Dijkstra", likes: 17 }, // Updated with total likes for Edsger W. Dijkstra
    { author: "Robert C. Martin", likes: 12 }
];

describe('favorite Author', () => {
    test('fav author is Edsger', () => {
        const result = listHelper.favAuth(authorsWithLikes)

        assert.deepEqual(result, { author: "Edsger W. Dijkstra", likes: 17 })
    })
})