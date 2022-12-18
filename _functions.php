<?php

/*********************
headerから余計なものを削除
*********************/
remove_action('wp_head', 'wlwmanifest_link');
remove_action('wp_head', 'wp_generator');
remove_action('wp_head', 'rsd_link');
remove_action('wp_head', 'feed_links', 2);
remove_action('wp_head', 'feed_links_extra', 3);
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_print_styles', 'print_emoji_styles');
remove_action('wp_head','rest_output_link_wp_head');
remove_action('wp_head','wp_oembed_add_discovery_links');
remove_action('wp_head','wp_oembed_add_host_js');
remove_action('wp_head', 'wp_shortlink_wp_head');


/*********************
テーマの更新通知をしない
*********************/
remove_action('load-update-core.php','wp_update_themes');
add_filter('pre_site_transient_update_themes',create_function('$a',"return null;"));


/*********************
余計なプラグインを削除
*********************/
function my_delete_plugin_files() {
	wp_deregister_script('jquery');
	wp_dequeue_style( 'jetpack-top-posts-widget' );
}
add_action( 'wp_enqueue_scripts', 'my_delete_plugin_files' );
function dequeue_jquery_migrate($scripts){
  if(!is_admin()){
   $scripts->remove('jquery');
   $scripts->add('jquery',false,array('jquery-core'),'1.10.2');
  }
 }
 add_filter('wp_default_scripts','dequeue_jquery_migrate');


/*********************
WPのバージョン番号を削除
*********************/
 function remove_src_wp_ver($dep){
  $dep->default_version = '';
 }
 add_action('wp_default_scripts','remove_src_wp_ver');
 add_action('wp_default_styles','remove_src_wp_ver');


/*********************
アイキャッチ有効化
*********************/
add_theme_support('post-thumbnails');


/*********************
画像自動トリミング
*********************/
add_image_size( 'thumb_size', 830, 471, true );


/*********************
親スラッグを取得
*********************/
function is_parent_slug() {
  global $post;
  if ($post->post_parent) { 
      $post_data = get_post($post->post_parent);
      return $post_data->post_name;
  }
}


/*********************
アイキャッチがなければデフォルト画像を取得
*********************/
function catch_that_image() {
  global $post, $posts;
  $first_img = '';
  ob_start();
  ob_end_clean();
  $output = preg_match_all('/<img.+src=[\'"]([^\'"]+)[\'"].*>/i', $post->post_content, $matches);
  $first_img = $matches [1] [0];

  if(has_post_thumbnail()){
    $image_id = get_post_thumbnail_id();
    $image_url = wp_get_attachment_image_src($image_id, true);
    $first_img = $image_url[0];
  }

  if(empty($first_img)){
    if(has_post_thumbnail()){
      $image_id = get_post_thumbnail_id();
      $image_url = wp_get_attachment_image_src($image_id, true);
      $first_img = $image_url[0];
    } else {
      $first_img = home_url('asset/img/common/default.jpg');
    }
  }
  return $first_img;
}


/*********************
bodyにクラスを付与
*********************/
add_filter( 'body_class', 'add_page_slug_class_name' );
function add_page_slug_class_name( $classes ) {
  $url = $_SERVER["REQUEST_URI"];
  if ( is_home() || is_front_page() ) {
    $classes[] = 'top';
  } elseif ( is_page() ) {
    $page = get_post( get_the_ID() );
    $page_slug = $page->post_name;

    $parent_id = $post->post_parent; // 親ページのIDを取得
    $parent_slug = get_post($parent_id)->post_name; // 親ページのスラッグを取得
    $classes[] = $page_slug;
    $classes[] = $parent_slug;

  } elseif (is_single() || is_archive() || is_tax()){
    $classes[] = get_post_type( $post );
  }
  // elseif (strpos($url,'contact')) {
  //   $classes[] = 'contact'; 
  // }
  return $classes;
}


/*********************
titleを出力
*********************/
//add_theme_support( 'title-tag' );
function my_meta_title() {
  $sitetitle = get_bloginfo('name');  // サイトタイトル

  if( is_singular('works') ) :
    $pagetitle = CFS()->get('cf_pagetitle');

  elseif ( is_tax() ) : //一覧ページ
    $post_type = get_queried_object();
    $pagetitle = esc_attr($post_type->name).' | ';
  
  elseif( is_archive() ):
    $post_type = get_queried_object();
    $pagetitle = esc_attr($post_type->label).' | ';

  elseif ( !is_home() || !is_front_page() ) : 
    global $post;
    $pagetitle = $post->post_title.' | '; // ページタイトル

  endif;

  if(!empty($pagetitle)):
	  $fulltitle = $pagetitle.' '.$sitetitle;
  else:
    $fulltitle = $sitetitle;
  endif;

  $title = "\n".'<title>'.$fulltitle.'</title>'."\n";
  echo $title;
}
add_action( 'wp_head', 'my_meta_title');


/*********************
descriptionを出力
*********************/
add_action('admin_menu', 'add_custom_fields');
add_action('save_post', 'save_custom_fields');
 
