const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs
        ? blogs.map(blog => blog.likes).reduce((tot, likes) => tot + likes, 0)
        : 0
}

module.exports = {
    dummy,
    totalLikes
}