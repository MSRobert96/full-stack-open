const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

beforeEach(async () => {
    await helper.resetTestBlogs()
})

describe('all blogs', () => {
    test('returns all blogs from database', async () => {
        const blogs = await helper.blogsInDb()
        expect(blogs).toHaveLength(helper.initialBlogs.length)
    })

    test('check identifier is called "id"', async () => {
        const blogs = await helper.blogsInDb()
        expect(blogs[0].id).toBeDefined()
    })
})

describe('blog creation', () => {
    const newBlog = {
        title: 'Test new blog',
        author: 'Roberto Milan',
        url: 'https://www.unive.it'
    }

    test('blog is created successfully', async () => {
        const blogsBefore = await helper.blogsInDb()

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAfter = await helper.blogsInDb()

        expect(blogsAfter).toHaveLength(blogsBefore.length + 1)
        expect(blogsAfter.map(b => b.title)).toContain(newBlog.title)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})