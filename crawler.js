'use strict';
const http = require('http');
const cheerio = require('cheerio');
var url = 'http://www.imooc.com/learn/348';
http.get(url, res=> {
    var html = '';
    res.on('data', data=> {
        html += data;
    }).on('end', () => {
        var courseData = filterChapters(html);
        printCourseInfo(courseData);
        // console.log(html);
    }).on('error', () => {
        console.log('获取数据出错！');
    })
})
function filterChapters(html) {
    var $ = cheerio.load(html);
    $('.chapter-info').remove();
    $('.moco-btn').remove();
    var chapters = $('div.chapter');
    var courseData = [];
    chapters.each(function (item) {
        var chapter = $(this);
        var chapterTitle = chapter.find('strong').text().trim();
        var videos = chapter.find('.video').children('li');
        var chapterData = {
            chapterTitle: chapterTitle,
            videos: []
        };
        videos.each(function (item) {
            var video = $(this).find('a');
            var videoTitle = video.text().replace(/\s+/g,' ');
            var id = video.attr('href').split('video/')[1];
            chapterData.videos.push({
                title: videoTitle,
                id: id
            })
        })
        courseData.push(chapterData);
    })
    return courseData;
}
function printCourseInfo(courseData) {
    courseData.forEach(function (item) {
        var chapterTitle = item.chapterTitle;
        console.log(chapterTitle + '\n');
        item.videos.forEach(function (video) {
            console.log(' 【' + video.id + '】' + video.title + '\n');
        })
    })
}


