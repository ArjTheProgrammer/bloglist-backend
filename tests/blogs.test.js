const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const authorsWithBlogCounts = [
    { author: "Michael Chan", blogs: 1 },
    { author: "Edsger W. Dijkstra", blogs: 2 },
    { author: "Robert C. Martin", blogs: 3 }
];

  describe('Most blogs', () => {
    test('Most blogs is Robert', () => {
        const result = listHelper.mostBlogs(authorsWithBlogCounts)

        assert.deepEqual(result, { author: "Robert C. Martin", blogs: 3 })
    })
  })