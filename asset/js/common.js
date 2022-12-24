// --- 共通関数 -----------------------------------------------

// load判定関数（PC,SP共通処理）
function loadedPageFunc() {
  $("body").addClass("loaded");
}
//SP、タブレット時.telにclass付与
function AddNoLink() {
  if (navigator.userAgent.match(/(iPhone|iPad|iPod|Android)/i)) {
    $(".tel").removeClass("no_link");
  } else {
    $(".tel").addClass("no_link");
  }
}
//タブ処理
function tabContentFunc() {
  $(".tab li").on("click", function () {
    index = $(".tab li").index(this);
    $(".tab li").removeClass("active");
    $(".tab li").eq(index).addClass("active");
    $(".tab_block").removeClass("active");
    $(".tab_block").eq(index).addClass("active");
  });
}
// アコーディオン処理★★★★★
// （dl > dt dd dt dd...を想定　<dt class="ac_trigger">をクリックした時にddをアコーディオン処理）
function showAccordionFunc() {
  var acTrigger = $(".ac_trigger");
  // 常に一つだけの処理
  // acTrigger.click(function () {
  // 	if ($(this).hasClass('show')) {
  // 		$(this).removeClass('show').next('dd').slideUp();
  // 	} else {
  // 		$(".ac_trigger").removeClass('show');
  // 		$('dd').slideUp();
  // 		$(this).addClass('show').next('dd').slideDown();
  // 	}
  // });

  // 全部開く
  acTrigger.click(function () {
    if ($(this).hasClass("show")) {
      $(this).removeClass("show").next("dd").slideUp();
    } else {
      $(this).addClass("show").next("dd").slideDown();
    }
  });
}

function fixSpanTag(){
  //spanタグを追加する
  var element = $(".eachTextAnime");
  element.each(function () {
    var text = $(this).text();
    var textbox = "";
    text.split('').forEach(function (t, i) {
      if (t !== " ") {
        textbox += '<span style="animation-delay:.' + i + 's;">' + t + '</span>';
      } else {
        textbox += t;
      }
    });
    $(this).html(textbox);
  });
}


//表示アニメーション
function scrollAnimFunc() {
  $(window).on("scroll", function () {
    $(".anim, .fade_y, .svg_anim, .scr_cvr , .text_anime").each(function () {
      scr = $(window).scrollTop();
      winHeight = $(window).height();
      action = $(this).offset().top;
      if (scr > action - winHeight + winHeight / 4) {
        $(this).addClass("on");
      }
    });
  });
}

//SP triggerクリックでメニュー展開
function spMenuOpenFunc() {
  $(".trigger").click(function () {
    if ($(this).hasClass("close")) {
      $(".menu").removeClass("on");
      $(this).removeClass("close");
    } else {
      $(".menu").addClass("on");
      $(this).addClass("close");
    }
  });
}

//SP menu展開時に背景固定
function spBodyFixedFunc() {
  var w = $(window).width();
  if (w < 896) {
    var state = false;
    var scrollpos = "";
    $(".trigger").on("click", function () {
      if (state == false) {
        scrollpos = $(window).scrollTop();
        $("body").addClass("sp_fix").css({
          top: -scrollpos,
        });
        state = true;
      } else {
        $("body").removeClass("sp_fix");
        window.scrollTo(0, scrollpos);
        state = false;
      }
    });
    $(".close").on("click", function () {
      $("body").removeClass("sp_fix");
      window.scrollTo(0, scrollpos);
      state = false;
    });
  }
}

//ヘッダーにfv以降までスクロールで何らかの処理
function headerAddEventFunc() {
  if ($(".firstview").length) {
    $(window).on("scroll", function () {
      scr = $(window).scrollTop();
      firstview = $(".firstview").offset().top;
      winHeight = $(window).height();
      if (scr > firstview + winHeight) {
        $(".header").addClass("on");
      } else {
        $(".header").removeClass("on");
      }
    });
  }
}

