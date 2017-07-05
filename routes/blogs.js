const User = require('../models/user');
const Blog = require('../models/blog');
const jwt = require('jsonwebtoken');
const config = require('../config/database');


module.exports = (router) => {
    /* ===============================================================
         CREATE NEW BLOG
      =============================================================== */

    router.post('/newBlog', (req, res) => {
        console.log('Hey from newBlog', req.body);
        if (!req.body.title) {
            res.json({ success: false, message: 'Blog title is required' });
        } else if (!req.body.body) {
            res.json({ success: false, message: 'Blog body is required' })
        } else if (!req.body.createdBy) {
            res.json({ success: false, message: 'Blog creator is required' })
        } else {
            const blog = new Blog({
                title: req.body.title,
                body: req.body.body,
                createdBy: req.body.createdBy
            });
            blog.save((err) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    res.json({ success: true, message: 'Blog saved!' })
                }
            });
        }
    });

    /* ===============================================================
         GET ALL BLOGS
      =============================================================== */
    router.get('/allBlogs', (req, res) => {
        Blog.find({}, (err, blogs) => {
            if (err) {
                res.json({ success: false, message: err })
            } else {
                if (!blogs) {
                    res.json({ success: false, message: 'No blogs found' })
                } else {
                    res.json({ success: true, blogs: blogs }); // Return success and blogs array
                }
            }
        }).sort({ '_id': -1 }); // Sort blogs from newest to oldest
    });


    /* ===============================================================
         GET SINGLE BLOG FOR EDIT
      =============================================================== */
    router.get('/singleBlog/:id', (req, res) => {
        //Check if id is present in parameters
        if (!req.params.id) {
            res.json({ success: false, message: 'No blog ID was provided.' }); // Return error message
        } else {
            // Check if the blog id is found in database
            Blog.findOne({ _id: req.params.id }, (err, blog) => {
                if (err) {
                    res.json({ success: false, message: 'No blog is found', err });
                } else {
                    if (!blog) {
                        res.json({ success: false, message: 'Blog not found.' })
                    } else {
                        // Find the current user that is logged in
                        User.findOne({ _id: req.decoded.userId }, (err, user) => {
                            //Check if error was found
                            if (err) {
                                res.json({ success: false, message: 'Not a valid blog id' });
                            } else {
                                if (!user) {
                                    res.json({ success: false, message: 'Unable to authenticate the user' })
                                } else {
                                    //Check if the user who requested the single blog is the one who created it
                                    if (user.username !== blog.createdBy) {
                                        res.json({ success: false, message: 'You are not authorized to edit this blog' });
                                    } else {
                                        res.json({ sucess: true, blog: blog });
                                    }
                                }
                            }
                        })
                    }
                }
            })
        }

    });

    /* ===============================================================
        Update the Blog
      =============================================================== */
    router.put('/updateBlog', (req, res) => {
        // res.json({ message: "Hello from update" });

        if (!req.body._id) {
            res.json({ success: false, message: 'No blog id provided' });
        } else {
            Blog.findOne({ _id: req.body._id }, (err, blog) => {
                if (err) {
                    res.json({ success: false, message: 'Not a valid Blog id' });
                } else {
                    if (!blog) {
                        res.json({ success: false, message: 'No blog was found' });
                    } else {
                        User.findOne({ _id: req.decoded.userId }, (err, user) => {
                            if (err) {
                                res.json({ success: false, message: 'Unable to authenticate user' })
                            } else {
                                if (user.username !== blog.createdBy) {
                                    res.json({ success: false, message: 'You are not authorized to edit this blog' });
                                } else {

                                    //only update fields that were actually passed...
                                    if (typeof req.body.title !== 'undefined') {
                                        blog.title = req.body.title;
                                    }
                                    if (typeof req.body.body !== 'undefined') {
                                        blog.body = req.body.body;
                                    }
                                    blog.save((err) => {
                                        if (err) {
                                            res.json({ success: false, message: err });
                                        } else {
                                            res.json({ success: true, message: 'Blog updated successfully' });
                                        }
                                    });
                                }
                            }
                        })
                    }
                }
            })
        }
    });

    router.delete('/deleteBlog/:id', (req, res) => {
        if (!req.params.id) {
            res.json({ success: false, message: 'No id provided' })
        } else {
            Blog.findOne({ _id: req.params.id }, (err, blog) => {
                if (err) {
                    res.json({ success: false, message: 'Invalid Id' });
                } else {
                    if (!blog) {
                        res.json({ success: false, message: 'No blog was found' });
                    } else {
                        User.findOne({ _id: req.decoded.userId }, (err, user) => {
                            if (err) {
                                res.json({ success: false, message: err })
                            } else {
                                if (!user) {
                                    res.json({ success: false, message: 'Unable to authenticate user' });
                                } else {
                                    if (user.username !== blog.createdBy) {
                                        res.json({ success: false, message: 'You are not authorized to delete this blog post' });
                                    } else {
                                        blog.remove((err) => {
                                            if (err) {
                                                res.json({ success: false, message: 'Could not delete the blog' });
                                            } else {
                                                res.json({ success: true, message: 'Blog sucessfully deleted' });
                                            }
                                        }); //blog delete end
                                    }
                                }
                            } //else end if blog found
                        });
                    }
                }

            })
        }
    });



    return router;
}