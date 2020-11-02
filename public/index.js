$(document).ready(function () {
  var socket = io();

  var usrname;
  var storedUsername ;
  var storedPass;
  var storedEmail;
  var fname;
  var lname;
  var bio;
  var rooms ={};
  var usrroom = [];
  var color = ['#232b2b','#453832','#cf8a06','#9a9500','#efc050','#964f4c','#c60021','#019875','#ff6f61','#5f4b8b','#88b04b','#ad5e99','#009473','#dd4124','#7bc4c4','#0f4c81', '#1da1f2'];
  $('html').css('--changeColor',color[Math.round(Math.random()*16)]);
  var color = ['#f6f6f6','#fff0fd','#f9faf0','#f7fff4','#efc050','#964f4c','#c60021','#019875','#ff6f61','#5f4b8b','#88b04b','#ad5e99','#009473','#dd4124','#7bc4c4','#0f4c81', '#f5f8fa'];


  $('#usrname').val('');
  $('#email').val('');
  $("#pass").val('');
  $("#rpass").val('');

  //check if username exist
  $('#usrname').on('input', function () {
    var onusrname = $(this).val();
    socket.emit('onusrname', onusrname);
    socket.on('isUsr', function (isUsr) {
      if (onusrname != '') {
        if (isUsr != '') {
          $('.Serror').html('>'+isUsr+'<');
          $('#Ss').prop('disabled', true);
          $('#Ss').css({'opacity': '.4', 'cursor': 'not-allowed'});
        }else {
          $('.Serror').html('');
          $('#Ss').prop('disabled', false);
          $('#Ss').css({'opacity': '1', 'cursor': 'pointer'});
        }
      }else {
        $('.Serror').html('');
        $('#Ss').prop('disabled', false);
        $('#Ss').css({'opacity': '1', 'cursor': 'pointer'});
      }
    })
  });

  //sign up handle
  $('.sform').submit(function (event) {
    usrname = $('#usrname').val();
    var email = $('#email').val();
    var pass = $("#pass").val();
    var rpass = $("#rpass").val();
    $('.storeusr').val(usrname);
    $('.storepass').val(pass);
    $('.storeemail').val(email);
    storedUsername = $('.storeusr').val();
    storedPass = $('.storepass').val();
    storedEmail = $('.storeemail').val();
    event.preventDefault();
    if (pass != rpass) {
      $('.Serror').html('>Passwords do not match<');
    }
    else {
      socket.emit('usrinfo', {usrname, email, pass, rpass});
      $('.Sform').css('opacity','0');
      $('.Sheader').css('opacity','0');
      $('.sinfo').css('opacity','0');
      $('.Sp').html('');
      setTimeout(function () {
        $('.Sform').css('display','none');
        $('.Sform2').css('display','block');
      },2000);
      setTimeout("$('.Sform2').css('opacity','1')",2500);
    }
  });

  //getting Authentication code
  var vcode;
  socket.on('id', function (id) {
    vcode = id[usrname];
  });
  //verification
  $('.form2').submit(function (event) {
    $(this).val('');
    event.preventDefault();
    var getcode = $('#getcode').val();
    if (getcode != vcode) {
      alert('Your code is not match');
    }
    else {
      $('#CodeS').prop('disabled', false);
      socket.emit('emailIsOk', {storedUsername, storedPass, storedEmail});
      $('.form2').css('opacity','0');
      $('.saturn').css('opacity','0');
      $('.Sheader').css({'top':'40%','left':'50%','transition':'all .2'})
      setTimeout(function () {
        $('.saturn').css({'display':'none'});
        $('.form2').remove();
        $('.Shed').html('<h1>wellcome!</h1>');
        $('.Sheader').css('opacity','1')
      },1000);
      setTimeout(function () {
        $('.addprofpic').css({'display':'block'});
      },2000);
      setTimeout(function () {
        $('.addprofpic').css({'opacity':'1'});
        $('.skip1').css('display','block');
      },2500);
      }
  });

  //skip1 button
  $('.skip1').click(function (e) {
    $('.addprofpic').css({'opacity':'0'});
    $('.Sheader').css('opacity','0');
    $('.skip1').css('opacity','0');
    setTimeout(function () {
      $('.skip1').css('display','none');
      $('.addprofpic').css({'display':'none'});
      $('.Sheader').css({'left':'80%','top':'50%','font-size':'40px','text-align':'left','width':'40%','height':'30%'});
      $('.Sheader').html('<h1>You can complete<br>your profile now!');
    },2000);
    setTimeout(function () {
      $('.skip2').css('display','block');
      $('.Sheader').css({'opacity':'1'});
      $('.Sheader').css({'display':'block'});
      $('.Uinfo').css({'display':'block'});
    },2500);
    setTimeout(function () {
      $('.Uinfo').css({'height':'80%'});
    },3000);
    setTimeout(function () {
      $('.updateprof').css({'opacity':'1'});
      $('.skip2').css('opacity','1');
    },3300);
  });

  //skip2 button
  $('.skip2').click(function () {
    $('.Uinfo').css({'height':'0%'});
    $('.Uinfo').css('opacity','0')
    $('.skip2').css('opacity','0');
    $('.Sheader').css('opacity','0');
    setTimeout(function () {
    $('.Uinfo').css('display','none');
      $('.skip2').css('display','none');
      $('.addprofpic').css('display','none');
      $('.Sheader').css('display','none');
    },1000);
    setTimeout(function () {
      $(".maincont").css("display","block");
    },1500);
  });



  $('#usrname').change(function () {
    var e = $('#usrnameu').val($(this).val());
  });
  $('#email').change(function () {
    $('#emailu').val($(this).val());
  });

  //charachter counter
  var cont = 0;
  $('#bios').keydown(function (e) {
    if (cont < 100) {
      if (e.keyCode != 8) {
        cont ++;
        var a = 100 - cont;
        $("#char").html(a)
      }
    }
    if (e.keyCode == 8) {
      if (cont > 0) {
        cont--;
        var a = 100 - cont;
        $("#char").html(a);
      }
    }
  });
  $('#bios').on('input',function () {
    var c = $('#bios').val().split('').length;
    $("#char").html(100-c)
  });

  //get profile pic
  $('#ufile').on('change', function (e) {
    var data = e.target.files[0];
    readThenSendFile(data);
  });
  function readThenSendFile(data){

    var reader = new FileReader();
    reader.onload = function(evt){
      var file = evt.target.result;
      socket.emit('profilePic', file);
    };
    reader.readAsDataURL(data);
  }
  var src;
  socket.on('profilePic',function (data) {
    src = data;
    $('#pPic').attr('src', '');
    $('#pPic').attr('src', src);
  })

  $('.profpic').on('click',function (e) {
    socket.emit('setProfile', {src, storedUsername});
  });

  //get other data of profile
  $('.updateprof').submit(function (event) {
    event.preventDefault();
    var usr = $('#usrnameu').val();
    fname = $('#usrfn').val();
    lname = $('#usrln').val();
    bio = $("#bios").val();
    var rpass = $("#rpass").val();
    socket.emit('otherinfo', {usr, fname, lname, bio})
  });

  //log in handle
  $('.nform').submit(function (e) {
    e.preventDefault();
    var loginusr = $('#nusrname').val();
    var loginpass = $('#npass').val();
    $('.storeusr').val(loginusr);
    $('.storepass').val(loginpass);
    storedUsername = $('.storeusr').val();
    storedPass = $('.storeusr').val();
    socket.emit('loginCheck', {loginusr, loginpass});
  });
  //getting verification for login inputs
  socket.on('checkRes', function (checkRes) {
    if (checkRes.checkRes == 'ok') {
      $('.Nerror').html('');
      var c = '';
      if (!checkRes.f) checkRes.f = '';
      if (!checkRes.l) checkRes.l = '';
      if (!checkRes.b) checkRes.b = '';
      if (checkRes.c) c = '<i style="font-size:24px;color:var(--changeColor);display: inline-block;padding:0 5px;position:relative; bottom:.5px;" class="fa">&#xf058;</i>';
      $('.Nerror').html('');
      $("body").css("overflow","hidden");
      $(".SignInFrom").css('display','none');
      $(".maincont").css('display','block');
      $(".maincont").append('<div class="timelineicon"><i id="timelineicon" class="material-icons">&#xe8f9;</i></div><div class="homeicon"><i class="fa" id="homeicon">&#xf015;</i></div><div class="menuicon"><i class="fa" id="menuicon">&#xf0c9;</i></div><div class="menu"><div class="secr"><div class="rsect"><div class="rtsecr"><div class="profCont"><div class="pimg"><img class="ppicture" src="'+checkRes.src+'"" alt="Your picture"></div><div class="Usinfo"><h1>'+checkRes.f+' '+checkRes.l+c+'</h1><h3>@'+checkRes.u+'</h3></div></div></div><div class="rtsecl"><div class="usrInfo bioSec"><span>Bio</span><p>'+checkRes.b+'</p></div><div class="usrInfo flw"><div class="flwr"><span id="followers'+checkRes.u+'">'+checkRes.fr+'</span><br><span>Follower</span></div><div class="flwg"><span id="followings'+checkRes.u+'">'+checkRes.fg+'</span><br><span>following</span></div></div></div></div><div class="rsecb"></div></div><div class="secl"><div class="controlnav"><div class="cn setting"><i style="font-size:44px" class="fa">&#xf013;</i></div><div class="cn profileset"><i style="font-size:44px" class="fa">&#xf2c0;</i></div><div class="cn saved"><i style="font-size:44px" class="fa">&#xf097;</i></div><div class="cn notif"><i style="font-size:44px" class="fa">&#xf0a2;</i></div><div class="cn flfg"><i class="material-icons" id="j">&#xe915;</i></div></div></div></div><div class="blackArea"></div><div class="blackArea2"></div><div class="blackArea4"></div><div class="blackArea3"><div class="sk-folding-cube"><div class="sk-cube1 sk-cube"></div><div class="sk-cube2 sk-cube"></div><div class="sk-cube4 sk-cube"></div><div class="sk-cube3 sk-cube"></div></div></div><div class="writePost"><div class="writePost_main"><textarea class="txtarea" max = "300" rows="1" cols="80" placeholder="What is your situation...?"></textarea><div class="postCon"></div><div class="media"></div></div><button class="sendPost" type="button" name="button">SharSit!</button><div class="attach"><div class="emoji"><i style="font-size:34px; color: white;line-height: 69px;" class="far">&#xf118;</i></div><div class="file"><form><input class="fileUp" type="file" name="" value=""><button id ="sEnd">Send</button></form></div><div class="fileSkin"><i style="font-size:34px; color: white;line-height: 69px;" class="fas">&#xf0c6;</i></div></div></div><div class="mainsec"><div class="postArea '+checkRes.u+'pA" ></div></div><div class="rnav"><div class="rnavCont"><div class="youLike"><h1 class="yLHead">People to follow</h1><div class="yLcont"><div class="CS">Coming Soon !</div></div></div><div class="trends"><h1 class="tHead">Trends now</h1><div class="Tcont"></div></div></div></div><div class="lnav"><div class="Search"><input id="search" type="search" name="" value="" placeholder="Search SharSit..." autocomplete="off"></div><div class="SResC"><div class="SRC"></div></div><div class="new"><div class="newcont"><i style="font-size:50px;text-shadow: 7px 7px 7px rgba(0,0,0,.4);" class="fas">&#xf5ad;</i></div></div></div>')
      $('.blackArea3').css({'z-index':'2', 'opacity':'.4'});
    }else {
      $('.Nerror').html(checkRes.checkRes);
      }
  });
  //load all posts
  socket.on('postload', function (p) {
    $('.blackArea3').css({'z-index':'-2', 'opacity':'0'});
    var img = p.im;
    var pcont = p.p, pdate = p.d, pl = p.lk, pr = p.rp, postId = p.pi, puser = p.u, plnameOk, srcOk;
    var pfname = p.ff, plname =p.ll, isL = p.isLike, pcert = p.cc, pcertOk, pfnameOk, src = p.ss;
    for (var i = 0; i < pcont.length; i++) {
      if (src[i] == '') {
        srcOk = 'profile.png'
      }else {
        srcOk = src[i];
      }
      if (pcert[i] == 1){ pcertOk = '<i style="font-size:24px;color:var(--changeColor);display: inline-block;padding:0 5px;position:relative; bottom:.5px;" class="fa">&#xf058;</i>';
      }else{
        pcertOk = '';}
      if (pfname[i]=='' && !plname[i]=='') {
        pfnameOk = 'SharSit';
        plnameOk = 'user';}
      if (pfname[i] =='' && plname[i] !='') {pfnameOk = ''; plnameOk = plname[i];}
      if (pfname[i] !='' && plname[i] == '') {plnameOk = ''; pfnameOk = pfname[i];}
      if (pfname[i] !='' && plname[i] !='') {plnameOk = plname[i]; pfnameOk = pfname[i]};
      if (img[i]) {
      }
      if (+pl[i] > 999 && +pl[i] < 1100) {
        pl[i] = Math.round(pl[i]/1000);
        pl[i] = pl[i]+'k';
      }
      if (+pl[i] > 1099) {
        pl[i] = Math.round(pl[i]/1000);
        pl[i] = pl[i].toFixed(1)
        pl[i] = pl[i]+'k';
      }
      pcont[i] = pcont[i].replace(/(^|\s)(#[a-z\d-_!?]+)/ig, "$1<span class='hash_tag'>$2</span>");
      pcont[i] = pcont[i].replace(/(^|\s)(@[a-z\d-_!?]+)/ig, "$1<span class='at_sign pHin' info='$2'>$2</span>");
      $('.postArea').prepend('<div class="Post '+puser[i]+'PoSt" poId="'+postId[i]+'"><div class="posterInfo"><div class="PInf"><div class="Pimg"><img src="'+srcOk+'" alt=""></div><div class="Pname pHin" info="'+puser[i]+'"><h1>'+pfnameOk+' '+plnameOk+pcertOk+'</h1><p>@'+puser[i]+'</p></div></div><div class="postInter" iId="'+postId[i]+'"><div class="postIndex '+postId[i]+'ind"></div><i style="font-size:35px;" class="material-icons iicon">&#xe5d3;</i></div></div><div class="content">'+pcont[i].replace(/(?:\r\n|\r|\n)/g, "<br />")+'<div class="postDate"><time>'+pdate[i].replace('T','<br/>').replace('.000Z','')+'</time></div></div><div class="mediaPost '+postId[i]+'IMP"></div><div class="postAction"><div class="postLike act"><i style="font-size:30px;color:#999;display:block;" class="far w Lk" act="liking" uId='+puser[i]+' pId="'+postId[i]+'">&#xf004;<i style="font-size:30px;color:var(--changeColor);display:block;" class="fas bl interA '+postId[i]+'IAL" id="like">&#xf004;</i></i><div class="LCC '+postId[i]+'L">'+pl[i]+'</div></div><div class="postReply act"><i style="font-size:30px;color:#999;display:block;" class="far w Rp" act="replying" uId='+puser[i]+' pId="'+postId[i]+'">&#xf075;<i style="font-size:30px;color:#996633;display:block;" class="fas bl interA '+postId[i]+'IAR" id="reply">&#xf075;</i></i><div class="RCC '+postId[i]+'R">'+pr[i]+'</div></div><div class="postSave act"><i style="font-size:30px;color:#999;display:block;" class="fa w Sv" act="saving" uId='+puser[i]+' pId="'+postId[i]+'">&#xf097;<i style="font-size:30px;color:#00802b;display:block;" class="fa bl interA '+postId[i]+'IAS" id="save">&#xf02e;</i></i><div class="SCC '+postId[i]+'S">0</div></div></div></div></div>');
      if (isL[i]) {
        $('.'+postId[i]+'IAL').css('opacity','1');
      }
      if (img[i]) {
        img[i] = img[i].replace('data', '||||');
        img[i] = img[i].split('||||');
        for (var j= 1; j < img[i].length ; j++) {
          if(img[i][j].slice(img[i][j].length-1, img[i][j].length) == ',') {
            img[i][j] = ':'+img[i][j].slice(1, img[i][j].length-1);
          }
          $('.'+postId[i]+'IMP').append('<div class="mediaContPost '+postId[i]+'IMPP"><img class="writePostMediapost postimg" src="data'+img[i][j]+'" alt=""></div>');
          }
      }
    }
  });

  //go to home
  $('.maincont').on('click', '.homeicon', function (e) {
    var rooM = rooms[storedUsername]
    socket.emit('goHome', {storedUsername, rooM});
  });
  socket.on('Homepostload', function (p) {
    var img = p.im;
    var pcont = p.p, pdate = p.d, pl = p.lk, pr = p.rp, pr = p.rp, postId = p.pi, src = p.s;
    var puser = p.u, pfname = p.f, plname =p.l, pHcert = p.c, isL = p.isLikeHome;
    $(".CusrInfo").remove();
    $(".rnavCont").css('display','flex');
    $(".rnav").css('background','none');
    $(".mainsec").empty();
    if (!src) {
      src = 'profile.png';
    }else {
      src = src;
    }
    if (p.c){ pHcert = '<i style="font-size:24px;color:var(--changeColor);display: inline-block;padding:0 5px;position:relative; bottom:.5px;" class="fa">&#xf058;</i>';
  }else pHcert = '';
    if (!pfname && !plname) {
      pfname = 'SharSit';
      plname = 'user';}
    if (!pfname && plname) pfname = '';
    if (pfname && !plname) plname = '';
    $('.mainsec').append('<div class="postArea '+puser+'pA" ></div>');
    for (var i = 0; i < pcont.length; i++) {
      if (postId[i].split('')[postId[i].split('').length-1] == 'y') {
        continue;
      }
      pcont[i] = pcont[i].replace(/(^|\s)(#[a-z\d-_!?]+)/ig, "$1<span class='hash_tag'>$2</span>");
      pcont[i] = pcont[i].replace(/(^|\s)(@[a-z\d-_!?]+)/ig, "$1<span class='at_sign pHin' info='$2'>$2</span>");
      $('.'+puser+'pA').prepend('<div class="Post '+puser+'PoSt" poId="'+postId[i]+'"><div class="posterInfo"><div class="PInf"><div class="Pimg"><img src="'+src+'" alt=""></div><div class="Pname pHin" info="'+p.u+'"><h1>'+pfname+' '+plname+pHcert+'</h1><p>@'+p.u+'</p></div></div><div class="postInter" iId="'+postId[i]+'"><div class="postIndex '+postId[i]+'ind"></div><i style="font-size:35px;" class="material-icons iicon">&#xe5d3;</i></div></div><div class="content">'+pcont[i].replace(/(?:\r\n|\r|\n)/g, "<br />")+'<div class="postDate"><time>'+pdate[i].replace('T','<br/>').replace('.000Z','')+'</time></div></div><div class="mediaPost '+postId[i]+'IMP"></div><div class="postAction"><div class="postLike act"><i style="font-size:30px;color:#999;display:block;" class="far w Lk" act="liking" uId='+puser+' pId="'+postId[i]+'">&#xf004;<i style="font-size:30px;color:var(--changeColor);display:block;" class="fas bl interA '+postId[i]+'IAL" id="like">&#xf004;</i></i><div class="LCC '+postId[i]+'L">'+pl[i]+'</div></div><div class="postReply act"><i style="font-size:30px;color:#999;display:block;" class="far w Rp" act="replying" uId='+puser+' pId="'+postId[i]+'">&#xf075;<i style="font-size:30px;color:#996633;display:block;" class="fas bl interA '+postId[i]+'IAR" id="reply">&#xf075;</i></i><div class="RCC '+postId[i]+'R">'+pr[i]+'</div></div><div class="postSave act"><i style="font-size:30px;color:#999;display:block;" class="fa w Sv" act="saving" uId='+puser+' pId="'+postId[i]+'">&#xf097;<i style="font-size:30px;color:#00802b;display:block;" class="fa bl interA '+postId[i]+'IAS" id="save">&#xf02e;</i></i><div class="SCC '+postId[i]+'S">0</div></div></div></div></div>');
      if (isL[i]) {
        $('.'+postId[i]+'IAL').css('opacity','1');
      }
      if (img[i]) {
        img[i] = img[i].replace('data', '||||');
        img[i] = img[i].split('||||');
        for (var j= 1; j < img[i].length ; j++) {
          if(img[i][j].slice(img[i][j].length-1, img[i][j].length) == ',') {
            img[i][j] = ':'+img[i][j].slice(1, img[i][j].length-1);
          }
          $('.'+postId[i]+'IMP').append('<div class="mediaContPost '+postId[i]+'IMPP"><img class="writePostMediapost postimg" src="data'+img[i][j]+'" alt=""></div>');
          }
      }
    }
  });

  //go to my timeline
  $('.maincont').on('click', '.timelineicon', function (e) {
    var rooM = rooms[storedUsername];
    socket.emit('goTime', {storedUsername, rooM});
    $('.blackArea3').css({'z-index':'2', 'opacity':'.4'});
  });
  socket.on('Timepostload', function (p) {
    $('.blackArea3').css({'z-index':'-2', 'opacity':'0'});
    $(".mainsec").empty();
    $('.mainsec').append('<div class="postArea '+puser+'pA" ></div>');
    $(".CusrInfo").remove();
    $(".rnav").css('background','none');
    $(".rnavCont").css('display','flex');
    var img = p.im;
    var pcont = p.p, pdate = p.d, pl = p.lk, pr = p.rp, isL = p.isLikeTimeLine, src = p.ss, srcOk;
    var pr = p.rp, postId = p.pi, puser = p.usr, plnameOk, pfname = p.ff, plname =p.ll;
    var pcert = p.cc, pcertOk, pfnameOk;
    for (var i = 0; i < pcont.length; i++) {
      if (postId[i].split('')[postId[i].split('').length-1] == 'y') {
        continue;
      }
      if (src[i] == '') {
        srcOk = 'profile.png';
      }else {
        srcOk = src[i];
      }
      if (pcert[i] == 1){ pcertOk = '<i style="font-size:24px;color:var(--changeColor);display: inline-block;padding:0 5px;position:relative; bottom:.5px;" class="fa">&#xf058;</i>';
      }else{
        pcertOk = '';}
      if (pfname[i]=='' && !plname[i]=='') {
        pfnameOk = 'SharSit';
        plnameOk = 'user';}
      if (pfname[i] =='' && plname[i] !='') {pfnameOk = ''; plnameOk = plname[i];}
      if (pfname[i] !='' && plname[i] == '') {plnameOk = ''; pfnameOk = pfname[i];}
      if (pfname[i] !='' && plname[i] !='') {plnameOk = plname[i]; pfnameOk = pfname[i]};
      pcont[i] = pcont[i].replace(/(^|\s)(#[a-z\d-_!?]+)/ig, "$1<span class='hash_tag'>$2</span>");
      pcont[i] = pcont[i].replace(/(^|\s)(@[a-z\d-_!?]+)/ig, "$1<span class='at_sign pHin' info='$2'>$2</span>");
      $('.postArea').prepend('<div class="Post '+puser[i]+'PoSt" poId="'+postId[i]+'"><div class="posterInfo"><div class="PInf"><div class="Pimg"><img src="'+srcOk+'" alt=""></div><div class="Pname pHin" info="'+puser[i]+'"><h1>'+pfnameOk+' '+plnameOk+pcertOk+'</h1><p>@'+puser[i]+'</p></div></div><div class="postInter" iId="'+postId[i]+'"><div class="postIndex '+postId[i]+'ind"></div><i style="font-size:35px;" class="material-icons iicon">&#xe5d3;</i></div></div><div class="content">'+pcont[i].replace(/(?:\r\n|\r|\n)/g, "<br />")+'<div class="postDate"><time>'+pdate[i].replace('T','<br/>').replace('.000Z','')+'</time></div></div><div class="mediaPost '+postId[i]+'IMP"></div><div class="postAction"><div class="postLike act"><i style="font-size:30px;color:#999;display:block;" class="far w Lk" act="liking" uId='+puser[i]+' pId="'+postId[i]+'">&#xf004;<i style="font-size:30px;color:var(--changeColor);display:block;" class="fas bl interA '+postId[i]+'IAL" id="like">&#xf004;</i></i><div class="LCC '+postId[i]+'L">'+pl[i]+'</div></div><div class="postReply act"><i style="font-size:30px;color:#999;display:block;" class="far w Rp" act="replying" uId='+puser[i]+' pId="'+postId[i]+'">&#xf075;<i style="font-size:30px;color:#996633;display:block;" class="fas bl interA '+postId[i]+'IAR" id="reply">&#xf075;</i></i><div class="RCC '+postId[i]+'R">'+pr[i]+'</div></div><div class="postSave act"><i style="font-size:30px;color:#999;display:block;" class="fa w Sv" act="saving" uId='+puser[i]+' pId="'+postId[i]+'">&#xf097;<i style="font-size:30px;color:#00802b;display:block;" class="fa bl interA '+postId[i]+'IAS" id="save">&#xf02e;</i></i><div class="SCC '+postId[i]+'S">0</div></div></div></div></div>');
      if (isL[i]) {
        $('.'+postId[i]+'IAL').css('opacity','1');
      }
      if (img[i]) {
        img[i] = img[i].replace('data', '||||');
        img[i] = img[i].split('||||');
        for (var j= 1; j < img[i].length ; j++) {
          if(img[i][j].slice(img[i][j].length-1, img[i][j].length) == ',') {
            img[i][j] = ':'+img[i][j].slice(1, img[i][j].length-1);
          }
          $('.'+postId[i]+'IMP').append('<div class="mediaContPost '+postId[i]+'IMPP"><img class="writePostMediapost postimg" src="data'+img[i][j]+'" alt=""></div>');
          }
      }
    }
  });

  //main page animation
  $(document).mousemove(function (e) {
    var x = -e.pageX+940;
    var y = -e.pageY+380;
    $('.sun').css('transform','translate('+x/100+'px,'+y/33+'px)');
    $('.sun2').css('transform','translate('+x/100+'px,'+y/33+'px)');
  });
  $('#Ss').mousedown(function (e) {
    var x = e.pageX-$('#Ss').offset().left ;
    var y = e.pageY-$('#Ss').offset().top;
    $("#Ssi").css({"height":"1000px","width":"1000px","opacity":"0"});
    setTimeout('$("#Ssi").css({"height":"0px","width":"0px","transition":"none"})',900);
    setTimeout('$("#Ssi").css({"opacity":"1","transition":"all .9s"})',950);
  });

  //popup
  $('.maincont').on('click', '.blackArea2', function () {
    $('.blackArea2').css({'z-index':'-2', 'opacity':'0'});
    $('.writePost').css('display','none');

  });
  $('.maincont').on('click', '.new', function () {
    $('.blackArea2').css({'z-index':'2', 'opacity':'.4'});
    $('.writePost').css('display','block')
  });

  //send post
  $('.maincont').on('click', '.sendPost', function (e) {
    if ($('.txtarea').val()) {
      var d = new Date();
      var s = d.getSeconds();
      var m = d.getMinutes();
      var h = d.getHours();
      var day = d.getDate();
      var month = d.getMonth();
      var y = d.getFullYear();
      var datetime = y+'-'+month+'-'+day+' '+h+':'+m+':'+s;
      var content = $('.txtarea').val();
      var all = $('.mediaCont img').map(function () {
        return $(this).attr('src');
      });
      socket.emit('post', {content, datetime, storedUsername, all});
      $('.blackArea3').css({'z-index':'5', 'opacity':'.4'});
    }
  });

  //getting post from server
  socket.on('post', function (post) {
    $('.blackArea3').css({'z-index':'-2', 'opacity':'0'});
    $('.txtarea').val('');
    $('.blackArea2').css({'z-index':'-2', 'opacity':'0'});
    $('.writePost').css('display','none');
    var postId = post.thisPostId, fname = post.pfname, lname = post.plname, src = post.psrc;
    var postContent = post.content, c = post.pcert;
    postContent = postContent.replace(/(^|\s)(#[a-z\d-_!?]+)/ig, "$1 <span class='"+postId+"hashTag hash_tag'>$2</span> ");
    postContent =postContent.replace(/(^|\s)(@[a-z\d-_!?]+)/ig, "$1 <span class='"+postId+"atSign at_sign pHin' info='$2'>$2</span> ");
    var postdate = post.datetime;
    var pl = post.lk;
    var img = post.image;
    if (src == '') {
      src = 'profile.png';
    }else {
      src = src;
    }
    if (c){ var pcert = '<i style="font-size:24px;color:var(--changeColor);display: inline-block;padding:0 5px;position:relative; bottom:.5px;" class="fa">&#xf058;</i>';
  }else pcert = '';
    if (!fname && !lname) {
      fname = 'SharSit';
      lname = 'user';}
    if (!fname && lname) fname = '';
    if (fname && !lname) lname = '';
    var postuserId = postId.slice(0, postId.indexOf('2'));
    $('.postArea').prepend('<div class="Post '+postId+'PoSt" poId="'+postId+'"><div class="posterInfo '+postId+'pInfo"><div class="PInf"><div class="Pimg '+postId+'pImag"><img src="'+src+'" alt=""></div><div class="Pname '+postId+'pNam pHin" info="'+post.u+'"><h1>'+fname+' '+lname+c+'</h1><p>@'+post.u+'</p></div></div><div class="postInter" iId="'+postId+'"><div class="postIndex '+postId+'ind"></div><i style="font-size:35px;" class="material-icons iicon">&#xe5d3;</i></div></div><div class="content '+postId+'pContant"></div><div class="postDate '+postId+'date"><time></time></div><div class="media '+postId+'IMP"></div><div class="postAction"><div class="postLike act"><i style="font-size:30px;color:#999;display:block;" class="far w Lk" act="liking" uId='+postuserId+' pId="'+postId+'">&#xf004;<i style="font-size:30px;color:var(--changeColor);display:block;" class="fas bl interA '+postId+'IAL" id="like" act="liking" pId="'+postId+'">&#xf004;</i></i><div class="LCC '+postId+'L">0</div></div><div class="postReply act"><i style="font-size:30px;color:#999;display:block;" class="far w Rp" act="replying" uId='+postuserId+' pId="'+postId+'">&#xf075;<i style="font-size:30px;color:#996633;display:block;" class="fas bl interA '+postId+'IAR" id="reply" act="replying" pId="'+postId+'">&#xf075;</i></i><div class="RCC '+postId+'R">0</div></div><div class="postSave act"><i style="font-size:30px;color:#999;display:block;" class="fa w Sv" act="saving" uId='+postuserId+' pId="'+postId+'">&#xf097;<i style="font-size:30px;color:#00802b;display:block;" class="fa bl interA '+postId+'IAS" id="save" act="saving" pId="'+postId+'">&#xf02e;</i></i><div class="SCC '+postId+'S">0</div></div></div></div>')
    $('.'+postId+'pContant').prepend(postContent.replace(/(?:\r\n|\r|\n)/g, "<br />"));
    $('.'+postId+'date time').html(postdate);
    if (postContent.indexOf('@') != -1) {
      var atsn = $('.'+postId+'atSign').html();
      atsn = atsn.replace('@','');
      socket.emit('callMention', {atsn, storedUsername});
    }
    if (postContent.indexOf('#') != -1) {
      var hstg = $('.'+postId+'hashTag').map(function () {
        return $(this).html();
      });
      socket.emit('HashTags', {hstg, storedUsername});
    }
    for (var i = 0; i < img.length; i++) {
      $('.'+postId+'IMP').append('<div class="mediaCont"><img class="writePostMedia postimg" src="'+img[i]+'" alt=""></div>')
    }
  });

  //call mentioned user
  socket.on('callM', function (c) {
    var atsn = c.atsn, callmy = c.callmy;
    alert(callmy+' mentioned you in a post');
  })

  //global Search
  $('.maincont').on('keyup', '#search',function () {
    var searchRes = $('#search').val().trim();
    if (searchRes.split('')[0] == '@') {
      $('#search').css('color','#999');
    }else {
      $('#search').css('color','black');
    }
    var searchRes = searchRes.replace('@','');
    $('.SRC').empty();
    if (searchRes != '') {
      socket.emit('searchRes', searchRes);
    }else {
      $('.SRC').empty();
    }
  });
  socket.on('sresult', function (s) {
    var sun = s.sun;
    var sfn = s.sfn;
    var sln = s.sln;
    var scn = s.scn, src = s.ssrc, srcOk;
    for (var i = 0; i < sun.length; i++) {
      if (sun[i] == storedUsername) {
        continue;
      }
      if (!src[i]) {
        srcOk = 'profile.png';
      }else {
        srcOk = src[i];
      }
      if ($('.'+sun[i]+'').length == 0) {
        if (!sfn[i] && !sln[i]) {
          sfn[i] = 'SharSit';
          sln[i] = 'user'
        }
        if (!sfn[i] && sln[i]) sfn[i] = '';
        if (sfn[i] && !sln[i]) sln[i] = '';
        var head = sfn[i]+sln[i];
        if (head.split('').length > 11) {
          sln[i] = sln[i].slice(0, 5) + '...';
        }
        $('.SRC').append('<div class="SRes '+sun[i]+'" SResId = '+sun[i]+'><div class="Uimg '+sun[i]+'SRimg"><img src="'+srcOk+'" alt=""></div><div class="Uname '+sun[i]+'Un" info="'+sun[i]+'"><h1 class="'+sun[i]+'un">'+sfn[i]+' '+sln[i]+'</h1><p>@'+sun[i]+'</p></div></div>')
        if (scn[i] == 1) {
          $('.'+sun[i]+'un').append('<i style="font-size:24px;color:var(--changeColor);display: inline-block;padding:0 5px;position:relative; bottom:.5px;" class="fa">&#xf058;</i>')
        }
      }
    }
  });

  //choose a user
  $(".maincont"). on('click', '.SRes', function (e) {
    var sResUser = $(this).attr('SResId');
    if (!rooms[storedUsername]) {
      console.log('ok');
    }else {
      usrroom = []
      socket.emit('leave', rooms[storedUsername]);
      delete rooms[storedUsername];
    }
    socket.emit('selectedusr', {sResUser, storedUsername});
    $('.blackArea3').css({'z-index':'2', 'opacity':'.4'});
  });

  //getting choosen user result
  socket.on('suresult', function (res) {
    $(".CusrInfo").remove();
    usrroom.push(res.u)
    rooms[storedUsername] = usrroom;
    var chUser = res.u; var chFname = res.f;
    var chLname = res.l; var chBio = res.b;
    var chCert = res.c; var chFlr = res.fr;
    var chFlg = res.fg; var loc = res.loc, src = res.s;
    if(!chBio) chBio = '';
    if (src == '') {
      src = 'profile.png';
    }
    if (!chFname && !chLname) {
      chFname = 'SharSit';
      chLname = 'user'
    }
    if (!chFname && chLname) chFname = '';
    if (chFname && !chLname) chLname = '';
    if (chCert == 1) {
      chCert = '<i style="font-size:24px;color:var(--changeColor);display: inline-block;padding:0 5px;position:relative; bottom:.5px;" class="fa">&#xf058;</i>';
    }else {chCert = ''}
    $(".rnavCont").css('display','none');
    $(".rnav").css('background-color','#f6f6f6');
    $('.rnav').append('<div class="acInfo '+chUser+'Ainfo"><div class="CusrInfo"><h1 class="Cacuser" info="'+chUser+'">'+chFname+' '+chLname+chCert+'</h1><h3 class="Cacuser" id="cacuser">@'+chUser+'</h3><h5 style="color:#999" class="Cacuser"><i style="font-size:14px;color:#999" class="fa">&#xf041;</i> '+loc+'</h5></div><div class="CusrInfo"><span>Bio</span><p class="biocontent">'+chBio+'</p></div><div class="CusrInfo flw"><div class="flwr"><span id="followers'+chUser+'">'+chFlr+'</span><br><span>Follower</span></div><div class="flwg" id="followings'+chUser+'"><span id="followings">'+chFlg+'</span><br><span>following</span></div></div><div class="CusrInfo"><button class="FollowB '+chUser+'fL" flId = "'+chUser+'fL" type="button" name="button">Follow</button></div></div></div>')
    if (res.myflg) {
      $("."+chUser+"fL").css({'background-color':'#f6f6f6', 'border':'solid var(--changeColor)', 'color':'var(--changeColor)'});
      $("."+chUser+"fL").html('Following');
    }else {
      $("."+chUser+"fL").css({'background-color':'var(--changeColor)', 'border':'none', 'color':'white'});
      $("."+chUser+"fL").html('Follow');
    }
  });

  //getting choosen user posts
  socket.on('Cpostload', function (res) {
    $('.mainsec').empty();
    var img = res.im;
    var cpContent = res.p, pl = res.lk, pr = res.rp, src = res.s;
    var cpDate = res.d, postId = res.pi, isL = res.isLikeSUsr;
    $('.mainsec').append('<div class="postArea '+res.su+'pA" ></div>');
    if (res.c){ var cpCert = '<i style="font-size:24px;color:var(--changeColor);display: inline-block;padding:0 5px;position:relative; bottom:.5px;" class="fa">&#xf058;</i>';
  }else cpCert = '';
    if (!src) {
      src = 'profile.png';
    }
    if (!res.f && !res.l) {
      res.f = 'SharSit';
      res.l = 'user';}
    if (!res.f && res.l) res.f = '';
    if (res.f && !res.l) res.l = '';
    for (var i = 0; i < cpContent.length; i++) {
      if (postId[i].split('')[postId[i].split('').length-1] == 'y') {
        continue;
      }
      cpContent[i] =cpContent[i].replace(/(^|\s)(#[a-z\d-_!?]+)/ig, "$1<span class='hash_tag'>$2</span>");
      cpContent[i] =cpContent[i].replace(/(^|\s)(@[a-z\d-_!?]+)/ig, "$1<span class='at_sign pHin' info='$2'>$2</span>");
      $('.'+res.su+'pA').prepend('<div class="Post '+res.su+'PoSt" poId="'+postId[i]+'"><div class="posterInfo"><div class="PInf"><div class="Pimg"><img src="'+src+'" alt=""></div><div class="Pname pHin" info="'+res.su+'"><h1>'+res.f+' '+res.l+cpCert+'</h1><p>@'+res.su+'</p></div></div><div class="postInter" iId="'+postId[i]+'"><div class="postIndex '+postId[i]+'ind"></div><i style="font-size:35px;" class="material-icons iicon">&#xe5d3;</i></div></div><div class="content">'+cpContent[i].replace(/(?:\r\n|\r|\n)/g, "<br />")+'<div class="postDate"><time>'+cpDate[i].replace('T','<br/>').replace('.000Z','')+'</time></div></div><div class="mediaPost '+postId[i]+'IMP"></div><div class="postAction"><div class="postLike act"><i style="font-size:30px;color:#999;display:block;" class="far w Lk" act="liking" uId='+res.su+' pId="'+postId[i]+'">&#xf004;<i style="font-size:30px;color:var(--changeColor);display:block;" class="fas bl interA '+postId[i]+'IAL" id="like">&#xf004;</i></i><div class="LCC '+postId[i]+'L">'+pl[i]+'</div></div><div class="postReply act"><i style="font-size:30px;color:#999;display:block;" class="far w Rp" act="replying" uId='+res.su+' pId="'+postId[i]+'">&#xf075;<i style="font-size:30px;color:#996633;display:block;" class="fas bl interA '+postId[i]+'IAR" id="reply">&#xf075;</i></i><div class="RCC '+postId[i]+'R">'+pr[i]+'</div></div><div class="postSave act"><i style="font-size:30px;color:#999;display:block;" class="fa w Sv" act="saving" uId='+res.su+' pId="'+postId[i]+'">&#xf097;<i style="font-size:30px;color:#00802b;display:block;" class="fa bl interA '+postId[i]+'IAS" id="save">&#xf02e;</i></i><div class="SCC '+postId[i]+'S">0</div></div></div></div></div>');
      if (isL[i]) {
        $('.'+postId[i]+'IAL').css('opacity','1');
      }
      if (img[i]) {
        img[i] = img[i].replace('data', '||||');
        img[i] = img[i].split('||||');
        for (var j= 1; j < img[i].length ; j++) {
          if(img[i][j].slice(img[i][j].length-1, img[i][j].length) == ',') {
            img[i][j] = ':'+img[i][j].slice(1, img[i][j].length-1);
          }
          $('.'+postId[i]+'IMP').append('<div class="mediaContPost '+postId[i]+'IMPP"><img class="writePostMediapost postimg" src="data'+img[i][j]+'" alt=""></div>');
          }
      }
    }
    $('.blackArea3').css({'z-index':'-2', 'opacity':'0'});
  });

  $('.maincont').on('focus', '#search',function () {
    $("#search").css({'width': '100%','border-bottom-right-radius':'0px','border-bottom-left-radius':'0px'});
    $(".SResC").css({'height':'70%','width':'90%'});
    $(".SRC").css('display','block');
  });
  $('.maincont').on('blur', '#search',function () {
    setTimeout(function () {
    $("#search").css({'width': '90%','border-bottom-right-radius':'10px','border-bottom-left-radius':'10px'});
    $(".SResC").css({'height':'0%','width':'81%'});
    $(".SRC").css('display','none');
    $("#search").val('');
    $('.SRC').empty();
  },500)
  });

  //follow handle
  $(".maincont").on('click', '.FollowB', function () {
    var userFA = $(this).attr('flId');
    userFA = userFA.replace('fL', '');
    if ($(".FollowB").html() == 'Follow') {
      socket.emit('flw', {userFA, storedUsername});
    }else {
      socket.emit('unflw', {userFA, storedUsername});
    }
  });
  $(".maincont").on('mouseover', '.FollowB', function () {
    if ($(".FollowB").html() != 'Follow') {
      $(".FollowB").html('Unfollow')
      $(".FollowB").css({'border':'solid #c60021','background-color':'#c60021', 'color':'white'})
    }
  });
  $(".maincont").on('mouseout', '.FollowB', function () {
    if ($(".FollowB").html() == 'Unfollow') {
      $(".FollowB").html('Following');
      $(".FollowB").css({'border':'solid var(--changeColor)', 'background-color':'#f6f6f6', 'color':'var(--changeColor)'})
    }
  });
  //following result
  socket.on('flwSuc', function (fu) {
    $(".FollowB").css({'background-color':'#f6f6f6','border':'solid var(--changeColor)', 'color':'var(--changeColor)'});
    $(".FollowB").html('Following');
    var what1 = $('#followers'+fu+'').html();
    var what2 = $('#followers'+storedUsername+'').html();
    $('#followers'+fu+'').html(+what1 + 1);
    $('#followings'+storedUsername+'').html(+what2 + 1);
  });
  //Unfollowing result
  socket.on('unflwSuc', function (fu) {
    $(".FollowB").css({'background-color':' var(--changeColor)', 'border':'none', 'color':'white'});
    $(".FollowB").html('Follow');
    var what1 = $('#followers'+fu+'').html();
    var what2 = $('#followers'+storedUsername+'').html();
    $('#followers'+fu+'').html(+what1 - 1);
    $('#followings'+storedUsername+'').html(+what2 - 1);
  });

  //follow notif
  socket.on('followYou',function (fu) {
    alert(fu+' Followed You Right Now!');
  })

  //control panel opening
  var ex = 0;
  $('.maincont').on('click', '.fa', function () {
    if (ex == 0) {
      $('.controlnav').css({'box-shadow': '0px 0px 40px rgba(0, 0, 0, .1)','transform': 'translate(0%, -50%) translateZ(1px)','width':' 880%'})
      ex = 1;
    }else {
      $('.controlnav').css({'box-shadow': '0px 0px 20px rgba(0, 0, 0, .5)','transform': 'translate(0%, -50%)','width':' 70%'})
      ex = 0;
    }
    });

  //menu opening
  $('.maincont').on('click', '#menuicon', function () {
    ex = 0;
    $('.menu').css('display','flex');
    $('.blackArea').css({'z-index':'2', 'opacity':'.4'});
    $('.controlnav').css({'box-shadow': '4px 4px 20px rgba(0, 0, 0, .5)','transform': 'translate(0%, -50%)','width':' 70%'});
    $('.profCont').css({'opacity':'1','transform': 'translate(-50%, -50%) translateZ(0px)'});
    setTimeout("$('.bioSec').css({'opacity':'1','transform': 'translateZ(0px)'})",100);
    setTimeout("$('.flw').css({'opacity':'1','transform': 'translateZ(0px)'})",200);
    setTimeout("$('.controlnav').css({'opacity':'1','transform': 'translate(0%, -50%) translateZ(0px)'})",300);
  });
  $('.maincont').on('click', '.blackArea', function () {
    $('.controlnav').css({'box-shadow': '4px 4px 20px rgba(0, 0, 0, .5)','transform': 'translate(0%, -50%)','width':' 70%'});
    $('.profCont').css({'opacity':'0','transform': 'translate(-50%, -50%) translateZ(1.5px)'});
    setTimeout("$('.bioSec').css({'opacity':'0','transform': 'translateZ(1.5px)'})",100);
    setTimeout("$('.flw').css({'opacity':'0','transform': 'translateZ(1.5px)'})",200);
    setTimeout(function () {
      $('.blackArea').css({'opacity':'0'});
      $('.controlnav').css({'opacity':'0','transform': 'translate(0%, -50%) translateZ(1.5px)'})
    },300);
    setTimeout(function () {
      $('.menu').css('display','none');
      $('.blackArea').css({'z-index':'-2'});
    },700)
  });

  $(".maincont").on('mousemove', '.pHin, .asyncInfo', function (e) {
    var uinf = $(this).attr('info');
    if (uinf.indexOf('@') != -1) {
      uinf = uinf.replace('@','');
    }
    socket.emit('AS', uinf);
    var x = e.pageX;
    var y = e.pageY;
    $('.asyncInfo').css({'top':y+30,'left':x+20})

  });
  socket.on('ASr', function (asr) {
    var u = asr.user; var fn = asr.fnam;
    var ln= asr.lnam; var c = asr.cert;
    var loc = asr.loc; var bio = asr.bio;
    var fr = asr.flwr; var fg = asr.flwg, src = asr.src;
    var f,l;
    if (src == '') {
      src = 'profile.png'
    }else {
      src = src;
    }
    if(!bio) bio = '';
    if (!fn && !ln) {
      f = 'SharSit';
      l = 'user'
    }
    else if (!fn && ln) f = '';
    else if (fn && !ln) l = '';
    else{l = ln; f = fn;}
    if (c == 1) {
      c = '<i style="font-size:24px;color:var(--changeColor);display: inline-block;padding:0 5px;position:relative; bottom:.5px;" class="fa">&#xf058;</i>';
    }else {c = ''}
    if ($('.asyncInfo').length == 0) {
      $('body').append('<div class="asyncInfo '+u+'AS"><div class="Anm"><div class="Aimg"><img src="'+src+'" alt=""></div><div class="Aname"><h1 class="un">'+f+' '+l+' '+c+'</h1><p>@'+u+'</p><p><i style="font-size:17px;color:#999;margin-left:3px;" class="fa">&#xf041;</i> '+loc+'</p></div><div class="Abio"><p>'+bio+'</p></div><div class="Aflw"><div class="Aflr"><p class="">'+fr+'</p><p>Followers</p></div><div class="Aflg"><p class="">'+fg+'</p><p>Followings</p></div></div></div></div>');
    }

  });
  $(".maincont").on('mouseout', '.pHin, .asyncInfo', function (e) {
      $('.asyncInfo').remove();
  });

  //go to user if name clicked
  $(".maincont").on('click', '.pHin, .asyncInfo', function (event) {
    event.stopPropagation();
    $(".CusrInfo").remove();
    var sResUser = $(this).attr('info');
    if (sResUser.indexOf('@') != -1) {
      sResUser = sResUser.replace('@','');
    }
    if (!rooms[storedUsername]) {
      console.log('ok');
    }else {
      usrroom = []
      socket.emit('leave', rooms[storedUsername]);
      delete rooms[storedUsername];
    }
    socket.emit('selectedusr', {sResUser, storedUsername});

  });

  //handle post action
  $(".maincont").on('click', '.w', function (event) {
    event.stopPropagation();
    var act = $(this).attr('act');
    var pId = $(this).attr('pId');
    var uId = $(this).attr('uId');
    if (act == 'liking') {
      if ($('.'+pId+'IAL').css('opacity') == 0) {
        socket.emit('like', {pId, uId, storedUsername});
      }else {
        socket.emit('unlike', {pId, uId, storedUsername});
      }
    }
    if (act == 'replying') {
      if ($('.writeReply').length == 0) {
        $('.mainsec').append('<div class="writeReply"><div class="writeReply_input"><textarea class="replyText" id="replyText" rows="1" cols="80"></textarea><button class="sendReply" uId="'+uId+'" pId="'+pId+'" type="button">Send!</button></div><div class="closeReply"><p class="CR">&times</p></div></div>')
      }
    }
  });
  socket.on('liked', function (res) {
    $('.'+res.pId+'IAL').css({'opacity':'1'});
  });
  socket.on('likedN', function (res) {
    var l = $('.'+res.pId+'L').html();
    l = +l+1;
    $('.'+res.pId+'L').html(l);
  });

  //post unlike handle
  socket.on('unliked', function (res) {
    $('.'+res.pId+'IAL').css({'opacity':'0'});
  });
  socket.on('unlikedN', function (res) {
    var l = $('.'+res.pId+'L').html();
    l = +l-1;
    l = $('.'+res.pId+'L').html(l);

  });


  //send reply
  $('.maincont').on('click', '.sendReply', function (e) {
    var pId = $(this).attr('pId'), uId = $(this).attr('uId');
    var d = new Date(), s = d.getSeconds(), m = d.getMinutes(), h = d.getHours(), day = d.getDate(), month = d.getMonth(), y = d.getFullYear();
    var datetime = y+'-'+month+'-'+day+' '+h+':'+m+':'+s, content = $('.replyText').val();
    socket.emit('reply', {content, datetime, storedUsername, uId, pId});
  });
  socket.on('reply', function (post) {
    $('.closeReply').trigger('click');
    var postId = post.thisReplyId;
    var postContent = post.rcont, src = post.s;
    postContent = postContent.replace(/(^|\s)(#[a-z\d-_!?]+)/ig, "$1<span class='hash_tag'>$2</span>");
    postContent =postContent.replace(/(^|\s)(@[a-z\d-_!?]+)/ig, "$1<span class='at_sign pHin' info='$2'>$2</span>");
    var postdate = post.rdate;
    if (post.c){ var cpCert = '<i style="font-size:24px;color:var(--changeColor);display: inline-block;padding:0 5px;position:relative; bottom:.5px;" class="fa">&#xf058;</i>';
    }else cpCert = '';
    if (!src) {
      src = 'profile.png';
    }else {
      src = src;
    }
    if (!post.f && !post.l) {
      post.f = 'SharSit';
      post.l = 'user';}
    else if (!post.f && post.l) post.f = '';
    else if (post.f && !post.l) post.l = '';
    var postuserId = postId.slice(0, postId.indexOf('2'));
    $('.postArea').prepend('<div class="Post '+postId+'PoSt" poId="'+postId+'"><div class="posterInfo '+postId+'pInfo"><div class="PInf"><div class="Pimg '+postId+'pImag"><img src="'+src+'" alt=""></div><div class="Pname '+postId+'pNam pHin" info="'+post.replier+'"><h1>'+post.f+' '+post.l+cpCert+'</h1><p>@'+post.replier+' replying to '+post.uId+'</p></div></div><div class="postInter" iId="'+postId+'"><div class="postIndex '+postId+'ind"></div><i style="font-size:35px;" class="material-icons iicon">&#xe5d3;</i></div></div><div class="content '+postId+'pContant"><div class="postDate '+postId+'date"><time></time></div></div><div class="postAction"><div class="postLike act"><i style="font-size:30px;color:#999;display:block;" class="far w Lk" act="liking" uId='+postuserId+' pId="'+postId+'">&#xf004;<i style="font-size:30px;color:var(--changeColor);display:block;" class="fas bl interA '+postId+'IAL" act="liking" pId="'+postId+'">&#xf004;</i></i><div class="LCC '+postId+'L">0</div></div><div class="postReply act"><i style="font-size:30px;color:#999;display:block;" class="far w Rp" act="replying" uId='+postuserId+' pId="'+postId+'">&#xf075;<i style="font-size:30px;color:#996633;display:block;" class="fas bl interA '+postId+'IAR" act="replying" pId="'+postId+'">&#xf075;</i></i><div class="RCC '+postId+'R">0</div></div><div class="postSave act"><i style="font-size:30px;color:#999;display:block;" class="fa w Sv" act="saving" uId='+postuserId+' pId="'+postId+'">&#xf097;<i style="font-size:30px;color:#00802b;display:block;" class="fa bl interA '+postId+'IAS" act="saving" pId="'+postId+'">&#xf02e;</i></i><div class="SCC '+postId+'S">0</div></div></div></div>')
    $('.'+postId+'pContant').prepend(postContent.replace(/(?:\r\n|\r|\n)/g, "<br />"));
    $('.'+postId+'date').html(postdate);
  });

  $('.maincont').on('click', '.closeReply', function (e) {
    $('.writeReply').remove();
  });


  $('.maincont').on('click', '.Post', function(event) {
    var poId = $(this).attr('poId');
    event.stopPropagation();
    //var poCo = $('.content').val();
    //alert(poCo)
    //$('.mainsec').empty();
    socket.emit('clickedPost', {poId, storedUsername});
  });
  socket.on('ClPsRes', function (rep) {
    $('.postArea').empty();
    var pI = rep.postId, uI = rep.userId, rfname = rep.fknga, rlname= rep.lknga, rcert = rep.crtfca;
    var rcont = rep.mpcontent, rl = rep.mplike, rr = rep.mpreply, rdate = rep.mpdatetime, rsrc = rep.rsrca;
    if (!rsrc) {
      rsrc = 'profile.png';
    }else {
      rsrc = rsrc;
    }
    if (rcert == 1){ rcert = '<i style="font-size:24px;color:var(--changeColor);display: inline-block;padding:0 5px;position:relative; bottom:.5px;" class="fa">&#xf058;</i>';
    }else{
      rcert = '';}
    if (!rfname=='' && !rlname=='') {
      rname = 'SharSit';
      rlname = 'user';}
    else if (rfname =='' && rlname !='') {rfname = ''; rlname = rlname;}
    else if (rfname !='' && rlname == '') {rlname = ''; rfname = rfname;}
    rcont = rcont.replace(/(^|\s)(#[a-z\d-_!?]+)/ig, "$1<span class='hash_tag'>$2</span>");
    rcont =rcont.replace(/(^|\s)(@[a-z\d-_!?]+)/ig, "$1<span class='at_sign pHin' info='$2'>$2</span>");
    $('.postArea').prepend('<div class="Post '+pI+'PoSt" poId="'+pI+'"><div class="posterInfo"><div class="PInf"><div class="Pimg"><img src="'+rsrc+'" alt=""></div><div class="Pname pHin" info="'+uI+'"><h1>'+rfname+' '+rlname+rcert+'</h1><p>@'+uI+'</p></div></div><div class="postInter" iId="'+pId+'"><div class="postIndex '+pId+'ind"></div><i style="font-size:35px;" class="material-icons iicon">&#xe5d3;</i></div></div><div class="content">'+rcont.replace(/(?:\r\n|\r|\n)/g, "<br />")+'<div class="postDate"><time>'+rdate.replace('T','<br/>').replace('.000Z','')+'</time></div><div class="postAction"><div class="postLike act"><i style="font-size:30px;color:#999;display:block;" class="far w Lk" act="liking" uId='+uI+' pId="'+pI+'">&#xf004;<i style="font-size:30px;color:var(--changeColor);display:block;" class="fas bl interA '+pI+'IAL" id="like">&#xf004;</i></i><div class="LCC '+pI+'L">'+rl+'</div></div><div class="postReply act"><i style="font-size:30px;color:#999;display:block;" class="far w Rp" act="replying" uId='+uI+' pId="'+pI+'">&#xf075;<i style="font-size:30px;color:#996633;display:block;" class="fas bl interA '+pI+'IAR" id="reply">&#xf075;</i></i><div class="RCC '+pI+'R">0</div></div><div class="postSave act"><i style="font-size:30px;color:#999;display:block;" class="fa w Sv" act="saving" uId='+uI+' pId="'+pI+'">&#xf097;<i style="font-size:30px;color:#00802b;display:block;" class="fa bl interA '+pI+'IAS" id="save">&#xf02e;</i></i><div class="SCC '+pI+'S">0</div></div></div></div></div>');
    var postId = rep.replyId; var pcert = rep.replyt;
    var pcont = rep.replyC; var pfname = rep.replyf;
    var plname = rep.replyl; var isL = '';
    var puser = rep.replier; var pr = rep.replyR, pcertOk, pfnameOk, plnameOk;
    var pdate = rep.replyD, psrc = rep.replyS, psrcOk;
    var pl = rep.replyL;
    for (var i = 0; i < pcont.length; i++) {
      if (psrc[i] == '') {
        psrcOk = 'profile.png';
      }else {
        psrcOk = psrc[i];
      }
    pcont[i] = pcont[i].replace(/(^|\s)(#[a-z\d-_!?]+)/ig, "$1<span class='hash_tag'>$2</span>");
    pcont[i] =pcont[i].replace(/(^|\s)(@[a-z\d-_!?]+)/ig, "$1<span class='at_sign pHin' info='$2'>$2</span>");
      if (pcert[i] == 1){ pcertOk = '<i style="font-size:24px;color:var(--changeColor);display: inline-block;padding:0 5px;position:relative; bottom:.5px;" class="fa">&#xf058;</i>';
      }else{
        pcertOk = '';}
      if (pfname[i]=='' && !plname[i]=='') {
        pfnameOk = 'SharSit';
        plnameOk = 'user';}
      if (pfname[i] =='' && plname[i] !='') {pfnameOk = ''; plnameOk = plname[i];}
      if (pfname[i] !='' && plname[i] == '') {plnameOk = ''; pfnameOk = pfname[i];}
      if (pfname[i] !='' && plname[i] !='') {plnameOk = plname[i]; pfnameOk = pfname[i]};
      $('.postArea').append('<div class="Post '+puser[i]+'PoSt" poId="'+postId[i]+'"><div class="posterInfo"><div class="PInf"><div class="Pimg"><img src="'+psrcOk+'" alt=""></div><div class="Pname pHin" info="'+puser[i]+'"><h1>'+pfnameOk+' '+plnameOk+pcertOk+'</h1><p>@'+puser[i]+'<br>Replying to <b style="color: var(--changeColor); " class="replyTo">@'+uI+'</b></p></div></div><div class="postInter" iId="'+postId[i]+'"><div class="postIndex '+postId[i]+'ind"></div><i style="font-size:35px;" class="material-icons iicon">&#xe5d3;</i></div></div><div class="content">'+pcont[i].replace(/(?:\r\n|\r|\n)/g, "<br />")+'<div class="postDate"><time>'+pdate[i].replace('T','<br/>').replace('.000Z','')+'</time></div><div class="postAction"><div class="postLike act"><i style="font-size:30px;color:#999;display:block;" class="far w Lk" act="liking" uId='+puser[i]+' pId="'+postId[i]+'">&#xf004;<i style="font-size:30px;color:var(--changeColor);display:block;" class="fas bl interA '+postId[i]+'IAL" id="like">&#xf004;</i></i><div class="LCC '+postId[i]+'L">'+pl[i]+'</div></div><div class="postReply act"><i style="font-size:30px;color:#999;display:block;" class="far w Rp" act="replying" uId='+puser[i]+' pId="'+postId[i]+'">&#xf075;<i style="font-size:30px;color:#996633;display:block;" class="fas bl interA '+postId[i]+'IAR" id="reply">&#xf075;</i></i><div class="RCC '+postId[i]+'R">0</div></div><div class="postSave act"><i style="font-size:30px;color:#999;display:block;" class="fa w Sv" act="saving" uId='+puser[i]+' pId="'+postId[i]+'">&#xf097;<i style="font-size:30px;color:#00802b;display:block;" class="fa bl interA '+postId[i]+'IAS" id="save">&#xf02e;</i></i><div class="SCC '+postId[i]+'S">0</div></div></div></div></div>');
      if (isL[i]) {
        $('.'+postId[i]+'IAL').css('opacity','1');
      }
    }
  })

  $('.maincont').on('input paste', '.txtarea', function (e) {
    var text = $(this).val();
    $('.postCon').text(text);
    var h = $('.postCon').height();
    $(this).height(h);
  });

  //get profile pic
  $('.maincont').on('change', '.file', function (e) {
    if ($('.mediaCont').length <= 3) {
      var data = e.target.files[0];
      readThenSendFile(data);
    }
  });
  function readThenSendFile(data){

    var reader = new FileReader();
    reader.onload = function(evt){
      var file = evt.target.result;
      socket.emit('postPic', file);
    };
    reader.readAsDataURL(data);
  }
  socket.on('postPic',function (file) {
    console.log(file);
    if (file[5] == 'i') {
      $(".media").append('<div class="mediaCont"><div class="delPic">&times</div><img class="writePostMedia postimg" src="'+file+'" alt=""></div>')
    }
    if (file[5] == 'a') {
      if (file[file.indexOf('/')+1] == 'm') {
        $(".media").append('<div class="mediaCont"><div class="delPic">&times</div><audio controls><source src="'+file+'" type="audio/mp3">Your browser does not support the audio element.</audio> </div>')
      }
    }
    if (file[5] == 'v') {
      if (file[file.indexOf('/')+2] == 'p') {
        $(".media").append('<div class="mediaCont"><div class="delPic">&times</div><video controls><source class="writePostMedia postimg" src="'+file+'" type="video/mp4">Your browser does not support the video element.</video> </div>')
      }
      if (file[file.indexOf('/')+2] == 'k') {
        $(".media").append('<div class="mediaCont"><div class="delPic">&times</div><video controls><source class="writePostMedia postimg" src="'+file+'" type="video/mkv">Your browser does not support the video element.</video> </div>')
      }
      if (file[file.indexOf('/')+2] == 'e') {
        $(".media").append('<div class="mediaCont"><div class="delPic">&times</div><video controls><source class="writePostMedia postimg" src="'+file+'" type="video/webm">Your browser does not support the video element.</video> </div>')
      }
    }
  })
  $('.maincont').on('click', '.delPic', function (event) {
    $(this).parent().remove()
  });

  socket.on('trnd', function (t) {
    $('.Tcont').empty();
    var hash = t.hash, num = t.num;
    for (var i = 0; i < hash.length; i++) {
      $('.Tcont').append('<div class="hash"><h2>'+hash[i]+'</h2><p>'+num[i]+' posts</p></div>')
    }
  });
  socket.on('trnd1', function (t) {
    if ($('.hash').length == 0) {
      $('.Tcont').append('<div class="CS CST">There is no Trend for you!</div>');
    }else {
      $('.CST').remove();
    }
    $('.Tcont').empty();
    var hash = t.hash1, num = t.num1;
    for (var i = 0; i < hash.length; i++) {
      $('.Tcont').append('<div class="hash"><h2>'+hash[i]+'</h2><p>'+num[i]+' posts</p></div>')
    }
  });

  $('.maincont').on('click', '.postInter', function (event) {
    event.stopPropagation();
    var iid = $(this).attr('iId');
    $('.'+iid+'ind').css('display', 'flex');
    $('.blackArea4').css({'z-index':'2', 'opacity':'.4'});
    var u = iid.slice(0, iid.indexOf('2'));
    if (u == storedUsername) {
      //socket.emit('deletePost', {storedUsername, iid})
    }

  });
  $('.maincont').on('click', '.blackArea4', function () {
    $('.blackArea4').css({'z-index':'-2', 'opacity':'0'});
    $('.postIndex').css('display', 'none');

  });
  socket.on('deletedPost',function (del) {
    $('.Post[poid='+del.pId+']').remove();
  })





});

//😊
/**/
