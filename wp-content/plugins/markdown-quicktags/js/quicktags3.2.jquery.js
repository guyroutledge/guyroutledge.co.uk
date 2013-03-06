(function($){
    if(!$.mdqt){
        $.mdqt = new Object();
    }
        var edButtons = new Array(),
        edLinks = new Array(),
        edOpenTags = new Array(),
        now = new Date(),
        datetime,
        snapshots = new Array(),
        snapshotsFwd = new Array(),
        tabsize,
        snaptimer, snaptimeout, undoing = false;
    $.mdqt.quicktags = function(el, options) {
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;
        
        // Access to $ and DOM versions of element
        base.$el = $(el);
        base.el = el;
        
        // Add a reverse reference to the DOM object
        base.$el.data("mdqt.quicktags", base);
        
        
        function edButton(f, e, c, b, a, g, d) {
            this.id = f;
            this.display = e;
            this.tagStart = c;
            this.tagEnd = b;
            this.access = a;
            this.title = g;
            this.open = d;
        }
        function zeroise(b, a) {
            var c = b.toString();
            if (b < 0) {
                c = c.substr(1, c.length);
            }
            while (c.length < a) {
                c = "0" + c;
            }
            if (b < 0) {
                c = "-" + c;
            }
            return c;
        }
        datetime = now.getUTCFullYear() + "-" + zeroise(now.getUTCMonth() + 1, 2) + "-" + zeroise(now.getUTCDate(), 2) + "T" + zeroise(now.getUTCHours(), 2) + ":" + zeroise(now.getUTCMinutes(), 2) + ":" + zeroise(now.getUTCSeconds(), 2) + "+00:00";
        edButtons[edButtons.length] = new edButton("ed_pasteref", "&darr;]:", "[", "]: ", "p","Transform pasted urls into references");
        edButtons[edButtons.length] = new edButton("ed_reflink", "][ ]", "[", "][]", "r","Insert Reference link");
        edButtons[edButtons.length] = new edButton("ed_link", "]( )", "[", "]()", "l","Insert Inline link");
        edButtons[edButtons.length] = new edButton("ed_strong", "b", "**", "**", "b","Bold/Strong");
        edButtons[edButtons.length] = new edButton("ed_em", "i", "*", "*", "i","Italics/Em");
        edButtons[edButtons.length] = new edButton("ed_block", "&ldquo;", "> ", "", "q","Block Quote");
        edButtons[edButtons.length] = new edButton("ed_del", "del", '<del datetime="' + datetime + '">', "</del>", "d","<del> tag with date/time");
        edButtons[edButtons.length] = new edButton("ed_ins", "ins", '<ins datetime="' + datetime + '">', "</ins>", "s","<ins> tag with date/time");
        edButtons[edButtons.length] = new edButton("ed_img", "img", "", "", "m", "Insert inline image", -1);
        edButtons[edButtons.length] = new edButton("ed_ul", "&bull;", "* ", "", "u", "Create/Convert unordered list");
        edButtons[edButtons.length] = new edButton("ed_ol", "1.", "1. ", "", "o", "Create/Convert ordered list");
        edButtons[edButtons.length] = new edButton("ed_hr", "&mdash;", "- - -\n", "", "h", "Insert a horizontal rule");
        edButtons[edButtons.length] = new edButton("ed_code", "</>", "`", "`", "c", "Insert a code span");
        edButtons[edButtons.length] = new edButton("ed_more", "more", "<!--more-->", "", "t","WordPress page break", -1);
        function edShowButton(b, a) {
            if (b.id == "ed_img") {
                $('#ed_button_container').append('<input type="button" title="' + b.title + '" id="' + b.id + '" accesskey="' + b.access + '" class="ed_button" onclick="jQuery(this).edInsertImage(edCanvas);" value="' + b.display + '" />');
            } else {
                if (b.id == "ed_link") {
                  $('#ed_button_container').append('<input type="button" title="' + b.title + '" id="' + b.id + '" accesskey="' + b.access + '" class="ed_button" onclick="jQuery(this).edInsertLink(edCanvas, ' + a + ');" value="' + b.display + '" />');
                } else if (b.id == "ed_reflink") {
                  $('#ed_button_container').append('<input type="button" title="' + b.title + '" id="' + b.id + '" accesskey="' + b.access + '" class="ed_button" onclick="jQuery(this).edInsertRefLink(edCanvas, ' + a + ');" value="' + b.display + '" />');
                } else if (b.id == "ed_ref") {
                  $('#ed_button_container').append('<input type="button" title="' + b.title + '" id="' + b.id + '" accesskey="' + b.access + '" class="ed_button" onclick="jQuery(this).edInsertRef(edCanvas, ' + a + ');" value="' + b.display + '" />');
                } else if (b.id == "ed_ul" || b.id == "ed_ol") {
                  $('#ed_button_container').append('<input type="button" title="' + b.title + '" id="' + b.id + '" accesskey="' + b.access + '" class="ed_button" onclick="jQuery(this).edMakeList(edCanvas, ' + a + ', \'' + b.id.replace(/ed_(.)l/,"$1") + '\','+tabsize+');" value="' + b.display + '" />');
                } else if (b.id == "ed_pasteref") {
                  $('#ed_button_container').append('<input type="button" title="' + b.title + '" id="' + b.id + '" accesskey="' + b.access + '" class="ed_button" onclick="jQuery(this).edPasteRefs(edCanvas, ' + a + ');" value="' + b.display + '" />');
                } else {
                $('#ed_button_container').append('<input type="button" title="' + b.title + '" id="' + b.id + '" accesskey="' + b.access + '" class="ed_button" onclick="jQuery(this).edInsertTag(edCanvas, ' + a + ');" value="' + b.display + '"  />');
              }
            }
        }


        
        
        base.init = function(){
          if (options.tabsize)
            tabsize = options.tabsize;
          $('<div id="mdqt_loader" />').appendTo($('.postarea')).fadeIn('fast');
          $content = base.$el;          
          content = base.el;
          for (var a = 0; a < edButtons.length; a++) {
              edShowButton(edButtons[a], a);
          }

          $('<div id="preview" />').css({'height': $('div.postarea').height() - 110,'overflow':'auto','display':'none'}).appendTo($('#editorcontainer'));

          $('<div id="utils" />').append($('<a href="#">Markdownify</a>').click(function(e){
            e.preventDefault();
            $this = $(this);
            $this.takeSnapshot($content.val(),$this.getSelorCaret(content));
            if ($this.text() == 'Markdownify') {
              $('#mdqt_loader').fadeIn('fast');
              $.post(ajaxurl,{action:'markdownify',input:base.$el.val()},function(json){
                $('#mdqt_loader').fadeOut('fast');
                base.$el.val(json.markdown);
              },"json");
            }
            return false;
          })).append($('<a href="#">Render</a>').click(function(e){
            e.preventDefault();
            $this = $(this);
            $this.takeSnapshot($content.val(),$this.getSelorCaret(content));
            if ($this.text() == 'Render') {
              $('#mdqt_loader').fadeIn('fast');
              $.post(ajaxurl,{action:'markdown',input:base.$el.val(),type:'render'},function(json){
                $('#mdqt_loader').fadeOut('fast');
                base.$el.val(json.html);
              },"json");
            }
            return false;
          })).append($('<a href="#" id="redobutton">Redo</a>').click(function(e){
            e.preventDefault();
            base.$el.undoForward();
            return false;
          })).append($('<a href="#" id="undobutton">Undo</a>').click(function(e){
            e.preventDefault();
            base.$el.undoBack();
            return false;
          })).appendTo($('div.postarea'));

          $('<a id="helpbutton" href="#" title="Markdown Reference">?</a>').click(function(e) {
            $('div.postarea').append(helptext);
            $('#markdownref .section-name').each(function(i) {
              $('#markdownref .section').hide();
              $(this).click(function() {
                $('#markdownref .section').hide();
                if (!$('#markdownref .section').slice(i, i + 1).is(':visible')) {
                  $('#markdownref .section').slice(i, i + 1).show();
                }
              });
            });
            $('#markdownref').dialog({
              width:600,
              height:400,
              draggable:true,
              resizable:false,
              title: 'Markdown Reference',
              close:function(){
                $('#markdownref').remove();
              }
            });
          }).appendTo($('#ed_button_container'));

          $('<input type="button" id="previewbutton" title="Preview"/>').click(function(e){
            e.preventDefault();
            $('#mdqt_loader').fadeIn('fast');
            if (!$(this).hasClass('activeutil')) {      
              $(this).addClass('activeutil');
                    var content = base.$el.val();
              var cheight = base.$el.height();
              $('div.postarea').data('contentval',base.$el.val());
              $('div.postarea #utils').fadeOut('fast');
              $('#editorcontainer').height($('div.postarea').height() - 52);
              base.$el.fadeOut('fast',function(){
                $.post(ajaxurl,{action:'markdown',input:content,type:'preview'},function(json){
                  $('#preview').html(json.html);
                  if ($('#previewbutton').text() != 'Preview')
                    $('#preview').height($('div.postarea').height() - 135).fadeIn();
                  $('#mdqt_loader').fadeOut('fast');
                  $('#editorcontainer').height('auto');

                },"json");

              });      
            } else {
              $('#preview').stop(true,true).hide();
              $('#mdqt_loader').stop(true,true).fadeOut('fast');
              $(this).removeClass('activeutil');
              $('div.postarea #utils').fadeIn('fast');
              base.$el.fadeIn();
            }
            return false;
          }).appendTo($('#ed_button_container'));

          $('<input type="button" id="fullscreenbutton" title="Full Screen Editor"/>').click(function(e){
            e.preventDefault();
            if (!$(this).hasClass('activeutil')) {      
              $(this).addClass('activeutil');
              $('<div id="fullscreenoverlay" />').css({'display':'none','background':options.fullscreenbg,'opacity':options.fullscreenbgopacity}).insertBefore($('div.postarea')).fadeIn();
              $('div.postarea').height('100%').fadeOut('fast',function(){
                $('body').css('overflow','hidden');
                var marginleft = options.fullscreenwidth / 2;
                $(this).addClass('supermarkdowneditoraway').css({'width':options.fullscreenwidth+'px','margin-left':'-'+marginleft+'px'}).fadeIn('fast',function(){
                  if ($('#preview').is(':visible'))
                    $('div.supermarkdowneditoraway #utils').hide();

                  $('#content,#preview').css('height',$('div.postarea').height() - 95);

                });

              });
              $(window).resize(function() {
                $('div.postarea').height('100%');
                base.$el.css('height',$('div.postarea').height() - 95);          
                $('#preview').css('height',$('div.postarea').height() - 136);          
              });      
            } else {
              $(this).removeClass('activeutil');
              $('div.postarea').fadeOut('fast',function(){
                $(this).removeClass('supermarkdowneditoraway').css({'height':'auto','width':'auto','margin-left':'auto'});
                $('#fullscreenoverlay').fadeOut('fast',function(){
                  $(this).remove();
                  $('div.postarea').fadeIn('fast',function(){$('body').css('overflow','auto');});
                });
              });

              $('#content,#preview').css({'height':'auto'});
            }
            return false;
          }).appendTo($('#ed_button_container'));

          if (options.showlookup)
            $('#ed_button_container').append('<input type="button" id="ed_spell" class="ed_button" onclick="edSpell(edCanvas);" title="' + 'Dictionary lookup' + '" value="' + 'lookup' + '" />');
          // document.write('<input type="button" id="ed_close" class="ed_button" onclick="edCloseAllTags();" title="' + 'Close all open tags' + '" value="' + 'close all' + '" />');
          if (options.tabsize)
            $.fn.tabOverride.setTabSize(options.tabsize);
          if (options.showtooltips)
            $('#ed_toolbar input, #helpbutton').tipsy({fade: true,gravity:'s'});
          if (options.font)
            base.$el.css({'font-family':options.font});
          if (options.fontsize)
            base.$el.css({'font-size':options.fontsize+'px'});
          base.$el.bind('textchange', function () {
            if (!undoing) {              
              clearTimeout(snaptimeout);
              var self = this;
              snaptimeout = setTimeout(function () {
                base.$el.takeSnapshot($content.val(),base.$el.getSelorCaret(content));
              }, 100);
            }
          });
          $('<form id="urlpaste" title="Paste text with one or more urls in it..."/>').css({display:'none',textAlign:'center'}).append($('<textarea />')).appendTo($('#ed_toolbar')).dialog({
      			autoOpen: false,
      			height: 400,
      			width: 500,
      			modal: true,
      			draggable: true,
      			resizable: false,
      			buttons: {
      				"Paste links": function() {
      					$( this ).dialog( "close" );
      					base.$el.makeRefs($(this).children('textarea').val());
      					$(this).children('textarea').val('');
      				},
      				Cancel: function() {
      					$( this ).dialog( "close" );
      				}
      			}
      		});
          base.$el.bindKeys();
          base.$el.takeSnapshot(base.$el.val(),1);
          $('#mdqt_loader').fadeOut('fast');
        };
        // Run initializer
        base.init();
    };
		$.fn.unbindKeys = function() {
			$(this).unbind('keydown').unbind('keyup');
		};
    $.fn.bindKeys = function() {
      var base = this;
      // Access to $ and DOM versions of element
      base.$el = $(this);
      base.el = $(this).get(0);
      
      function insertPair(c,pair) {
        $(this).takeSnapshot($(c).val(),$(this).getSelorCaret(c));
        var caret = base.$el.getCaret();
        var sel = mdqt_getSelection(c);
        var newcontent = sel ? pair[0]+sel+pair[1] : pair.join('');
        var newcaret = sel ? caret + newcontent.length : caret + 1;
        $(this).insertContent(c,newcontent);
        if (pair[0].length > 1) {
          mdqt_setSelection(c,caret+1,caret+pair[0].length);
        } else {
          setCaret(c,newcaret);
        }
      }
      
          $(this).unbind('keydown').unbind('keyup').bind('keydown',function(ev){
            if (!ev.ctrlKey && !ev.metaKey && !ev.altKey) {
              undoing = false;
              snapshotsFwd = [];
            }
            var code = (ev.keyCode ? ev.keyCode : ev.which),
            caret = base.$el.getCaret(),
            completing = false,
            nextchar = base.el.value.substring(caret,caret+1),
            prevchar = base.el.value.substring(caret,caret-1),
            contents,before,after,match;
            if (completing === false && prevchar == '[' && nextchar == ']') {
              if (base.el.value.substring(caret-1,caret-2) == ']') {
                $(this).unbind('keydown').unbind('keyup').createSuggest();
                return true;
              }
            } else if (completing === true && nextchar !== ']'){
              completing = false;
              $(this).bindKeys();
              return true;
            }
            switch (code) {
              case 8: // backspace
                if ((/(\[\]|\(\)|""|''|``|<>)/).test(prevchar + nextchar)) {
                  ev.preventDefault();
                  contents = base.$el.val();
                  before = contents.substring(0,caret - 1);
                  after = contents.substring(caret + 1,contents.length);
                  base.$el.val(before+after);
                  setCaret(base.el,caret - 1);
                  return false;
                } else {
                  return true;
                }
                break;
              case 219: // [
              case 57: // 9 // (
              case 188: // , // <
              case 222: // ' // "
              case 192: // `
                if (!ev.ctrlKey && !ev.altKey) {
                  var pair;
                  nextchar = base.el.value.substring(caret,caret+1);
                  if (nextchar.match(/[a-z]/i) && !mdqt_getSelection(base.el)) {
                    return true;
                  }
                  if (code === 57 && ev.shiftKey) {
                    if (prevchar == ']')
                      pair = ['(http://',')'];
                    else
                      pair = ['(',')'];
                  } else if (code === 188 && ev.shiftKey) {
                    pair = ['<','>'];
                  } else if (code === 219 && !ev.shiftKey) {
                    if (prevchar == ']') {
                      $(this).unbind('keydown').unbind('keyup').createSuggest();
                    }
                    pair = ['[',']'];
                  } else if (code === 192 && !ev.shiftKey) {
                    pair = ['`','`'];
                  } else if (code === 222) {                
                    if (ev.shiftKey)
                      thechar = '"';
                    else
                      thechar = "'";
                    pair = [thechar,thechar];
                  } else {
                    return true;
                  }
                  if (pair && (code === 222 || code === 192)) {
                    thechar = code === 222 ? thechar : '`';
                    if (!mdqt_getSelection(base.el)) {

                      if (nextchar == thechar) {
                        ev.preventDefault();
                        setCaret(base.el,caret + 1);
                        return false;
                      } else if (/\S/.test(prevchar)) {
                        return true;
                      }
                    }
                  }
                  ev.preventDefault();
                  insertPair(base.el,pair);
                  return false;
                }
                break;
              case 221: // ]
              case 48: // 0 // )
              case 190: // . // >
                if (!ev.ctrlKey && !ev.altKey) {
                  var thechar;
                  if (code === 48 && ev.shiftKey) {
                    thechar = ')';
                  } else if (code === 190 && ev.shiftKey) {
                    thechar = '>';
                  } else if (code === 221 && !ev.shiftKey) {
                    $(this).bindKeys();
                    thechar = ']';
                  } else {
                    return true;
                  }
                  ev.preventDefault();
                  caret = base.$el.getCaret();
                  if (mdqt_getSelection(base.el))
                    return true;              
                  if (nextchar == thechar) {
                    setCaret(base.el,caret + 1);
                  } else {
                    base.$el.insertContent(base.el,thechar);
                  }
                  return false;
                }
                break;
              case 49:
              case 56:
              case 187:
              case 189:
                if (!ev.ctrlKey && !ev.altKey && !ev.metaKey) {
                  if (!ev.shiftKey && (code == 56 || code == 187))
                    return true;
                  else if (ev.shiftKey && (code == 49 || code == 189))
                    return true;
                  var cursorloc = base.$el.getCaret();
                  if (mdqt_getSelection(base.el)) {
                    var type = ['u',9];
                    if (!ev.shiftKey && (code == 49))
                      type = ['o',10];
                    ev.preventDefault();
                    base.$el.edMakeList(base.el,type[1],type[0]);
                    return false;
                  }
                }
                return true;
                break;
              case 90: // z
                if (ev.ctrlKey || ev.metaKey) { // && $.browser.safari
                  ev.preventDefault();
                  if (ev.shiftKey)
                    base.$el.undoForward();
                  else
                    base.$el.undoBack();
                  return false;
                } else {
                  return true;
                }
                break;
              // failed attempt at enabling command-b, command-i
              case 66: // b
              case 73: // i
                if (ev.metaKey || ev.ctrlKey) {
                  ev.preventDefault();
                  if (code == 66)
                    $('#ed_strong').trigger('click');
                  else if (code == 73)
                    $('#ed_em').trigger('click');
                  return false;
                } else {
                  return true;
                }
                break;
              case 13: // enter
                var grafs = base.$el.val().split("\n");
                var graf;
                var total = 0;
                var scrollpos = base.el.scrollTop;
                if (/\n/.test(prevchar)) {
                  // ev.preventDefault();
                  // base.$el.insertContent(base.el,"\n");
                  // return false;
                  return true;
                }
                if (ev.metaKey) {
                  for (graf in grafs) {
                    if ((caret > total && caret < total + grafs[graf].length + 1) || caret == total) {
                      var bef = grafs.slice(0, Number(graf) + 1).join("\n");
                      setCaret(base.el,bef.length);
                      break;
                    } else {
                      total += grafs[graf].length + 1;
                    }
                  }
                }
                caret = base.$el.getCaret();
                total = 0;
                for (graf in grafs) {
                  if ((caret > total && caret < total + grafs[graf].length + 1) || caret == total) {
                    if (/^(\s*)([\-\+\*]|\d+\.)(\s*)[\w`'"\(<\[]/.test(grafs[graf])) {                      
                      ev.preventDefault();
                      match = /^(\s*([\-\+\*]|\d+\.)(\s*))(.*)/.exec(grafs[graf]);
                      if (/(\d+)\./.test(match[2])) {
                        var digit = /^(\s*)(\d+)(\.\s.*)/.exec(match[1]);
                        var inc = Number(digit[2]) + 1;
                        match[1] = digit[1] + inc + digit[3];
                      } 
                      contents = base.$el.val();
                      before = contents.substring(0,caret);
                      after = contents.substring(caret,contents.length);
                      base.$el.val(before+"\n"+match[1]+after);
                      setCaret(base.el,caret + match[1].length + 1);
                      base.el.scrollTop = scrollpos;
                      return false;
                    } else if (/^(\s*)([\-\+\*]|\d+\.)(\s*)$/.test(grafs[graf])) {              
                      ev.preventDefault();
                      before = grafs.slice(0, graf).join("\n") + "\n";
                      after = "\r\n"+grafs.slice(Number(graf) + 1, grafs.length).join("\n");
                      base.$el.val(before+after);
                      setCaret(base.el,before.length);
                      base.el.scrollTop = scrollpos;
                      return false;
                    } else if (/^(\s*)(.)?/.test(grafs[graf])) {
                      ev.preventDefault();
                      match = /^(\s*)(.*)/.exec(grafs[graf]);
                      acontents = base.$el.val();
                      if (match[2]) {
                        before = acontents.substring(0,caret) + "\n" + match[1];
                        after = acontents.substring(caret,acontents.length);
                      } else {
                        before = acontents.substring(0,caret) + "\n";
                        after = acontents.substring(caret,acontents.length);
                      }
                      base.$el.val(before+after);
                      setCaret(base.el,before.length);
                      base.el.scrollTop = scrollpos;
                      return false;
                    } else {
                      return true;
                    }
                  } else {
                    total += grafs[graf].length + 1;
                  }

                }
                return true;
              break;
              default:
                return true;
              break;
            }
            return true;
          }).tabOverride();
    };
    function getSelectionCoord(el) {
      if (el.selectionStart || el.selectionStart === 0) {
          a = el.selectionStart;
          b = el.selectionEnd;
          if (b != a) {
              return {start:a, end:b};
          }
      } else if (document.selection) {
          el.focus();
          d = document.selection.createRange();
          if (d.text.length > 0) {
            return d;
          }
      }
      return false;
    }
    $.fn.getRefs = function() {
      var matches = $(this).val().match(/\[([^\]]+)\]\: (.*)/gi),a;
      if (matches) {        
        var refs = new Array();
        for (var i in matches) { 
          refs.push(/\[([^\]]+)\]/.exec(matches[i])[1].toLowerCase());
        }
        return refs;
      }
    };
    $.fn.createSuggest = function() {
      var suggests = $(this).getRefs();
      $(this).asuggest(suggests, {
        'endingSymbols': '',
        'minChunkSize': 1,
        'delimiters': '['
      });
    };
    // GetCaret via CMS http://stackoverflow.com/users/5445/cms
    // http://stackoverflow.com/questions/263743/how-to-get-cursor-position-in-textarea

    $.fn.getCaret = function() {
        var el = $(this).get(0);
        if (el.selectionStart) { 
          return el.selectionStart; 
        } else if (document.selection) { 
          el.focus(); 

          var r = document.selection.createRange(); 
          if (r === null) { 
            return 0; 
          } 

          var re = el.createTextRange(), 
              rc = re.duplicate(); 
          re.moveToBookmark(r.getBookmark()); 
          rc.setEndPoint('EndToStart', re); 

          return rc.text.length; 
        }  
        return 0; 
    };
    $.fn.getSelorCaret = function(el){
      var coords = getSelectionCoord(el);    
      if (coords && typeof coords !== 'object') {
          d = document.selection.createRange();
          if (d.text.length > 0) {
            return d.text;
          } else {
            return $(this).getCaret();
          }
      } else {      
        if (coords.start !== coords.end) {
          return coords;
        } else {
          return $(el).getCaret();
        }
      }
    };
    $.mdqt.quicktags.defaultOptions = {
        usesmarty: true,
        tabsize: 4
    };

    $.fn.takeSnapshot = function(content,coords) {
      if (snapshots[snapshots.length - 1] !== content) {
        snapshots.push([content,coords]);
        if (snapshots.length >= 100) {
          snapshots = snapshots.slice(-100,snapshots.length);
        }
        // $('#undobutton').css('background','#92bd76');
        // clearInterval(snaptimer);
        // snaptimer = setTimeout(function(){
        //   $('#undobutton').css('background','none');
        // },250);
      }
    };
    function mdqt_setSelection(ctrl,start,end) {
      if(ctrl.setSelectionRange)
    	{
    		ctrl.focus();
    		ctrl.setSelectionRange(start,end);
    	}
    	else if (ctrl.createTextRange) {
    		var range = ctrl.createTextRange();
    		range.collapse(true);
    		range.moveEnd('character', end);
    		range.moveStart('character', start);
    		range.select();
    	}
    }
    function setCaret(ctrl, pos)
    {
    	if(ctrl.setSelectionRange)
    	{
    		ctrl.focus();
    		ctrl.setSelectionRange(pos,pos);
    	}
    	else if (ctrl.createTextRange) {
    		var range = ctrl.createTextRange();
    		range.collapse(true);
    		range.moveEnd('character', pos);
    		range.moveStart('character', pos);
    		range.select();
    	}
    }
    
    function mdqt_getSelection(el) {
      var coords = getSelectionCoord(el);
      if (coords && typeof coords !== 'object') {
          d = document.selection.createRange();
          if (d.text.length > 0) {
            return d.text;
          }
      } else {      
        if (coords.start !== coords.end) {
            return el.value.substring(coords.start, coords.end);
        }
      }
      return false;
    }
    function edAddTag(a) {
       if (edButtons[a].tagEnd !== "") {
            edOpenTags[edOpenTags.length] = a;
            document.getElementById(edButtons[a].id).value = "/" + document.getElementById(edButtons[a].id).value;
        }
    }
    function edRemoveTag(b) {
        for (var a = 0; a < edOpenTags.length; a++) {
            if (edOpenTags[a] == b) {
                edOpenTags.splice(a, 1);
                document.getElementById(edButtons[b].id).value = document.getElementById(edButtons[b].id).value.replace("/", "");
            }
        }
    }
    function edCheckOpenTags(c) {
        var a = 0,
        b;
        for (b = 0; b < edOpenTags.length; b++) {
            if (edOpenTags[b] == c) {
                a++;
            }
        }
        if (a > 0) {
            return true;
        } else {
            return false;
        }
    }
    function edCloseAllTags() {
        var a = edOpenTags.length,
        b;
        for (b = 0; b < a; b++) {
            $(this).edInsertTag(edCanvas, edOpenTags[edOpenTags.length - 1]);
        }
    }
    function edQuickLink(c, d) {
        if (c > -1) {
            var b = "",
            a;
            a = '[' + edLinks[c].display + '](' + edLinks[c].URL + ")";
            d.selectedIndex = 0;
            $(this).insertContent(edCanvas, a);
        } else {
            d.selectedIndex = 0;
        }
    }
    function edSpell(c) {
        var e = "",
        d,
        b,
        a;
        if (document.selection) {
            c.focus();
            d = document.selection.createRange();
            if (d.text.length > 0) {
                e = d.text;
            }
        } else {
            if (c.selectionStart || c.selectionStart == "0") {
                b = c.selectionStart;
                a = c.selectionEnd;
                if (b != a) {
                    e = c.value.substring(b, a);
                }
            }
        }
        if (e === "") {
            e = prompt('Enter a word to look up:', "");
        }
        if (e !== null && (/^\w[\w ]*$/).test(e)) {
            window.open("http://dictionary.reference.com/browse/" + escape(e));
        }
    }
    $.fn.edInsertTag = function(d, c) {
        if (document.selection) {
            d.focus();
            var e = document.selection.createRange();
            if (e.text.length > 0) {
                e.text = edButtons[c].tagStart + e.text + edButtons[c].tagEnd;
            } else {
                if (!edCheckOpenTags(c) || edButtons[c].tagEnd === "") {
                    e.text = edButtons[c].tagStart;
                    edAddTag(c);
                } else {
                    e.text = edButtons[c].tagEnd;
                    edRemoveTag(c);
                }
            }
            d.focus();
        } else {
            if (d.selectionStart || d.selectionStart == "0") {
                var b = d.selectionStart,
                a = d.selectionEnd,
                g = a,
                f = d.scrollTop;
                if (b != a) {
                    d.value = d.value.substring(0, b) + edButtons[c].tagStart + d.value.substring(b, a) + edButtons[c].tagEnd + d.value.substring(a, d.value.length);
                    g += edButtons[c].tagStart.length + edButtons[c].tagEnd.length;
                } else {
                    if (!edCheckOpenTags(c) || edButtons[c].tagEnd === "") {
                        d.value = d.value.substring(0, b) + edButtons[c].tagStart + d.value.substring(a, d.value.length);
                        edAddTag(c);
                        g = b + edButtons[c].tagStart.length;
                    } else {
                        d.value = d.value.substring(0, b) + edButtons[c].tagEnd + d.value.substring(a, d.value.length);
                        edRemoveTag(c);
                        g = b + edButtons[c].tagEnd.length;
                    }
                }
                d.focus();
                d.selectionStart = g;
                d.selectionEnd = g;
                d.scrollTop = f;
            } else {
                if (!edCheckOpenTags(c) || edButtons[c].tagEnd === "") {
                    d.value += edButtons[c].tagStart;
                    edAddTag(c);
                } else {
                    d.value += edButtons[c].tagEnd;
                    edRemoveTag(c);
                }
                d.focus();
            }
        }
    };
    $.fn.insertContent = function(d, c) {
        var e,
        b,
        a,
        f;
        if (document.selection) {
            d.focus();
            e = document.selection.createRange();
            e.text = c;
            d.focus();
        } else {
            if (d.selectionStart || d.selectionStart == "0") {
                b = d.selectionStart;
                a = d.selectionEnd;
                f = d.scrollTop;
                d.value = d.value.substring(0, b) + c + d.value.substring(a, d.value.length);
                d.focus();
                d.selectionStart = b + c.length;
                d.selectionEnd = b + c.length;
                d.scrollTop = f;
            } else {
                d.value += c;
                d.focus();
            }
        }
    };
    $.fn.edInsertLink = function(d, c, b) {
        var content = $(this).get(0);
        if (!b) {
            b = "http://";
        }
        if (!edCheckOpenTags(c)) {
          var a = prompt('Enter url', b);
            if (a) {
              if (!/^[^:]{3,5}:\/\//.test(a))
                a = 'http://'+a;
              if (!mdqt_getSelection(d)) {
                edButtons[c].tagStart = '[' + prompt('Link text','') + '](' + a + ')';
                edButtons[c].tagEnd = '';
                $(this).edInsertTag(d, c);
                // edButtons[c].tagStart = '[';
                // edButtons[c].tagEnd = '](' + a + ')';
                // edInsertTag(d, c);
              } else {
                edButtons[c].tagStart = '[';
                edButtons[c].tagEnd = '](' + a + ')';
                $(this).edInsertTag(d, c);
              }
            }
        } else {
            $(this).edInsertTag(d, c);
        }
    };
    $.fn.edInsertImage = function(b) {
        var a = prompt('Enter image url', "http://");
        if (a) {
            var parts = a.split('/');
            parts = parts[parts.length - 1].split('.');
            parts.pop();
            var def = parts.join('.');
            a = '![' + prompt('Enter image description', def) + '](' + a + ')';
            $(this).insertContent(b, a);
        }
    };
    
    
    $.fn.undoBack = function() {
      if (snapshots.length > 0) {
        undoing = true;
        $content = $(this);
        var newcontent = snapshots.pop();
        snapshotsFwd.push([$content.val(),$content.getSelorCaret($content.get(0))]);
        $content.val(newcontent[0]);
        if (typeof newcontent[1] !== 'object') {
          setCaret($content.get(0),newcontent[1]);
        } else {
          mdqt_setSelection($content.get(0),newcontent[1].start,newcontent[1].end);
        }
      }
    };

    $.fn.undoForward = function() {
      if (snapshotsFwd.length > 0) {
        undoing = true;
        $content = $(this);
        var newcontent = snapshotsFwd.pop();
        snapshots.push([$content.val(),$content.getSelorCaret($content.get(0))]);
        $content.val(newcontent[0]);
        if (typeof newcontent[1] !== 'object') {
          setCaret($content.get(0),newcontent[1]);
        } else {
          mdqt_setSelection($content.get(0),newcontent[1].start,newcontent[1].end);
        }
      }
    };
    var helptext = '<div id="markdownref"><h2 class="section-name">Text</h2><div class="section"><table><tr><th>Markdown</th><th>Result</th></tr><tr><td>This text is **bold**.</td><td>This text is<strong>bold</strong>.</td></tr><tr class="alternate"><td>This text is *italicized*.</td><td>This text is<em>italicized</em>.</td></tr><tr><td>`This is some code.`</td><td><code>This is some code.</code></td></tr></table></div><h2 class="section-name">Headings</h2><div class="section"><table><tr><th>Markdown</th><th>Result</th></tr><tr><td># First Header</td><td><h1>First Header</h1></td></tr><tr class="alternate"><td>## Second Header</td><td><h2>Second Header</h2></td></tr><tr><td>### Third Header</td><td><h3>Third Header</h3></td></tr></table></div><h2 class="section-name">Quotes</h2><div class="section"><table><tr class="alternate"><td>> This is the first level of quoting.<br />>>This is nested blockquote.<br />> Back to the first level.</td><td><blockquote>This is the first level of quoting.<blockquote>This is nested blockquote.</blockquote>Back to the first level.</blockquote></td></tr></table></div><h2 class="section-name">Horizontal Rules</h2><div class="section"><table><tr class="alternate"><td>- - -<br />* * *<br /></td><td><hr /></td></tr></table></div><h2 class="section-name">Links and Images</h2><div class="section"><table><tr><td>This is an [inline link](http://brettterpstra.com/contact "with an optional title").</td><td>This is an <a href="http://brettterpstra.com/contact" title="with an optional title" target="_blank">inline link</a>.</td></tr><tr class="alternate"><td>This is a [reference link][ref].<br/>[ref]: http://brettterpstra.com "with an optional title"</td><td>This is a <a href="http://brettterpstra.com">reference link</a>.</td></tr><tr><td>Send me an email at &lt;address@example.com&gt;.</td><td>Send me an email at <a href="mailto:address@example.com">address@example.com</a>.</td></tr><tr><td>![Markdown QuickTags logo](http://brettterpstra.com/markdownquicktagsicon.png)<br/>-------OR------<br/>![Reference style][logo]<br/>[logo]: http://brettterpstra.com/markdownquicktagsicon.png</td><td><img src="http://brettterpstra.com/wp-content/uploads/downloads/thumbnails/2010/11/markdownquicktagsicon.png" alt="Markdown QuickLinks logo" /></td></tr></table></div><h2 class="section-name">Lists</h2><div class="section"><table><tr><th>Markdown</th><th>Result</th></tr><tr><td>* Bulleted<br />* List<br />&nbsp;&nbsp;* Nested<br />&nbsp;&nbsp;* List<br />* Parent level</td><td><ul><li>Bulleted</li><li>List<ul><li>Nested</li><li>List</li></ul></li><li>Parent level</li></ul></td></tr><tr class="alternate"><td>1. Numbered<br />2. List<br />&nbsp;&nbsp;1. Nested<br />&nbsp;&nbsp;2. List<br />3. Parent level</td><td><ol><li>Numbered</li><li>List<ol><li>Nested</li><li>List</li></ol></li><li>Parent level</li></ol></td></tr><tr><td>1. Mixed<br />1. Type<br />1. List<br />&nbsp;&nbsp;* Nested<br />&nbsp;&nbsp;* Bulleted<br />&nbsp;&nbsp;* List<br />1. Parent level</td><td><ol><li>Mixed</li><li>Type</li><li>List<ul><li>Nested</li><li>Bulleted</li><li>List</li></ul></li><li>Parent level</li></ol></td></tr></table></div><hr /><p style="text-align:center"><small>Original reference by <a href="https://github.com/edouard/human-markdown-reference" title="">edouard</a>.</small></p></div>';
    
    function isUrl(s) {
    	var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    	return regexp.test(s);
    }
    $.fn.edInsertRefLink = function(d, c, b) {

        if ($('#selectmenu').length)
          return;
        if (!b)
            b = "http://";
        if (!edCheckOpenTags(c)) {
          var matches = d.value.match(/\[([^\]]+)\]\: (.*)/gi);
          var a;
          if (matches) {        
            var refs = new Array();
            var links = new Array();
            for (var i in matches) { 
              refs.push(/\[([^\]]+)\]/.exec(matches[i])[1]);
              var link = /\[[^\]]+\]\: *(.*)/.exec(matches[i])[1];
              if (!(/\/$/).test(link))
                link = link + '/';
              link = link.split('//')[1].split('/')[0];
              links.push(link);
            }
            if (refs.length > 1) {
              var output = "<div id=\"reflinkwrap\"><button id=\"selectcancel\">cancel</button><select id=\"selectmenu\">\n<option value=\"\">Please select a reference</option>\n";
              for (var e in refs) {
                output += "<option value=\""+refs[e]+"\">" + refs[e] + " ("+links[e]+")</option>\n";
              }
              output += "</select></div>";
              // tb_show("Select a reference","/wp-content/plugins/WP-Markdown-QuickTags/choice.html");
              $('#ed_reflink').after(output);
              $('#reflinkwrap').slideDown('fast',function(){ $('#selectmenu').focus(); });
              // $('#selectform').html(output);
              $('#selectcancel').click(function(e){
                e.preventDefault();
                $('#reflinkwrap').slideUp('fast',function(){ $(this).remove(); });
                return false;
              });
              $('#selectmenu').change(function(){
                a = $(this).val();            
                $('#reflinkwrap').slideUp('fast',function(){ 
                  $(this).remove(); 
                  if (a !== "")
                    edInsertRefLinkCallback(a,d,c,b);
                });
              });
            } else {
              edInsertRefLinkCallback(refs[0],d,c,b);
            }
          } else {
            a = prompt('Enter Reference Title');
            edInsertRefLinkCallback(a,d,c,b);        
          }
        } else {
            $(this).edInsertTag(d, c);
        }
    };
    function edInsertRefLinkCallback(a,d,c,b) {
      if (!mdqt_getSelection(d)) {
        var caret = $(this).getCaret();

        
        var nextchar = d.value.substring(caret,caret+1);
        var prevchar = d.value.substring(caret,caret-1);
        if (nextchar == ']' && prevchar == '[') {
          $(this).insertContent(d,a);
        } else {
          var linktext = prompt('Link text','');
          if (linktext === null)
            return;
          edButtons[c].tagStart = '[' + linktext + '][' + a + ']';
          edButtons[c].tagEnd = '';
          $(this).edInsertTag(d, c);
        }
      } else {
        edButtons[c].tagStart = '[';
        edButtons[c].tagEnd = '][' + a + ']';
        $(this).edInsertTag(d, c);
      }

    }  
    function edInsertRef(d, c, b) {
        var sel = false,
        url = false,
        title = false;
        if (document.selection) {
            d.focus();
            e = document.selection.createRange();
            sel = e.text;
        } else {
            if (d.selectionStart || d.selectionStart == "0") {
                s = d.selectionStart;
                a = d.selectionEnd;
                f = d.scrollTop;
                sel = d.value.substring(s, a);
            }
        }
        if (sel) {
          if (isUrl(sel)) {
            url = sel;
          } else {
            title = sel;
          }
        }
        if (!url)
          url = prompt('Enter url', b) || '';
        if (!edCheckOpenTags(c)) {
          if (d.selectionEnd <= d.selectionStart) {
            if (!title) 
              title = prompt('Reference Title','') || '';
            edButtons[c].tagStart = '[' + title + ']: ' + url;
            edButtons[c].tagEnd = '';
            $(this).edInsertTag(d, c);
            // edButtons[c].tagStart = '[';
            // edButtons[c].tagEnd = '](' + a + ')';
            // edInsertTag(d, c);
          } else {
            if (!title)
              title = prompt('Reference Title','') || '';
            var out = '[' + title + ']: ' + url;
            $(this).insertContent(d, out);
          }
        } else {
          $(this).edInsertTag(d, c);
        }
    }
    function process_list(text,type) {
      var li = (type == undefined || type.replace(/^\s+/,'') == 'u') ? '*' : '1.';
      var lines = text.replace(/\n\s*\n/g,'\n').split('\n');
      var counter = 0;
      var spacesOrTabs = /^(\s*)/.exec(lines[0])[1];
      var sepSpaces = spacesOrTabs.split('');
      var indent = 0;
      if ((/^\s*([\*\-\+] )/.test(lines[0]) && li == '*')||(/^\s*(\d\. )/.test(lines[0]) && li == '1.')) {
        for (var x in lines) {
          lines[x] = lines[x].replace(/(\s*)(?:[\*\-\+]|\d\.) (.*)/,"$1$2");
        }
        return lines.join("\n");
      }
      
      for (var aspace in spacesOrTabs) {
        if ((/\t/).test(spacesOrTabs[aspace]))
          indent += parseInt(tabsize,10);
        else
          indent++;
      }
      for (var l in lines) {
        var lineSpacesOrTabs = /^(\s*)/.exec(lines[l])[1];
        var lineSepSpaces = lineSpacesOrTabs.split('');
        var lineIndent = 0;
        for (var lineSpaces in lineSpacesOrTabs) {
          if ((/\t/).test(lineSpacesOrTabs[lineSpaces]))
            lineIndent += parseInt(tabsize,10);
          else
            lineIndent++;
        }
        if (lineIndent === indent) {
          if (li == '*') {
            if (/^\s*\d\. /.test(lines[l])) {
              lines[l] = lines[l].replace(/^(\s*)\d\. (.*)/,"$1* $2");
            } else if (/^\s*[^\*\-\+]/.test(lines[l])) {
              lines[l] = lines[l].replace(/(\s*)(.*)/,"$1* $2");
            } // else if (/^\s*(\* )/.test(lines[l])) {
              // lines[l] = lines[l].replace(/(\s*)\* (.*)/,"$1$2");
            // }
          } else {
            counter++;
            if (/^\s*[\*\-\+] /.test(lines[l])) {
              lines[l] = lines[l].replace(/(\s*)[\*\-\+] (.*)/,"$1"+counter+". $2");
            } else if (/^\s*[^(\d\. )]/.test(lines[l])) {
              lines[l] = lines[l].replace(/(\s*)(.*)/,"$1"+counter+". $2");
            } // else if (/^\s*(\d\. )/.test(lines[l])) {
              // lines[l] = lines[l].replace(/(\s*)\d\. (.*)/,"$1$2");
            // }
            holdcounter = counter;
          }
        } else if (lineIndent < indent) {
          counter = 0;
        } else {
          counter = holdcounter;
        }
        
      }
      return lines.join("\n");
    }
    function selectToBeginningOfLine(el,start,end) {
      while (start > 0) {
        prevchar = el.val().substring(start,start - 1);
        if (/\n/.test(prevchar))
          break;
        start--;
      }
      mdqt_setSelection(el.get(0),start,end);
      return {start:start,end:end};
    }
    $.fn.edMakeList = function(d,c, type) {
        var listsel = getSelectionCoord(d), newend = listsel.end;
        listsel = selectToBeginningOfLine($(d),listsel.start,listsel.end);
        if (document.selection) {
            d.focus();
            var e = document.selection.createRange();
            if (e.text.length > 0) {
                e.text = process_list(e.text,type);
            } else {
                if (!edCheckOpenTags(c) || edButtons[c].tagEnd === "") {
                    e.text = edButtons[c].tagStart;
                    edAddTag(c);
                } else {
                    e.text = edButtons[c].tagEnd;
                    edRemoveTag(c);
                }
            }
            // d.focus();
        } else {
            if (d.selectionStart || d.selectionStart == "0") {
                var b = d.selectionStart,
                a = d.selectionEnd,
                g = b,
                f = d.scrollTop;
                if (b != a) {
                    var newlist = process_list(d.value.substring(b, a),type);
                    newend = b + newlist.length;
                    d.value = d.value.substring(0, b)+ newlist + d.value.substring(a, d.value.length);
                    g += edButtons[c].tagStart.length + edButtons[c].tagEnd.length;
                } else {
                    caret = $(d).getCaret();
                    if (!edCheckOpenTags(c) || edButtons[c].tagEnd === "") {
                        d.value = d.value.substring(0, b) + edButtons[c].tagStart + d.value.substring(a, d.value.length);
                        edAddTag(c);
                        g = b + edButtons[c].tagStart.length;
                    } else {
                        d.value = d.value.substring(0, b) + edButtons[c].tagEnd + d.value.substring(a, d.value.length);
                        edRemoveTag(c);
                        g = b + edButtons[c].tagEnd.length;
                    }
                    setCaret(d,caret + edButtons[c].tagStart.length);
                    return false;
                }
                // d.focus();
                // d.selectionStart = g;
                // d.selectionEnd = g;
                d.scrollTop = f;
            } else {
                caret = $(this).getCaret();
                if (!edCheckOpenTags(c) || edButtons[c].tagEnd === "") {
                    d.value += edButtons[c].tagStart;
                    edAddTag(c);
                } else {
                    d.value += edButtons[c].tagEnd;
                    edRemoveTag(c);
                }
                d.focus();
                setCaret(d,caret + edButtons[c].tagStart.length);
            }
        }
        // d.focus();
        mdqt_setSelection(d,listsel.start,newend);
        return false;
    };
    var uniquenames = new Array();
    function contains(a, e) {
    	for(j=0;j<a.length;j++) {
        if(a[j]==e) {
          return true;
        }
      }
    	return false;
    }
    function unique(a) {
    	tmp = new Array(0);
    	for(i=0;i<a.length;i++){
    		if(!contains(tmp, a[i])){
    			tmp.length+=1;
    			tmp[tmp.length-1]=a[i];
    		}
    	}
    	return tmp;
    }
    function uniquename(name,i) {
      if (contains(uniquenames,name)) {
        i++;
        var tmpname = name.replace(/ \d+$/,'') + " " + i;
        return uniquename(tmpname,i);
      } else {
        uniquenames.push(name);
        return name;
      }
    }
    function resetUniquenames() {
      uniquenames = [];
      var matches = $('#content').val().match(/\[(.*?)\]: (.*)/gi);
      if (matches) {
        for (var m in matches) {
          uniquenames.push(/\[(.*?)\]: (.*)/.exec(matches[m])[1]);
        }
      }
    }
    $.fn.makeRefs = function(urls) {
      var d = $(this).get(0);
      var currPos = $(this).getCaret() + 1;
      resetUniquenames();
      // var urls = prompt('Paste text with URLs');

      var matches = urls.match(/(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:\/~\+#]*[\w\-\@^=%&amp;\/~\+#])?/gi);
      if (matches) {
      	var goodurls=unique(matches);
      	var output = [];
      	for (var i in goodurls) {
      	  var s = goodurls[i].split('//')[1].split('/')[0].split('.');
          var name = uniquename(s[s.length-2],0);
      	  output.push('['+name+']: '+goodurls[i]);
      	}
      	var res = output.sort();      	
        $(this).insertContent(d,res.join("\n"));
        var firstName = /\[([^\]]+)\]/.exec(res[0])[1];
        mdqt_setSelection(d,currPos,currPos+firstName.length);
        return true;
      }
      return false;
    };

    $.fn.edPasteRefs = function(d,c) {
      var sel = mdqt_getSelection(d);
      if (sel) {
        $(this).edInsertRef(d,c,null);
        return false;
      }
      $( "#urlpaste" ).dialog( "open" );
      return false;
    };

    $.fn.mdqt_quicktags = function(options){
        return this.each(function(){
            (new $.mdqt.quicktags(this, options));
        });
    };
})(jQuery);

function edToolbar() {
  var mdqtdir;
  jQuery.getJSON(ajaxurl,{action:'mdqtdir'},function(json){
    mdqtdir = unescape(json);  
    $LAB.setOptions({ AlwaysPreserveOrder:true });
    $LAB
    .script(mdqtdir+'jquery.a-tools.min.js')
    .script(mdqtdir+'jquery.asuggest.js') 
    .script(mdqtdir+'jquery.hoverIntent.min.js')
    .script(mdqtdir+'taboverride.js')
    .script(mdqtdir+'jquery.tipsy.js')
    .script(mdqtdir+'textchange.jquery.js').wait(function() { 
      jQuery('#quicktags').append(jQuery('<div id="ed_toolbar" />').append(jQuery('<div id="ed_button_container" />')));
      jQuery.getJSON(ajaxurl,{action:'mdqt_options'},function(json){
        jQuery('#content').mdqt_quicktags(json);
      });
    });
  });
}  
function edInsertContent(el,text) {
  jQuery(edCanvas).data('mdqt.quicktags').$el.insertContent(el,text);
}

function edCloseAllTags() {
  return true;
}
