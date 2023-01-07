--Create new table
CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author TEXT,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    likes INT DEFAULT 0
);

--Create new blogs
insert into blogs (author, url, title) values ('Blogger', 'www.some.blog', 'blogger blog');
insert into blogs (author, url, title) values ('Some Author', 'www.some.url', 'example blog');

--View blogs
SELECT * FROM blogs;