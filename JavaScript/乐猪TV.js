var rule = {
    title: '乐猪TV',
    host: 'http://www.lezhutv.com',
    // homeUrl:'/',
    url: '/list/fyclassfyfilter.html',
    filterable: 1,//是否启用分类筛选,
    filter_url: '{{fl.cateId}}_fypage_desc_{{fl.by}}_0_0___',
    "filter": {
        "1": [
            {
                "key": "cateId",
                "name": "类型",
                "value": [
                    { "n": "全部", "v": "1" },
                    { "n": "动作片", "v": "5" },
                    { "n": "喜剧片", "v": "6" },
                    { "n": "爱情片", "v": "7" },
                    { "n": "科幻片", "v": "8" },
                    { "n": "恐怖片", "v": "9" },
                    { "n": "剧情片", "v": "10" },
                    { "n": "战争片", "v": "11" },
                    { "n": "奇幻片", "v": "16" },
                    { "n": "惊悚片", "v": "17" },
                    { "n": "动画片", "v": "18" },
                    { "n": "悬疑片", "v": "19" },
                    { "n": "犯罪片", "v": "20" },
                    { "n": "记录片", "v": "21" },
                    { "n": "音乐片", "v": "22" }
                ]
            },
            {
                "key": "by",
                "name": "排序",
                "value": [
                    { "n": "时间", "v": "time" },
                    { "n": "人气", "v": "hits" },
                    { "n": "评分", "v": "score" }
                ]
            }
        ],
        "2": [
            {
                "key": "cateId",
                "name": "类型",
                "value": [
                    { "n": "全部", "v": "2" },
                    { "n": "大陆", "v": "12" },
                    { "n": "港剧", "v": "13" },
                    { "n": "韩剧", "v": "14" },
                    { "n": "美剧", "v": "15" },
                    { "n": "日剧", "v": "24" },
                    { "n": "台剧", "v": "25" },
                    { "n": "泰剧", "v": "26" }
                ]
            },
            {
                "key": "by",
                "name": "排序",
                "value": [
                    { "n": "时间", "v": "time" },
                    { "n": "人气", "v": "hits" },
                    { "n": "评分", "v": "score" }
                ]
            }
        ],
        "3": [
            {
                "key": "cateId",
                "name": "类型",
                "value": [
                    { "n": "全部", "v": "3" },
                    { "n": "大陆综艺", "v": "28" },
                    { "n": "港台综艺", "v": "29" },
                    { "n": "日韩综艺", "v": "30" },
                    { "n": "欧美综艺", "v": "31" }
                ]
            },
            {
                "key": "by",
                "name": "排序",
                "value": [
                    { "n": "时间", "v": "time" },
                    { "n": "人气", "v": "hits" },
                    { "n": "评分", "v": "score" }
                ]
            }
        ],
        "4": [
            {
                "key": "cateId",
                "name": "类型",
                "value": [
                    { "n": "全部", "v": "4" },
                    { "n": "国产动漫", "v": "32" },
                    { "n": "日本动漫", "v": "33" },
                    { "n": "其他动漫", "v": "35" }
                ]
            },
            {
                "key": "by",
                "name": "排序",
                "value": [
                    { "n": "时间", "v": "time" },
                    { "n": "人气", "v": "hits" },
                    { "n": "评分", "v": "score" }
                ]
            }
        ]
    },
    // searchUrl:'/search-pg-fypage-wd-**.html',
    searchUrl: '/index.php?m=vod-search#wd=**&search=;post',
    searchable: 2,
    quickSearch: 0,
    headers: {
        // 'User-Agent':'UC_UA'
        'User-Agent': 'MOBILE_UA',
        // 'Cookie':'test',
    },
    timeout: 5000,
    // class_parse:'div.nav a;a&&Text;a&&href;/(\\d.+).html',
    class_parse: 'div.nav a;a&&Text;a&&href;/(\\d+)-1.html',
    play_parse: true,
    lazy: '',
    limit: 5,
    推荐: '.tbox2;*;*;*;*;*',
    double: true, // 推荐内容是否双层定位
    一级: 'ul.tbox_m2 li;a&&title;a&&data-original;span&&Text;a&&href',
    二级: { "title": ".data h4--i&&Text;.yac&&Text", "img": ".item-lazy&&data-original", "desc": ";;;.act&&Text;.dir&&Text", "content": ".tbox_js&&Text", "tabs": "js:pdfa=jsp.pdfa;TABS=pdfa(html,'.tbox_t h3').map(function(it,idex){return '线路'+(idex+1)})", "lists": "ul.list_block:eq(#id) li", "tabs": ".tbox_t h3" },
    搜索: 'ul.tbox_m li;*;*;*;*',

}
