$(function() {
    var clickToLast = false;
    var thisNum = 0;
    var audioDom;
    var playMode = 0; //播放方式
    var setMutsed = false; //设置静音
    var mutsedValue = 1;
    // data = [{
    //     song_name: '再见只是陌生人',
    //     hash: 'B507808B800A5413C0E8C165AC52DE68',
    //     album_id: 553952,
    //     _: 1532159298122
    // }, {
    //     song_name: '追光者',
    //     hash: '332D8257716EFD86D075809E61CFD5D5',
    //     album_id: 2706911,
    //     _: 1532159298114
    // }, {
    //     song_name: '哪一站',
    //     hash: '1045530EF672ECF32DBE39D1940241A4',
    //     album_id: 39561602,
    //     _: 1532159298114
    // }];
    var data = [];
    getList();

    function getList() {
        $.ajax({
            type: "GET",
            url: 'http://songsearch.kugou.com/song_search_v2',
            success: function(res) {
                var r = JSON.parse(res);
                data = r.data.lists;
            }
        })
    }

    // var options = '';
    // for (var i = 0; i < data.length; i++) {
    //   options += "<option value=" + i + ">" + data[i].song_name + "</option>"
    // }
    //
    // $("#selectData").html(options);
    // $("#selectData").change(function () {
    //   getData(parseInt($("#selectData").val()));
    // });

    setTimeout(function() {
        $(".playListLength").html(data.length);
        $(".listNum").html(data.length);
        var list = '';
        for (var i = 0; i < data.length; i++) {
            $(".playContent").append("<div class='eachSong'>" +
                "<div class='serial-number'>" + (i + 1) + "</div>" +
                "<div class='song-name'>" +
                "<span>" + data[i].SongName + "</span>" +
                "<span></span>" +
                "</div>" +
                "<div class='author-name'>XXX</div>" +
                "<div class='song-duration'>03:00</div>" +
                "</div>")
        }

        $(".playStyleList .ul .li:first span").addClass("newIconOne");
    }, 400)



    $(".playStyleList .ul .li").click(function() {
        playMode = $(this).index();
        console.log("播放方式：" + playMode);
        changeThisNum();
        if (playMode == 0) {
            $(this).children(0).addClass("newIconOne").parent().siblings().children().removeClass("newIconTwo newIconThree");
            $(".changePlayMode").addClass("palyModeLoop");
            $(".changePlayMode").removeClass("palyModeSingle palyModeRandom");
        } else if (playMode == 1) {
            $(this).children(1).addClass("newIconTwo").parent().siblings().children().removeClass("newIconOne newIconThree");
            $(".changePlayMode").addClass("palyModeSingle");
            $(".changePlayMode").removeClass("palyModeLoop palyModeRandom");
        } else if (playMode == 2) {
            $(this).children(2).addClass("newIconThree").parent().siblings().children().removeClass("newIconOne newIconTwo");
            $(".changePlayMode").addClass("palyModeRandom");
            $(".changePlayMode").removeClass("palyModeLoop palyModeSingle");
        }
    });

    function randomNum() {
        var a = Math.floor(Math.random() * data.length);
        return a;
    }

    function changeThisNum(click) {
        if (playMode == 0) {
            if (clickToLast) {
                // console.log(thisNum)
                if (thisNum > 0) {
                    thisNum--;
                } else {
                    thisNum = data.length - 1;
                }
            } else {
                if (thisNum < data.length - 1) {
                    thisNum++;
                } else {
                    thisNum = 0;
                }

            }
        } else if (playMode == 1) {
            if (click === true) {
                thisNum++;
            } else if (click === false) {
                thisNum--;
            } else {
                thisNum = thisNum;
            }
        } else if (playMode == 2) {
            var getNum = randomNum();
            if (thisNum != getNum) {
                thisNum = getNum;
            } else {
                changeThisNum();
            }
        }
    }


    // audioDom = document.createElement("audio"); //创建MP3播放器

    setTimeout(function() {
        getData(0);
    }, 500)

    function getData(index) {
        // thisNum = index;
        audioDom = document.createElement("audio"); //创建MP3播放器
        audioDom.controls = "controls";
        audioDom.mutsed = setMutsed; //设置音频是否静音。
        audioDom.autoplay = true; //设置是否在加载完成后随即播放音频。
        audioDom.id = "audioDom";

        audioDom.src = ''; //清除歌曲链接
        $('.control').html(''); //清除控制器
        $('.control').append(audioDom);

        if (data.length > 0) {
            $.ajax({
                type: "GET",
                // url: "http://www.kugou.com/yy/index.php?r=play/getdata&hash=" + data[index].hash + "&album_id=" + data[index].album_id + "&_=" + new Date().valueOf(),
                url: "http://www.kugou.com/yy/index.php?r=play/getdata&hash=" + data[index].FileHash + "&album_id=" + data[index].ID + "&_=" + new Date().valueOf(),
                success: function(res) {
                    // audio_name歌曲名    album_name专辑名    song_name歌曲名    author_name作者姓名    img海报    lyrics歌词    play_url播放地址  timelength歌曲时长
                    // console.log(JSON.parse(res).data);
                    var data = JSON.parse(res).data;
                    var lrc = data.lyrics;
                    $(".poster").css('background-image', "url(" + data.img + ")");
                    $("#bg").css('background-image', "url(" + data.img + ")");
                    $(".controlPosterImg").css("background-image", "url(" + data.img + ")")
                    $(".albumContent").html(data.album_name);
                    $(".singerContent").html(data.author_name);
                    $(".lrcName").html(data.audio_name);
                    $(".songMsgLeft").html(data.audio_name);
                    $("#downHref").attr("href", data.play_url);
                    var getduration = new Date(data.timelength);
                    $(".getduration").html(getduration.getMinutes() + ":" + getduration.getSeconds());
                    audioDom.src = data.play_url;
                    var lrcArray = lrc.split("[");
                    var html = "";
                    for (var i = 0; i < lrcArray.length; i++) {
                        var arr = lrcArray[i].split("]");
                        var lrcMsg = arr[1];
                        var timers = arr[0].split(".");
                        var stime = timers[0].split(":");
                        var ms = stime[0] * 60 + stime[1] * 1 - 1;

                        if (lrcMsg) {
                            html += "<div class='eachLrc' id='" + ms + "'>" + lrcMsg + "</div>";
                        }
                    }
                    $("#m-con").html(html);
                }
            });
            clickToLast = false;
        }

        /**
         *获取歌曲长度
         */
        // setTimeout(function () {
        //   $(".getduration").html(formatSeconds(audioDom.duration.toFixed(0)))
        // }, 500);


        var history = 0;
        num = 0;
        audioDom.addEventListener("timeupdate", function() {
            var time = this.currentTime;
            $(".getCurrentTime").html(formatSeconds(this.currentTime.toFixed(0)));
            $(".progressBar").css("width", this.currentTime / audioDom.duration * 370 + "px");
            $(".progressBall").css("margin-left", this.currentTime / audioDom.duration * 370 + "px");

            if (time >= audioDom.duration) {
                timer();
            }

            //通过时间来驱动歌词
            var s = parseInt(time);
            for (var i = 0; i < s; i++) {
                $("#" + i).addClass("selfTurn").siblings().removeClass("selfTurn");
            }
            // console.log($("#"+i));
            // console.log(history + "   " + s);
            if ($("#" + i).length == 1 && history != s) {
                document.getElementById(i).scrollIntoView({
                    block: "center",
                    behavior: "smooth"
                }, false);
                history = s;
            }

        });
        audioDom.addEventListener("pause", function() {
            console.log("暂停");
            $(".playOrPause").removeClass("pause");
            $(".playOrPause").addClass("play");
        });

        audioDom.addEventListener("play", function() {
            // console.log(audioDom)
            console.log("播放");
            $(".playOrPause").removeClass("play");
            $(".playOrPause").addClass("pause");
        });

        audioDom.addEventListener("volumechange", function() {
            // console.log(audioDom.volume);
            $(".volume-bar, .volume-ball").css("margin-top", 90 * (1 - audioDom.volume) + "px");
        });

        // audioDom.addEventListener("ended", function () {
        //   console.log("yy");
        //   timer();
        //   return;
        // });

        $(".playContent .eachSong").eq(thisNum).addClass("choosedSong").siblings().removeClass("choosedSong");
        $(".choosedSong").attr("id", "choosedSong").siblings().attr("id", "");
        if (document.getElementById("choosedSong")) {
            document.getElementById("choosedSong").scrollIntoView(true);
        }
    }


    var music_resize = function() {
        $(".panelContent").css("height", $(window).height());
    };
    music_resize();
    $(window).resize(function() {
        music_resize();
    });

    /**
     * 切歌
     */
    var timer = function(click) {
        changeThisNum(click);
        setTimeout(function() {
            getData(thisNum);
            $("#selectData").val(thisNum);
            document.getElementById("m-con").scrollIntoView(false);
        }, 500);
        // setTimeout(function () {
        //   audioDom.play();
        // }, 1000);
    };

    /**
     * 下一首
     */
    $(".playNext").click(function() {
        // if (thisNum < data.length - 1) {
        //   clickToChange = false;
        // }
        timer(true);
    });

    /**
     * 上一首
     */
    $(".playLast").click(function() {
        if (thisNum >= 0) {
            clickToLast = true;
        }
        timer(false);
    });

    /**
     *  获取分秒
     */
    function formatSeconds(value) {
        var theTime = parseInt(value); // 秒
        var theTime1 = 0; // 分
        if (theTime > 60) {
            theTime1 = parseInt(theTime / 60);
            theTime = parseInt(theTime % 60);
        }
        var result = "" + parseInt(theTime);
        if (result < 10) {
            result = "0" + result;
        }
        if (theTime1 < 10) {
            result = "0" + parseInt(theTime1) + ":" + result;
        } else {
            result = "" + parseInt(theTime1) + ":" + result;
        }

        return result;
    }

    /**
     * 播放/暂停
     */
    $(".playOrPause").click(function() {
        if (audioDom.paused) {
            if (data.length > 0) {
                audioDom.play().catch(err => {
                    alert(err);
                });;
            }
        } else {
            audioDom.pause();
        }
    });

    /**
     * 声音
     */
    $(".changeVolume").click(function() {
        // console.log(audioDom.muted);
        if (audioDom.muted) {
            audioDom.muted = false;
            setMutsed = false;
            audioDom.volume = mutsedValue;
            $(".changeVolume").removeClass("noVolume");
            $(".changeVolume").addClass("volume");
        } else {
            audioDom.muted = true;
            setMutsed = true;
            audioDom.volume = 0;
            $(".changeVolume").removeClass("volume");
            $(".changeVolume").addClass("noVolume");
        }
    });

    /**
     * 循环播放等
     */
    $(".changePlayMode").click(function() {
        $(".playStyleList").toggleClass("changeDisplay");
        event.stopPropagation();
    });


    $(".panelContent").click(function() {
        $(".playStyleList").removeClass("changeDisplay")
    });

    /**
     * 下载
     */
    $(".changeShare").click(function() {
        alert("不给   <(￣︶￣)↗[GO!]");
    });

    /**
     * 隐藏控制台
     */
    $(".showOrHideControl").click(function() {
        $(this).toggleClass("showControl");
        $(".playList").removeClass("showPlayList");
        $(".musicControl").toggleClass("showMusicControl");
    });

    /**
     * 歌曲列表
     */
    $(".controlList").hover(function() {
        $(".listIcon").toggleClass("newListIcon");
    });

    $(".playContent .eachSong").hover(function() {

        console.log(123);
        $(this).toggleClass("eachSongHhover");
    });

    $(".listIcon").click(function() {
        $(".playList").toggleClass("showPlayList");
    });

    $(".icon-close").click(function() {
        console.log(12);
        $(".playList").toggleClass("showPlayList");
    });

    $(".eachSong").click(function() {
        console.log(34);
        // console.log($(this).index());
        // thisNum = $(this).index() - 1;
        // getData(thisNum);
    });

    $(".each-control:first").hover(function() {
        $(".volumeControl").show();
    }, function() {
        $(".volumeControl").hide();
    });

    $(".icon-trash").click(function() {
        audioDom.pause();
        data = [];
        // console.log(data);
        $(".posterImg").css("display", "block");
        $(".poster").css("background", "none");
        $(".controlPosterImg").css("background-image", "");
        $(".lrcName").html("啥都没有呀🙃");
        $(".lrcDetail").css("display", "none");
        $(".lrc").html("暂无播放歌曲,刷新页面啦🙄");
        $(".lrc").css("color", "#a2aab2");
        $(".lrc").css("font-size", "16px");
        $(".songMsgLeft").html("网页音乐就是牛");
        $(".getduration").html("00:00");
        $(".getCurrentTime").html("00:00");
        $(".playListLength").html(0);
        $(".listNum").html(0);
        $(".playContent .eachSong").remove();
        $(".playContentNull").css("display", "flex")
    });

    window.document.onkeydown = function(event) {
        var event = event || window.event;
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            window.event.returnValue = false;
        }
        // console.log(event.keyCode);
        if (event.ctrlKey && event.keyCode == 120) {
            $(".playNext").click();
        } else if (event.ctrlKey && event.keyCode == 119) {
            $(".playLast").click();
        } else if (event.ctrlKey && event.keyCode == 117) {
            if (audioDom.paused) {
                if (data.length > 0) {
                    audioDom.play().catch(err => {
                        alert(err);
                    });
                }
            } else {
                audioDom.pause();
            }
        } else if (event.ctrlKey && event.keyCode == 123) {
            $(".changeVolume").click();
        } else if (event.ctrlKey && event.keyCode == 122) {
            if (audioDom.volume < 1) {
                audioDom.volume += 0.1;
            }
            if (audioDom.volume > 0.1) {
                $(".changeVolume").removeClass("noVolume");
                $(".changeVolume").addClass("volume");
            }
        } else if (event.ctrlKey && event.keyCode == 121) {
            if (audioDom.volume >= 0.1) {
                audioDom.volume -= 0.1;
            }
            if (audioDom.volume < 0.1) {
                $(".changeVolume").removeClass("volume");
                $(".changeVolume").addClass("noVolume");
            }
        }
    };

    /**
     * 歌曲进度条拖动
     */
    var scroll = document.getElementsByClassName('progressBg')[0];
    var ball = document.getElementsByClassName('progressBall')[0];
    var bar = document.getElementsByClassName('progressBar')[0];
    var balleft = 0;

    $(".Ball").mousedown(function(event) {
        var event = event || window.event;
        var leftVal = event.clientX - $(".progressBg").offset().left - 6;
        audioDom.currentTime = audioDom.duration * (leftVal / scroll.offsetWidth);
    });

    ball.onmousedown = function(event) {
        var event = event || window.event;
        var leftVal = event.clientX - this.offsetLeft;
        var that = this;
        document.onmousemove = function(event) {
            var event = event || window.event;
            balleft = event.clientX - leftVal;
            if (balleft < 0)
                balleft = 0;
            else if (balleft > scroll.offsetWidth - ball.offsetWidth)
                balleft = scroll.offsetWidth - ball.offsetWidth;
            audioDom.currentTime = audioDom.duration * (balleft / scroll.offsetWidth);
            //防止选择内容--当拖动鼠标过快时候，弹起鼠标，bar也会移动
            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
        }
    };
    document.onmouseup = function() {
        document.onmousemove = null; //弹起鼠标不做任何操作
    };

    /**
     * 音量进度条拖动
     */
    var volumeScroll = document.getElementsByClassName('volume-barHome')[0];
    var volumeBall = document.getElementsByClassName('volume-ball')[0];
    var volumeBarHome = document.getElementsByClassName('volume-barHome')[0];
    var balbottom = 0;

    $(".volume-barHome").mousedown(function(event) {
        var event = event || window.event;
        // console.log($(window).height() - event.clientY - 12); //导航条底部   676导航底部据页面顶部的距离  586导航头部据页面顶部的距离
        var balbottom = $(window).height() - event.clientY - 12 - 83;
        // console.log($(window).height() - 95);
        audioDom.volume = balbottom / 90;
        mutsedValue = audioDom.volume;
        $(".volume-bar, .volume-ball").css("margin-top", 90 - balbottom + "px");
        // $(".volume-ball").css("margin-top", 90  - balbottom + "px");
        // console.log(audioDom.volume);
    });

    volumeBall.onmousedown = function(event) {
        var event = event || window.event;
        var windowHeight = $(window).height();
        var bottomVal = $(window).height() - 92;
        var that = this;
        // console.log("输出导航底部据页面顶部的距离");
        // console.log($(window).height() - 92);
        document.onmousemove = function(event) {
            var event = event || window.event;
            var ballBottom = event.clientY - (bottomVal - 90);
            if (ballBottom < 0) {
                ballBottom = 0;
            } else if (ballBottom > 90) {
                ballBottom = 90;
            }
            $(".volume-bar, .volume-ball").css("margin-top", ballBottom + "px");
            // $(".volume-ball").css("margin-top",   ballBottom + "px");
            audioDom.volume = (90 - ballBottom) / 90;
            mutsedValue = audioDom.volume;
            // audioDom.currentTime = audioDom.duration * (balleft / (scroll.offsetWidth - ball.offsetWidth));
            //防止选择内容--当拖动鼠标过快时候，弹起鼠标，bar也会移动
            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
        }
    };


});