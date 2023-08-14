import {
	Crypto,
	load,
	_
} from "assets://js/lib/cat.js";
let key = "subaibai",
	url = "https://www.subaibaiys.com",
	siteKey = "",
	siteType = 0;
const UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
	cookie = {};
async function request(reqUrl, referer, mth, data, hd) {
	var headers = {
			"User-Agent": UA,
			Cookie: _.map(cookie, (value, key) => key + "=" + value).join(";")
		},
		referer = (referer && (headers.referer = encodeURIComponent(referer)), await req(reqUrl, {
			method: mth || "get",
			headers: headers,
			data: data,
			postType: "post" === mth ? "form" : ""
		}));
	if (referer.headers["set-cookie"])
		for (const c of (_.isArray(referer.headers["set-cookie"]) ? referer.headers["set-cookie"].join(";") : referer.headers["set-cookie"]).split(";")) {
			var tmp = c.trim();
			if (tmp.startsWith("result=")) return cookie.result = tmp.substring(7), request(reqUrl, reqUrl, "post", {
				result: cookie.result
			});
			if (tmp.startsWith("esc_search_captcha=1")) return cookie.esc_search_captcha = 1, delete cookie.result, request(reqUrl)
		}
	return referer.content
}
async function init(cfg) {
	siteKey = cfg.skey, siteType = cfg.stype
}
async function home(filter) {
	let filterObj = {};
	var html = await request(url + "/movie_bt"),
		html = load(html),
		series = html("div#beautiful-taxonomy-filters-tax-movie_bt_series > a[cat-url*=movie_bt_series]"),
		html = html("div#beautiful-taxonomy-filters-tax-movie_bt_tags > a");
	let tag = {
		key: "tag",
		name: "类型",
		value: _.map(html, n => {
			let v = n.attribs["cat-url"] || "";
			return v = v.substring(v.lastIndexOf("/") + 1), {
				n: n.children[0].data,
				v: v
			}
		})
	};
	tag.init = tag.value[0].v;
	html = _.map(series, s => {
		let typeId = s.attribs["cat-url"];
		return typeId = typeId.substring(typeId.lastIndexOf("/") + 1), filterObj[typeId] = [tag], {
			type_id: typeId,
			type_name: s.children[0].data
		}
	});
	const sortName = ["电影", "电视剧", "国产剧", "美剧", "韩剧", "日剧", "海外剧（其他）", "华语电影", "印度电影", "日本电影", "欧美电影", "韩国电影", "动画", "俄罗斯电影", "加拿大电影"];
	return html = _.sortBy(html, c => {
		c = sortName.indexOf(c.type_name);
		return -1 === c ? sortName.length : c
	}), JSON.stringify({
		class: html,
		filters: filterObj
	})
}
async function homeVod() {
	return "{}"
}
async function category(tid, pg, filter, extend) {
	pg <= 0 && (pg = 1);
	extend = extend.tag || "", extend = await request(url + "/movie_bt" + (0 < extend.length ? "/movie_bt_tags/" + extend : "") + "/movie_bt_series/" + tid + (1 < pg ? "/page/" + pg : ""));
	const $ = load(extend);
	tid = $("div.mrb > ul > li"), extend = _.map(tid, item => {
		var img = $(item).find("img:first")[0],
			a = $(item).find("a:first")[0],
			hdinfo = $($(item).find("div.hdinfo")[0]).text().trim(),
			item = $($(item).find("div.jidi")[0]).text().trim();
		return {
			vod_id: a.attribs.href.replace(/.*?\/movie\/(.*).html/g, "$1"),
			vod_name: img.attribs.alt,
			vod_pic: img.attribs["data-original"],
			vod_remarks: item || hdinfo || ""
		}
	}), tid = 0 < $("div.mrb > div.pagenavi_txt > a:contains(>)").length ? parseInt(pg) + 1 : parseInt(pg);
	return JSON.stringify({
		page: parseInt(pg),
		pagecount: tid,
		limit: 20,
		total: 20 * tid,
		list: extend
	})
}

function stripHtmlTag(src) {
	return src.replace(/<\/?[^>]+(>|$)/g, "").replace(/&.{1,5};/g, "").replace(/\s{2,}/g, " ")
}
async function detail(id) {
	var html = await request(url + "/movie/" + id + ".html"),
		$ = load(html),
		html = $("ul.moviedteail_list > li"),
		vod = {
			vod_id: id,
			vod_pic: $("div.dyimg img:first").attr("src"),
			vod_remarks: "",
			vod_content: stripHtmlTag($("div.yp_context").html()).trim()
		};
	for (const info of html) {
		var i = $(info).text().trim();
		i.startsWith("地区：") ? vod.vod_area = i.substring(3) : i.startsWith("年份：") ? vod.vod_year = i.substring(3) : i.startsWith("导演：") ? vod.vod_director = _.map($(info).find("a"), a => a.children[0].data).join("/") : i.startsWith("主演：") ? vod.vod_actor = _.map($(info).find("a"), a => a.children[0].data).join("/") : i.startsWith("语言：") && (vod.vod_lang = i.substring(3))
	}
	id = _.map($("div.paly_list_btn > a"), a => a.children[0].data + "$" + a.attribs.href.replace(/.*?\/v_play\/(.*).html/g, "$1"));
	return vod.vod_play_from = key, vod.vod_play_url = id.join("#"), JSON.stringify({
		list: [vod]
	})
}
async function play(flag, id, flags) {
	const link = url + "/v_play/" + id + ".html",
		html = await request(link),
		$ = load(html),
		iframe = $("body iframe[src*=Cloud]");
	if (0 < iframe.length) {
		const iframeHtml = (await req(iframe[0].attribs.src, {
			headers: {
				Referer: link,
				"User-Agent": UA
			}
		})).content;
		let code = iframeHtml.match(/var url = '(.*?)'/)[1].split("").reverse().join(""),
			temp = "";
		for (let i = 0; i < code.length; i += 2) temp += String.fromCharCode(parseInt(code[i] + code[i + 1], 16));
		const playUrl = temp.substring(0, (temp.length - 7) / 2) + temp.substring((temp.length - 7) / 2 + 7);
		return JSON.stringify({
			parse: 0,
			url: playUrl
		})
	} {
		const js = $("script:contains(window.wp_nonce)").html(),
			group = js.match(/(var.*)eval\((\w*\(\w*\))\)/),
			md5 = Crypto,
			result = eval(group[1] + group[2]),
			playUrl = result.match(/url:.*?['"](.*?)['"]/)[1];
		return JSON.stringify({
			parse: 0,
			url: playUrl
		})
	}
}
async function search(wd, quick) {
	wd = await request(url + "/?s=" + wd);
	const $ = load(wd);
	wd = $("div.search_list > ul > li"), wd = _.map(wd, item => {
		var img = $(item).find("img:first")[0],
			a = $(item).find("a:first")[0],
			hdinfo = $($(item).find("div.hdinfo")[0]).text().trim(),
			item = $($(item).find("div.jidi")[0]).text().trim();
		return {
			vod_id: a.attribs.href.replace(/.*?\/movie\/(.*).html/g, "$1"),
			vod_name: img.attribs.alt,
			vod_pic: img.attribs["data-original"],
			vod_remarks: item || hdinfo || ""
		}
	});
	return JSON.stringify({
		list: wd
	})
}

function __jsEvalReturn() {
	return {
		init: init,
		home: home,
		homeVod: homeVod,
		category: category,
		detail: detail,
		play: play,
		search: search
	}
}
export {
	__jsEvalReturn
};