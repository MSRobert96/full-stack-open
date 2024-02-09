const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs
        ? blogs.map(blog => blog.likes).reduce((tot, likes) => tot + likes, 0)
        : 0
}

const favoriteBlog = (blogs) => {
    return blogs && blogs.length > 0
        ? blogs.toSorted((a, b) => b.likes - a.likes)[0]
        : null
}

const mostBlogs = (blogs) => {
    let grouped = _.groupBy(blogs, blog => blog.author)
    let maxAuthor = _.maxBy(_.toPairs(grouped), author => author[1].length)
    return { author: maxAuthor[0], blogs: maxAuthor[1].length }
}

const mostLikes = (blogs) => {
    let grouped = _.groupBy(blogs, blog => blog.author)
    let maxAuthor = _.maxBy(_.toPairs(grouped), author => author[1].reduce((tot, b) => tot + b.likes, 0))
    return { author: maxAuthor[0], likes: maxAuthor[1].reduce((tot, b) => tot + b.likes, 0) }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}