function add_custom_fields() {
  add_meta_box( 'my_sectionid', 'カスタムフィールド', 'my_custom_fields', 'page');
}
function my_custom_fields() {
  global $post;
  $page_description = get_post_meta($post->ID,'description',true);
   
  echo '<p>ページの説明（description）160文字以内<br>';
  echo '<input type="text" style="width: 600px;height: 40px;" name="description" value="'.esc_html($page_description).'" maxlength="160" /></p>';
}
function save_custom_fields( $post_id ) {
  if(!empty($_POST['description']))
    update_post_meta($post_id, 'description', $_POST['description'] );
  else delete_post_meta($post_id, 'description');
}
function get_meta_description() {
  global $post;
  $description = "";
  if ( is_home() || is_front_page()) {
    // ホームでは、ブログの説明文を取得
    $description = get_bloginfo( 'description' );
  }
  elseif ( is_page() ) {
    $custom = get_post_custom();
    if(!empty( $custom['description'][0])) {
      // 固定ページでは、カスタムフィールドを取得
      $description = $custom['description'][0];
    }
  }
  elseif ( is_single() ) {
    if ($post->post_excerpt) {
      // 記事ページでは、記事本文から抜粋を取得
      $description = $post->post_excerpt;
    } else {
      // post_excerpt で取れない時は、自力で記事の冒頭100文字を抜粋して取得
      $description = strip_tags($post->post_content);
      $description = preg_replace('/\[.*\]/','',$description);
      $description = str_replace(array("\r\n","\r","\n","&nbsp;"),'',$description);
      $description = mb_substr($description, 0, 100) . "...";
    }
  } else if (is_post_type_archive()) {
    // 一覧ページでは、下記からを取得
    $description = '株式会社◯◯のニュースページです。会社情報をはじめとした新サービス、採用情報、イベント・メディア掲載情報などの最新ニュースを配信しています。';
  } else {
    ;
  }
  $description = '<meta name="description" content="'.$description.'">' . "\n\n";
    echo $description;
}
add_action('wp_head','get_meta_description');


/*********************
OGPタグ/Twitterカード設定を出力
*********************/
function my_meta_ogp() {
    global $post;
    $ogp_title = '';
    $ogp_descr = '';
    $ogp_url = '';
    $ogp_img = '';
    $insert = '';

    if( is_singular() ) { //記事ページ
      $ogp_title = $post->post_title;
      $ogp_url = get_permalink();
      if ($post->post_excerpt) {
        // 記事ページでは、記事本文から抜粋を取得
        $ogp_descr = $post->post_excerpt;
      } else {
        // post_excerpt で取れない時は、自力で記事の冒頭100文字を抜粋して取得
        $ogp_descr = strip_tags($post->post_content);
        $ogp_descr = preg_replace('/\[.*\]/','',$ogp_descr);
        $ogp_descr = str_replace(array("\r\n","\r","\n","&nbsp;"),'',$ogp_descr);
        $ogp_descr = mb_substr($ogp_descr, 0, 100) . "...";
      }
   } elseif ( is_front_page() || is_home() ) { //トップページ
      $ogp_title = get_bloginfo('name');
      $ogp_descr = get_bloginfo('description');
      $ogp_url = home_url();
   } elseif ( is_page()) { //固定ページ
      $ogp_title = get_bloginfo('name');
      $custom = get_post_custom();
      if(!empty( $custom['description'][0])) {
        $ogp_descr = $custom['description'][0];
      }
      $ogp_url = get_permalink();
   } elseif ( is_post_type_archive()) { //アーカイブページ
     $ogp_title = get_bloginfo('name');
     $ogp_descr = '株式会社◯◯のニュースページです。会社情報をはじめとした新サービス、採用情報、イベント・メディア掲載情報などの最新ニュースを配信しています。';
     $ogp_url = get_permalink();
  }
    //og:type
    $ogp_type = ( is_front_page() || is_home() ) ? 'website' : 'article';

    //出力するOGPタグをまとめる
    $insert .= '<meta property="og:title" content="'.esc_attr($ogp_title).'" />' . "\n";
    $insert .= '<meta property="og:description" content="'.esc_attr($ogp_descr).'" />' . "\n";
    $insert .= '<meta property="og:type" content="'.$ogp_type.'" />' . "\n";
    $insert .= '<meta property="og:url" content="'.esc_url($ogp_url).'" />' . "\n";
    $insert .= '<meta property="og:image" content="'.home_url('asset/img/common/ogp.jpg').'" />' . "\n";
    $insert .= '<meta property="og:site_name" content="'.esc_attr(get_bloginfo('name')).'" />' . "\n";
    $insert .= '<meta name="twitter:card" content="summary_large_image" />' . "\n";
    $insert .= '<meta property="og:locale" content="ja_JP" />' . "\n";

    echo $insert;
}
add_action('wp_head','my_meta_ogp');//headにOGPを出力


/*********************
scriptタグ出力
*********************/
function my_script_load(){
  wp_deregister_script('jquery');
  wp_enqueue_script('jQuery', 'https://code.jquery.com/jquery-3.3.1.min.js', array());
	// if ( is_home() || is_front_page() ) :
  //   wp_enqueue_script('slick', 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick.min.js', array());
  // elseif (is_page('') || is_parent_slug('')) :

  // endif;
	wp_enqueue_script('base', home_url('asset/js/common.js'), array());
}
add_action('wp_footer','my_script_load');


/*********************
CSS出力
*********************/
function add_style_sheet(){
  if (have_posts()) :
    global $post;
    if(is_page()) :
      $parent_id = $post->post_parent;
      $slug = get_post($parent_id)->post_name;
    elseif (is_archive() || is_single() || is_tax()) :
      $slug = get_post_type( $post );
    endif;
  endif;

  if ( is_home() || is_front_page() ) :
    // wp_enqueue_style('slick', 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick.min.css');
  	wp_enqueue_style('allstyle', home_url('asset/css/top/style.css?'.date('Ymd-Hi')));
  elseif (is_404()) :
    wp_enqueue_style('contactstyle', home_url('asset/css/other/style.css'));
  else :
    wp_enqueue_style('articlestyle', home_url('asset/css/'.$slug.'/style.css'));
  
  endif;
}
add_action('wp_enqueue_scripts', 'add_style_sheet');