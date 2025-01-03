const dummy = (blogs) => {
    return Array.isArray(blogs) ? 1 : 0
  }

const totalLikes = (blogs) => {
    return blogs.reduce((total, blog) => {
        return total + blog.likes
    }, 0)
}

const favBlog = (blogs) => {
    let fav = blogs[0];

    for (let i = 1; i < blogs.length; i++){
        if (blogs[i].likes > fav.likes){
            fav = blogs[i]
        }
    }

    return fav
}

const mostBlogs = (blogs) => {
    let mostBlog = blogs[0]

    for (let i = 1; i < blogs.length; i++){
        if (blogs[i].blogs > mostBlog.blogs){
            mostBlog = blogs[i]
        }
    }

    return mostBlog
}

const favAuth = (blogs) => {
    let fav = blogs[0]

    for (let i = 1; i < blogs.length; i++){
        if (blogs[i].likes > fav.likes){
            fav = blogs[i]
        }
    }

    return fav
}
  
  module.exports = {
    dummy,
    totalLikes,
    favBlog,
    mostBlogs,
    favAuth
  }