//header ホバーでメガドロップ
function menuShowDelay(element, delayTime) {
  var sethover;
  var setleave;
  var setnexthover;
  var targetOn;
  var targetOff;
  var nowActive = -1;
  var hoverClass = "hover";
  var manuElement = element;
  var hoverTime = delayTime;

  manuElement.on({
    mouseover: function () {
      $(".header").addClass("no_mix");
      targetOn = $(this);
      if (nowActive === -1) {
        sethover = setTimeout(function () {
          targetOn.addClass(hoverClass);
          targetOn.find(".nav--area--under").fadeIn();
          $(".overlay").fadeIn();
          nowActive = manuElement.index(targetOn);
        }, hoverTime);
      } else {
        if (targetOn.hasClass(hoverClass)) {
          clearTimeout(setleave);
        } else {
          setnexthover = setTimeout(function () {
            manuElement.removeClass(hoverClass);
            manuElement.find(".nav--area--under").fadeOut();
            $(".overlay").fadeOut();
            targetOn.addClass(hoverClass);
            targetOn.find(".nav--area--under").fadeIn();
            $(".overlay").fadeIn();
            nowActive = manuElement.index(targetOn);
          }, hoverTime);
        }
      }
    },
    mouseout: function () {
      $(".header").removeClass("no_mix");
      targetOff = $(this);
      clearTimeout(sethover);
      function mouseIsOverWorkaround(what) {
        var temp = $(what).parent().find(":hover");
        return temp.length == 1 && temp[0] == what;
      }
      var parent = targetOff;
      if (mouseIsOverWorkaround(parent[0])) {
        if (targetOff.hasClass(hoverClass)) {
          clearTimeout(setnexthover);
        }
      } else {
        setleave = setTimeout(function () {
          targetOff.removeClass(hoverClass);
          targetOff.find(".nav--area--under").fadeOut();
          $(".overlay").fadeOut();
          nowActive = -1;
        }, hoverTime);
      }
    },
  });
}

// --- 関数実行 -----------------------------------------------

//DOM生成後
$(function () {
  //******************
  // 共通処理
  //******************
  AddNoLink();
  tabContentFunc();
  scrollAnimFunc();
  spMenuOpenFunc();
  spBodyFixedFunc();
  headerAddEventFunc();
  showAccordionFunc();

  //****************************
  // その他は要素の有無で個別で実装
  //****************************
  if ($(".className").length) {
  }
});

//ページの全データを読み込み後
$(window).on("load", function () {
  loadedPageFunc();
  fixSpanTag();
  var w = $(window).width();
  var x = 896;
  if (w > x) {
    $(function () {
      menuShowDelay($(".modal"), 0);
    });
  } else {
    $(".modal").off("mouseenter mouseleave");
  }
});

//リサイズが走った場合
$(window).on("resize", function () {});

// --- tips -----------------------------------------------

//****************************
//背景が白のエリアでなんかする
//****************************

// if ($('.wht_area').length) {
// 	$(window).on('scroll', function () {
// 		whtArea = $('.wht_area').offset().top;
// 		whtHeight = $('.wht_area').outerHeight();
// 		whtBottom = whtArea + whtHeight;
// 		scr = $(window).scrollTop();
// 		if (scr < whtArea) {
// 			$(".header").removeClass("wht");
// 		} else if (scr > whtArea && scr < whtBottom) {
// 			$(".header").addClass("wht");
// 			$(".header").addClass("wht");
// 		} else if (scr > whtBottom) {
// 			$(".header").removeClass("wht");
// 		}
// 	});
// }

//****************************
//スクロール途中で全画面の背景固定
//****************************

// $(window).on('scroll', function () {
// 	scr = $(window).scrollTop();
// 	wrap = $('.fix_bg_wrap').offset().top;
// 	wrapHeight = $('.fix_bg_wrap').outerHeight();
// 	winHeight = $(window).outerHeight();

// 	if (scr > wrap + wrapHeight - winHeight) {
// 		$('.fix_bg').removeClass('fixed');
// 		$('.fix_bg').addClass('bottom');
// 	} else if (scr > wrap) {
// 		$('.fix_bg').addClass('fixed');
// 		$('.fix_bg').removeClass('bottom');
// 	} else if (scr < wrap) {
// 		$('.fix_bg').removeClass('fixed');
// 	}
// });

//****************************
//slickの基本処理（レスポンシブ）
//****************************
  var $slider01 = $('#slider01');
  var $nowcnt = $('.top__achievement__slidearea__counter__index');
 
  /*--- 枚数カウント設定 -----------------------*/
  // スライダーが初期化された時、再初期化、切り替え後に発火
  $slider01.on('init reInit afterChange', function (event, slick) {
    $nowcnt.text(slick.currentSlide + 1);
  })
  // スライド切り替え前に発火
  $slider01.on("beforeChange", function (event, slick, currentSlide, nextSlide) {
    $nowcnt.text(nextSlide + 1);
  });

$('#slider01').slick({
	slidesToShow: 1,
	slidesToScroll: 1,
	autoplay: true,
  fade: true,
  dots: true, 
  appendDots: $('.dots01'),
	autoplaySpeed: 4000,
	//個別でarrowを追加
	prevArrow: '<div class="slick-prev slick-arrow ablt"><img src="asset/img/top/ico_achievement_prev01.png" alt="prev"></div>',
	nextArrow: '<div class="slick-next slick-arrow ablt"><img src="asset/img/top/ico_achievement_next01.png" alt="next"></div>',
	responsive: [
		{
			breakpoint: 896,
			settings: {
				slidesToShow: 1,
				centerMode: true
			}
		}
	]
});

var w = $(window).width();
if (w < 896) {
  $('#slider02').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    fade: true,
    autoplaySpeed: 4000,
    //個別でarrowを追加
    prevArrow: '<div class="slick-prev slick-arrow ablt"><img src="asset/img/top/ico_achievement_prev01.png" alt="prev"></div>',
    nextArrow: '<div class="slick-next slick-arrow ablt"><img src="asset/img/top/ico_achievement_next01.png" alt="next"></div>',
    responsive: [
      {
        breakpoint: 896,
        settings: {
          slidesToShow: 1,
          centerMode: true
        }
      }
    ]
  });
  $('#slider03').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 10000,
    fade: true ,
    dots: true, 
    appendDots: $('.dots02'),
    //個別でarrowを追加
    prevArrow: '<div class="slick-prev slick-arrow ablt"><img src="asset/img/top/ico_prev_white01.png" alt="prev"></div>',
    nextArrow: '<div class="slick-next slick-arrow ablt"><img src="asset/img/top/ico_next_white01.png" alt="next"></div>',
  });
  $('.close_modal').click(function(){
    $('.close_modal').fadeOut();
    $('.top__service__flow__modalwrap').removeClass("on");
  })
  $('.modal-trigger').click(function(){
    $('.close_modal').fadeIn();
    $('.top__service__flow__modalwrap').addClass("on");
    if($(this).hasClass("modal-trigger01")){
      $("#slider02").slick('slickGoTo', 0);
      console.log("2");
    }else if($(this).hasClass("modal-trigger02")){
      $("#slider02").slick('slickGoTo', 1);
      console.log("3");
    }else if($(this).hasClass("modal-trigger03")){
      $("#slider02").slick('slickGoTo', 2);
      console.log("3");
    }
  })
}

//****************************
//自動で流れるカルーセルスライダー
//****************************

// $('#carousel_slider').slick({
// 	arrows: false,
// 	autoplay: true,
// 	autoplaySpeed: 0,
// 	cssEase: 'linear',
// 	speed: 15000,
// 	slidesToShow: 3,
// 	slidesToScroll: 1,
// 	responsive: [
// 		{
// 			breakpoint: 896,
// 			settings: {
// 				slidesToShow: 2
// 			}
// 		}
// 	]
// });

//****************************
//スライドが動くのに連携して処理する
//****************************

// var slider = "#slider"; // スライダー
// var thumb = "#thumb_item"; // サムネイル画像アイテム

// // サムネイル画像アイテムに data-index でindex番号を付与
// $(thumb).each(function () {
// 	var index = $(thumb).index(this);
// 	$(this).attr("data-index", index);
// });

// // スライダー初期化後、カレントのサムネイル画像にクラス「thumbnail-current」を付ける
// // 「slickスライダー作成」の前にこの記述は書いてください。
// $(slider).on('init', function (slick) {
// 	var index = $(".slide-item.slick-slide.slick-current").attr("data-slick-index");
// 	$(thumb + '[data-index="' + index + '"]').addClass("thumb_current");
// });
// //slickスライダー初期化
// $(slider).slick({
// 	autoplay: true,
// 	arrows: false,
// 	fade: true,
// 	infinite: true
// });
//サムネイル画像アイテムをクリックしたときにスライダー切り替え
// $(thumb).on("click", function () {
// 	var index = $(this).attr("data-index");
// 	$(slider).slick("slickGoTo", index, false);
//   });
// //サムネイル画像のカレントを切り替え
// $(slider).on('beforeChange', function (event, slick, currentSlide, nextSlide) {
// 	$(thumb).each(function () {
// 		$(this).removeClass("thumb_current");
// 	});
// 	$(thumb + '[data-index="' + nextSlide + '"]').addClass("thumb_current");
// });

//****************************
//modal_openクリックでYouTubeポップアップ
//****************************

// $(".modal_open").on('click', function () {
// 	$("#videoframe").attr("src", "https://www.youtube.com/embed/youtubeID");
// 	$(".modal-overlay").fadeIn('slow');
// 	posCenter();
// 	$(window).on('resize', function () {
// 		posCenter();
// 	});
// 	function posCenter() {
// 		var w = $(window).width();
// 		var h = $(window).height();
// 		var ow = $(".modal-panel").outerWidth();
// 		var oh = $(".modal-panel").outerHeight();
// 		$(".modal-panel").css({
// 			'left': ((w - ow) / 2) + 'px',
// 			'top': ((h - oh) / 2) + 'px'
// 		});
// 	}
// 	$(".modal-close, .modal-overlay").on('click', function () {
// 		$(".modal-overlay").fadeOut('slow');
// 		$("#videoframe").attr("src", "");
// 	});
// });

//****************************
//$count要素のカウントアップを開始する
//****************************

// function CountUp($count) {
// 	var countMax = $count.attr('data-num');
// 	var countNext = 0;
// 	var countTimer;
// 	function timer() {
// 		countTimer = setInterval(function () {
// 			if (countNext < countMax) {
// 				countNext = countNext + Math.round((countMax - countNext) / 2);
// 				$count.text(countNext);
// 			} else if (countNext == countMax) {
// 				clearInterval(countTimer);
// 			}
// 		}, 40);
// 	}
// 	timer();
// }
// function detectCountElement($counts) {
// 	$.each($counts, function (i, countElement) {
// 		var $count = $(countElement);
// 		if ($count.attr("data-isLaunched")) {
// 			return;
// 		}
// 		var $window = $(window);
// 		var scr = $window.scrollTop();
// 		var winHeight = $window.innerHeight();
// 		var offset = $count.offset().top;
// 		if (scr > offset - winHeight + winHeight / 4) {
// 			CountUp($count);
// 			$count.attr("data-isLaunched", true);
// 		}
// 	});
// }
// $(function () {
// 	var $counts = $(".count");
// 	detectCountElement($counts);
// 	$(window).scroll(detectCountElement.bind(window, $counts));
// });

//****************************
//マウス追従
//****************************

//ie以外
// var userAgent = window.navigator.userAgent.toLowerCase();
// if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || userAgent.indexOf('msie') != -1 || userAgent.indexOf('edge') != -1 || userAgent.indexOf('trident/7') != -1) {
// 	$('#pointer').remove();
// } else {
// 	//特定の要素にマウスオーバーで何らかの処理
// 	$('').mouseenter(function () {
// 		$('#pointer').addClass("hvr");
// 	}).mouseleave(function () {
// 		$('#pointer').removeClass("hvr");
// 	});
// 	//追従処理
// 	var xMousePos = 0;
// 	var yMousePos = 0;
// 	$(window).on('mousemove', function (event) {
// 		xMousePos = event.clientX;
// 		yMousePos = event.clientY;
// 	});
// 	window.requestAnimationFrame(function PointerMove() {
// 		$("#pointer").css('transform', 'matrix(1, 0, 0, 1, ' + xMousePos + ',  ' + yMousePos + ')');
// 		window.requestAnimationFrame(PointerMove);
// 	});
// }
// window.onpageshow = function (event) {
// 	if (event.persisted) {
// 		window.location.reload();
// 	}
// };

// #pointer{
// 	//カーソル位置を合わす
// 	margin-top:-10px;
// 	margin-left:-10px;
// 	position:fixed;
// 	top:0;
// 	left:0;
// 	z-index: 9998;
// 	pointer-events:none;
// 	transform-origin: center center;
// 	transition: all 0.15s ease-out;
// }

//****************************
//スクロールで画像パララックス
//****************************

// $(window).on('scroll', function () {
// 	scr = $(window).scrollTop();
// 	winhig = $(window).outerHeight();
// 	var bgPosition = scr / 250;
// 	//画像自体
// 	if (bgPosition) {
// 		$('').css('transform', 'translateX(' + bgPosition + '%)');
// 		$('').css('transform', 'translateX(-' + bgPosition + '%)');
// 		$('').css('transform', 'translateY(' + bgPosition + '%)');
// 		$('').css('transform', 'translateY(-' + bgPosition + '%)');
// 	}
// 	//背景画像
// 	if (bgPosition) {
// 		$('').css('background-position', + bgPosition + 'px');
// 		$('').css('background-position', '-' + bgPosition + 'px');
// 	}
// });

// .para_wrap {
//   overflow: hidden;
//   height: 100%;
//   .para_box {
//     width: 130%;
//     transition: ease;
//     transform: translateX(0%);
//     transform: translateY(0%);
//   }
// }
