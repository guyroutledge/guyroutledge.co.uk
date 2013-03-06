var edButtons = new Array(),
edLinks = new Array(),
edOpenTags = new Array(),
now = new Date(),
datetime,
snapshots = new Array(),
snapshotsFwd = new Array(),
snaptimer, snaptimeout, undoing = false;
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
        jQuery('#ed_button_container').append('<input type="button" title="' + b.title + '" id="' + b.id + '" accesskey="' + b.access + '" class="ed_button" onclick="edInsertImage(edCanvas);" value="' + b.display + '" />');
    } else {
        if (b.id == "ed_link") {
          jQuery('#ed_button_container').append('<input type="button" title="' + b.title + '" id="' + b.id + '" accesskey="' + b.access + '" class="ed_button" onclick="edInsertLink(edCanvas, ' + a + ');" value="' + b.display + '" />');
        } else if (b.id == "ed_reflink") {
          jQuery('#ed_button_container').append('<input type="button" title="' + b.title + '" id="' + b.id + '" accesskey="' + b.access + '" class="ed_button" onclick="edInsertRefLink(edCanvas, ' + a + ');" value="' + b.display + '" />');
        } else if (b.id == "ed_ref") {
          jQuery('#ed_button_container').append('<input type="button" title="' + b.title + '" id="' + b.id + '" accesskey="' + b.access + '" class="ed_button" onclick="edInsertRef(edCanvas, ' + a + ');" value="' + b.display + '" />');
        } else if (b.id == "ed_ul" || b.id == "ed_ol") {
          jQuery('#ed_button_container').append('<input type="button" title="' + b.title + '" id="' + b.id + '" accesskey="' + b.access + '" class="ed_button" onclick="edMakeList(edCanvas, ' + a + ', \'' + b.id.replace(/ed_(.)l/,"$1") + '\');" value="' + b.display + '" />');
        } else if (b.id == "ed_pasteref") {
          jQuery('#ed_button_container').append('<input type="button" title="' + b.title + '" id="' + b.id + '" accesskey="' + b.access + '" class="ed_button" onclick="edPasteRefs(edCanvas, ' + a + ');" value="' + b.display + '" />');
        } else {
        jQuery('#ed_button_container').append('<input type="button" title="' + b.title + '" id="' + b.id + '" accesskey="' + b.access + '" class="ed_button" onclick="edInsertTag(edCanvas, ' + a + ');" value="' + b.display + '"  />');
      }
    }
}

function edAddTag(a) {
    if (edButtons[a].tagEnd != "") {
        edOpenTags[edOpenTags.length] = a;
        document.getElementById(edButtons[a].id).value = "/" + document.getElementById(edButtons[a].id).value
    }
}
function edRemoveTag(b) {
    for (var a = 0; a < edOpenTags.length; a++) {
        if (edOpenTags[a] == b) {
            edOpenTags.splice(a, 1);
            document.getElementById(edButtons[b].id).value = document.getElementById(edButtons[b].id).value.replace("/", "")
        }
    }
}
function edCheckOpenTags(c) {
    var a = 0,
    b;
    for (b = 0; b < edOpenTags.length; b++) {
        if (edOpenTags[b] == c) {
            a++
        }
    }
    if (a > 0) {
        return true
    } else {
        return false
    }
}
function edCloseAllTags() {
    var a = edOpenTags.length,
    b;
    for (b = 0; b < a; b++) {
        edInsertTag(edCanvas, edOpenTags[edOpenTags.length - 1])
    }
}
function edQuickLink(c, d) {
    if (c > -1) {
        var b = "",
        a;
        a = '[' + edLinks[c].display + '](' + edLinks[c].URL + ")";
        d.selectedIndex = 0;
        edInsertContent(edCanvas, a)
    } else {
        d.selectedIndex = 0
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
    if (e == "") {
        e = prompt('Enter a word to look up:', "");
    }
    if (e !== null && /^\w[\w ]*$/.test(e)) {
        window.open("http://dictionary.reference.com/browse/" + escape(e))
    }
}
function edToolbar() {
    document.write('<div id="ed_toolbar"><div id="ed_button_container">');
    document.write("</div></div>");
}
function edInsertTag(d, c) {
    if (document.selection) {
        d.focus();
        var e = document.selection.createRange();
        if (e.text.length > 0) {
            e.text = edButtons[c].tagStart + e.text + edButtons[c].tagEnd
        } else {
            if (!edCheckOpenTags(c) || edButtons[c].tagEnd == "") {
                e.text = edButtons[c].tagStart;
                edAddTag(c)
            } else {
                e.text = edButtons[c].tagEnd;
                edRemoveTag(c)
            }
        }
        d.focus()
    } else {
        if (d.selectionStart || d.selectionStart == "0") {
            var b = d.selectionStart,
            a = d.selectionEnd,
            g = a,
            f = d.scrollTop;
            if (b != a) {
                d.value = d.value.substring(0, b) + edButtons[c].tagStart + d.value.substring(b, a) + edButtons[c].tagEnd + d.value.substring(a, d.value.length);
                g += edButtons[c].tagStart.length + edButtons[c].tagEnd.length
            } else {
                if (!edCheckOpenTags(c) || edButtons[c].tagEnd == "") {
                    d.value = d.value.substring(0, b) + edButtons[c].tagStart + d.value.substring(a, d.value.length);
                    edAddTag(c);
                    g = b + edButtons[c].tagStart.length
                } else {
                    d.value = d.value.substring(0, b) + edButtons[c].tagEnd + d.value.substring(a, d.value.length);
                    edRemoveTag(c);
                    g = b + edButtons[c].tagEnd.length
                }
            }
            d.focus();
            d.selectionStart = g;
            d.selectionEnd = g;
            d.scrollTop = f
        } else {
            if (!edCheckOpenTags(c) || edButtons[c].tagEnd == "") {
                d.value += edButtons[c].tagStart;
                edAddTag(c)
            } else {
                d.value += edButtons[c].tagEnd;
                edRemoveTag(c)
            }
            d.focus()
        }
    }
}
function edInsertContent(d, c) {
    var e,
    b,
    a,
    f;
    if (document.selection) {
        d.focus();
        e = document.selection.createRange();
        e.text = c;
        d.focus()
    } else {
        if (d.selectionStart || d.selectionStart == "0") {
            b = d.selectionStart;
            a = d.selectionEnd;
            f = d.scrollTop;
            d.value = d.value.substring(0, b) + c + d.value.substring(a, d.value.length);
            d.focus();
            d.selectionStart = b + c.length;
            d.selectionEnd = b + c.length;
            d.scrollTop = f
        } else {
            d.value += c;
            d.focus()
        }
    }
}
function edInsertLink(d, c, b) {
    var content = document.getElementById('content');
    if (!b) {
        b = "http://";
    }
    if (!edCheckOpenTags(c)) {
      var a = prompt('Enter url', b);
        if (a) {
          if (!mdqt_getSelection(d)) {
            edButtons[c].tagStart = '[' + prompt('Link text','') + '](' + a + ')';
            edButtons[c].tagEnd = '';
            edInsertTag(d, c);
            // edButtons[c].tagStart = '[';
            // edButtons[c].tagEnd = '](' + a + ')';
            // edInsertTag(d, c);
          } else {
            edButtons[c].tagStart = '[';
            edButtons[c].tagEnd = '](' + a + ')';
            edInsertTag(d, c);
          }
        }
    } else {
        edInsertTag(d, c);
    }
}
function edInsertImage(b) {
    var a = prompt('Enter image url', "http://");
    if (a) {
        var parts = a.split('/');
        parts = parts[parts.length - 1].split('.');
        parts.pop();
        var def = parts.join('.');
        a = '![' + prompt('Enter image description', def) + '](' + a + ')';
        edInsertContent(b, a)
    }
}
var QTags = function(a, c, b, f) {
    var j = this,
    k = document.getElementById(b),
    g,
    l,
    e,
    h,
    d;
    j.Buttons = [];
    j.Links = [];
    j.OpenTags = [];
    j.Canvas = document.getElementById(c);
    if (!j.Canvas || !k) {
        return
    }
    f = (typeof f != "undefined") ? "," + f + ",": "";
    j.edShowButton = function(n, m) {
        if (f && (f.indexOf("," + n.display + ",") != -1)) {
            return ""
        } else {
            if (n.id == a + "_img") {
                return '<input type="button" id="' + n.id + '" accesskey="' + n.access + '" class="ed_button" onclick="edInsertImage(' + a + '.Canvas);" value="' + n.display + '" />'
            } else {
                if (n.id == a + "_link") {
                    return '<input type="button" id="' + n.id + '" accesskey="' + n.access + '" class="ed_button" onclick="' + a + ".edInsertLink(" + m + ');" value="' + n.display + '" />'
                } else {
                    return '<input type="button" id="' + n.id + '" accesskey="' + n.access + '" class="ed_button" onclick="' + a + ".edInsertTag(" + m + ');" value="' + n.display + '" />'
                }
            }
        }
    };
    j.edAddTag = function(i) {
        if (j.Buttons[i].tagEnd != "") {
            j.OpenTags[j.OpenTags.length] = i;
            document.getElementById(j.Buttons[i].id).value = "/" + document.getElementById(j.Buttons[i].id).value
        }
    };
    j.edRemoveTag = function(i) {
        for (g = 0; g < j.OpenTags.length; g++) {
            if (j.OpenTags[g] == i) {
                j.OpenTags.splice(g, 1);
                document.getElementById(j.Buttons[i].id).value = document.getElementById(j.Buttons[i].id).value.replace("/", "")
            }
        }
    };
    j.edCheckOpenTags = function(n) {
        l = 0;
        for (var m = 0; m < j.OpenTags.length; m++) {
            if (j.OpenTags[m] == n) {
                l++
            }
        }
        if (l > 0) {
            return true
        } else {
            return false
        }
    };
    this.edCloseAllTags = function() {
        var i = j.OpenTags.length;
        for (var m = 0; m < i; m++) {
            j.edInsertTag(j.OpenTags[j.OpenTags.length - 1])
        }
    };
    this.edQuickLink = function(o, p) {
        if (o > -1) {
            var n = "",
            m;
            m = '[' + Links[o].display + '](' + Links[o].URL + ")";
            p.selectedIndex = 0;
            edInsertContent(j.Canvas, m)
        } else {
            p.selectedIndex = 0
        }
    };
    j.edInsertTag = function(o) {
        if (document.selection) {
            j.Canvas.focus();
            d = document.selection.createRange();
            if (d.text.length > 0) {
                d.text = j.Buttons[o].tagStart + d.text + j.Buttons[o].tagEnd
            } else {
                if (!j.edCheckOpenTags(o) || j.Buttons[o].tagEnd == "") {
                    d.text = j.Buttons[o].tagStart;
                    j.edAddTag(o)
                } else {
                    d.text = j.Buttons[o].tagEnd;
                    j.edRemoveTag(o)
                }
            }
            j.Canvas.focus()
        } else {
            if (j.Canvas.selectionStart || j.Canvas.selectionStart == "0") {
                var n = j.Canvas.selectionStart,
                m = j.Canvas.selectionEnd,
                q = m,
                p = j.Canvas.scrollTop;
                if (n != m) {
                    j.Canvas.value = j.Canvas.value.substring(0, n) + j.Buttons[o].tagStart + j.Canvas.value.substring(n, m) + j.Buttons[o].tagEnd + j.Canvas.value.substring(m, j.Canvas.value.length);
                    q += j.Buttons[o].tagStart.length + j.Buttons[o].tagEnd.length
                } else {
                    if (!j.edCheckOpenTags(o) || j.Buttons[o].tagEnd == "") {
                        j.Canvas.value = j.Canvas.value.substring(0, n) + j.Buttons[o].tagStart + j.Canvas.value.substring(m, j.Canvas.value.length);
                        j.edAddTag(o);
                        q = n + j.Buttons[o].tagStart.length
                    } else {
                        j.Canvas.value = j.Canvas.value.substring(0, n) + j.Buttons[o].tagEnd + j.Canvas.value.substring(m, j.Canvas.value.length);
                        j.edRemoveTag(o);
                        q = n + j.Buttons[o].tagEnd.length
                    }
                }
                j.Canvas.focus();
                j.Canvas.selectionStart = q;
                j.Canvas.selectionEnd = q;
                j.Canvas.scrollTop = p
            } else {
                if (!j.edCheckOpenTags(o) || j.Buttons[o].tagEnd == "") {
                    j.Canvas.value += Buttons[o].tagStart;
                    j.edAddTag(o)
                } else {
                    j.Canvas.value += Buttons[o].tagEnd;
                    j.edRemoveTag(o)
                }
                j.Canvas.focus()
            }
        }
    };
    this.edInsertLink = function(o, n) {
        if (!n) {
            n = "http://";
        }
        if (j.edCheckOpenTags(o)) {
            var m = prompt('Enter url', n);
            if (m) {
                j.Buttons[o].tagStart = '[';
                j.Buttons[o].tagEnd = '](' + m + ')';
                j.edInsertTag(o);
            }
        } else {
            j.edInsertTag(o);
        }
    };
    this.edInsertImage = function() {
        var i = prompt('Enter image URL', "http://");
        if (i) {
            i = '![' + prompt('Enter image description', "") + '](' + i + ')';
            edInsertContent(j.Canvas, i)
        }
    };
    j.Buttons[j.Buttons.length] = new edButton(a + "_strong", "b", "**", "**", "b");
    j.Buttons[j.Buttons.length] = new edButton(a + "_em", "i", "*", "*", "i");
    j.Buttons[j.Buttons.length] = new edButton(a + "_link", "link", "[", "", "a");
    j.Buttons[j.Buttons.length] = new edButton(a + "_block", "b-quote", "\n\n> ", "\n\n", "q");
    j.Buttons[j.Buttons.length] = new edButton(a + "_del", "del", '<del datetime="' + datetime + '">', "</del>", "d");
    j.Buttons[j.Buttons.length] = new edButton(a + "_ins", "ins", '<ins datetime="' + datetime + '">', "</ins>", "s");
    j.Buttons[j.Buttons.length] = new edButton(a + "_img", "img", "", "", "m", -1);
    j.Buttons[j.Buttons.length] = new edButton(a + "_ul", "ul", "* ", "", "u");
    j.Buttons[j.Buttons.length] = new edButton(a + "_ol", "ol", "1. ", "", "o");
    j.Buttons[j.Buttons.length] = new edButton(a + "_code", "code", "`", "`", "c");
    j.Buttons[j.Buttons.length] = new edButton(a + "_more", "more", "<!--more-->", "", "t", -1);
    e = document.createElement("div");
    e.id = a + "_qtags";
    h = '<div id="' + a + '_toolbar">';
    for (g = 0; g < j.Buttons.length; g++) {
        h += j.edShowButton(j.Buttons[g], g)
    }
    h += '<input type="button" id="' + a + '_ed_spell" class="ed_button" onclick="edSpell(' + a + '.Canvas);" title="' + 'Look up in dictionary' + '" value="' + 'Lookup' + '" />';
    h += '<input type="button" id="' + a + '_ed_close" class="ed_button" onclick="' + a + '.edCloseAllTags();" title="' + 'Close all tags' + '" value="' + 'close all' + '" /></div>';
    e.innerHTML = h;
    k.parentNode.insertBefore(e, k)
};
function isUrl(s) {
	var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
	return regexp.test(s);
}
function edInsertRefLink(d, c, b) {

    if (jQuery('#selectmenu').length)
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
          if (!/\/$/.test(link))
            link = link + '/';
          var link = link.split('//')[1].split('/')[0];
          links.push(link);
        }
        if (refs.length > 1) {
          var output = "<div id=\"reflinkwrap\"><button id=\"selectcancel\">cancel</button><select id=\"selectmenu\">\n<option value=\"\">Please select a reference</option>\n";
          for (var e in refs) {
            output += "<option value=\""+refs[e]+"\">" + refs[e] + " ("+links[e]+")</option>\n";
          }
          output += "</select></div>";
          // tb_show("Select a reference","/wp-content/plugins/WP-Markdown-QuickTags/choice.html");
          jQuery('#ed_reflink').after(output);
          jQuery('#reflinkwrap').slideDown('fast',function(){ jQuery('#selectmenu').focus(); });
          // jQuery('#selectform').html(output);
          jQuery('#selectcancel').click(function(e){
            e.preventDefault();
            jQuery('#reflinkwrap').slideUp('fast',function(){ jQuery(this).remove(); });
            return false;
          });
          jQuery('#selectmenu').change(function(){
            a = jQuery(this).val();            
            jQuery('#reflinkwrap').slideUp('fast',function(){ 
              jQuery(this).remove(); 
              if (a != "")
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
        edInsertTag(d, c);
    }
}
function edInsertRefLinkCallback(a,d,c,b) {
  if (!mdqt_getSelection(d)) {
    var caret = getCaret(d);
    var nextchar = d.value.substring(caret,caret+1);
    var prevchar = d.value.substring(caret,caret-1);
    if (nextchar == ']' && prevchar == '[') {
      edInsertContent(d,a);
    } else {
      var linktext = prompt('Link text','');
      if (linktext == null)
        return;
      edButtons[c].tagStart = '[' + linktext + '][' + a + ']';
      edButtons[c].tagEnd = '';
      edInsertTag(d, c);
    }
  } else {
    edButtons[c].tagStart = '[';
    edButtons[c].tagEnd = '][' + a + ']';
    edInsertTag(d, c);
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
        edInsertTag(d, c);
        // edButtons[c].tagStart = '[';
        // edButtons[c].tagEnd = '](' + a + ')';
        // edInsertTag(d, c);
      } else {
        if (!title)
          title = prompt('Reference Title','') || '';
        var out = '[' + title + ']: ' + url;
        edInsertContent(d, out);
      }
    } else {
      edInsertTag(d, c);
    }
}
function process_list(text,type) {
  var li = (type == undefined || type.replace(/^\s+/,'') == 'u') ? '*' : '1.';
  var lines = text.replace(/\n\s*\n/g,'\n').split('\n');
  if ((/^\s*([\*\-\+] )/.test(lines[0]) && li == '*')||(/^\s*(\d\. )/.test(lines[0]) && li == '1.')) {
    for (var l in lines) {
      lines[l] = lines[l].replace(/(\s*)(?:[\*\-\+]|\d\.) (.*)/,"$1$2");
    }
    return lines.join("\n");
  }
  for (var l in lines) {
    if (li == '*') {
      if (/^\s*\d\. /.test(lines[l])) {
        lines[l] = lines[l].replace(/^(\s*)\d\. (.*)/,"$1* $2");
      } else if (/^\s*[^\*\-\+]/.test(lines[l])) {
        lines[l] = lines[l].replace(/(\s*)(.*)/,"$1* $2");
      } else if (/^\s*(\* )/.test(lines[l])) {
        // lines[l] = lines[l].replace(/(\s*)\* (.*)/,"$1$2");
      }
    } else {
      if (/^\s*[\*\-\+] /.test(lines[l])) {
        lines[l] = lines[l].replace(/(\s*)[\*\-\+] (.*)/,"$11. $2");
      } else if (/^\s*[^(\d\. )]/.test(lines[l])) {
        lines[l] = lines[l].replace(/(\s*)(.*)/,"$11. $2");
      } else if (/^\s*(\d\. )/.test(lines[l])) {
        // lines[l] = lines[l].replace(/(\s*)\d\. (.*)/,"$1$2");
      }
    }
  }
  return lines.join("\n");
}
function edMakeList(d,c, type) {
  var listsel = getSelectionCoord(d), newend = listsel.end;
    if (document.selection) {
        d.focus();
        var e = document.selection.createRange();
        if (e.text.length > 0) {
            
            e.text = process_list(e.text,type);
        } else {
            if (!edCheckOpenTags(c) || edButtons[c].tagEnd == "") {
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
                caret = getCaret(d);
                if (!edCheckOpenTags(c) || edButtons[c].tagEnd == "") {
                    d.value = d.value.substring(0, b) + edButtons[c].tagStart + d.value.substring(a, d.value.length);
                    edAddTag(c);
                    g = b + edButtons[c].tagStart.length
                } else {
                    d.value = d.value.substring(0, b) + edButtons[c].tagEnd + d.value.substring(a, d.value.length);
                    edRemoveTag(c);
                    g = b + edButtons[c].tagEnd.length
                }
                setCaret(d,caret + edButtons[c].tagStart.length);
                return false;
            }
            // d.focus();
            // d.selectionStart = g;
            // d.selectionEnd = g;
            d.scrollTop = f;
        } else {
            caret = getCaret(d);
            if (!edCheckOpenTags(c) || edButtons[c].tagEnd == "") {
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
}
var uniquenames = new Array();
function contains(a, e) {
	for(j=0;j<a.length;j++){if(a[j]==e){return true;}};
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
};
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
  var matches = jQuery('#content').val().match(/\[(.*?)\]: (.*)/gi);
  if (matches) {
    for (var m in matches) {
      uniquenames.push(/\[(.*?)\]: (.*)/.exec(matches[m])[1]);
    }
  }
}
function makeRefs(urls) {
  var d = jQuery('#content').get(0);
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
  	var currPos = getCaret(d) + 1;
    edInsertContent(d,res.join("\n"));
    var firstName = /\[([^\]]+)\]/.exec(res[0])[1];
    mdqt_setSelection(d,currPos,currPos+firstName.length);
    return true;
  }
  return false;
}

function edPasteRefs(d,c) {
  var sel = mdqt_getSelection(d);
  if (sel) {
    edInsertRef(d,c,null);
    return false;
  }
  jQuery( "#urlpaste" ).dialog( "open" );
}

// GetCaret via CMS http://stackoverflow.com/users/5445/cms
// http://stackoverflow.com/questions/263743/how-to-get-cursor-position-in-textarea
function getCaret(el) { 
  if (el.selectionStart) { 
    return el.selectionStart; 
  } else if (document.selection) { 
    el.focus(); 

    var r = document.selection.createRange(); 
    if (r == null) { 
      return 0; 
    } 

    var re = el.createTextRange(), 
        rc = re.duplicate(); 
    re.moveToBookmark(r.getBookmark()); 
    rc.setEndPoint('EndToStart', re); 

    return rc.text.length; 
  }  
  return 0; 
}
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
function getSelorCaret(el) {
  var coords = getSelectionCoord(el);
  if (coords && typeof coords !== 'object') {
      d = document.selection.createRange();
      if (d.text.length > 0) {
        return d.text;
      } else {
        return getCaret(el);
      }
  } else {      
    if (coords.start !== coords.end) {
      return coords;
    } else {
      return getCaret(el);
    }
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

function getSelectionCoord(el) {
  if (el.selectionStart || el.selectionStart == 0) {
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


(function( $ ){
  $.mdqt_init = function(options) {
    $content = $('#content');
    content = $content.get(0);
    for (var a = 0; a < edButtons.length; a++) {
        edShowButton(edButtons[a], a);
    }
    
    $('<div id="preview" />').css({'height': jQuery('div.postarea').height() - 110,'overflow':'auto','display':'none'}).appendTo($('#editorcontainer'));

    $('<div id="utils" />').append($('<a href="#">Markdownify</a>').click(function(e){
      e.preventDefault();
      $this = $(this);
      takeSnapshot($content.val(),getSelorCaret(content));
      if ($this.text() == 'Markdownify') {
        $('#mdqt_loader').fadeIn('fast');
        $.post(ajaxurl,{action:'markdownify',input:$('#content').val()},function(json){
          $('#mdqt_loader').fadeOut('fast');
          $('#content').val(json.markdown);
        },"json");
      }
      return false;
    })).append($('<a href="#">Render</a>').click(function(e){
      e.preventDefault();
      $this = $(this);
      takeSnapshot($content.val(),getSelorCaret(content));
      if ($this.text() == 'Render') {
        $('#mdqt_loader').fadeIn('fast');
        $.post(ajaxurl,{action:'markdown',input:$('#content').val(),type:'render'},function(json){
          $('#mdqt_loader').fadeOut('fast');
          $('#content').val(json.html);
        },"json");
      }
      return false;
    })).append($('<a href="#" id="redobutton">Redo</a>').click(function(e){
      e.preventDefault();
      undoForward();
      return false;
    })).append($('<a href="#" id="undobutton">Undo</a>').click(function(e){
      e.preventDefault();
      undoBack();
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
              var content = $('#content').val();
        var cheight = $('#content').height();
        $('div.postarea').data('contentval',$('#content').val());
        $('div.postarea #utils').fadeOut('fast');
        $('#editorcontainer').height($('div.postarea').height() - 52);
        $('#content').fadeOut('fast',function(){
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
        $('#content').fadeIn();
      }
      return false;
    }).appendTo($('#ed_button_container'));

    $('<input type="button" id="fullscreenbutton" title="Full Screen Editor"/>').click(function(e){
      e.preventDefault();
      if (!$(this).hasClass('activeutil')) {      
        $(this).addClass('activeutil');
        $('<div id="fullscreenoverlay" />')
          .css({'display':'none','background':options.fullscreenbg,'opacity':options.fullscreenbgopacity})
          .insertBefore($('div.postarea')).fadeIn();
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
          $('#content').css('height',$('div.postarea').height() - 95);          
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
    
    $('<form id="urlpaste" title="Paste text with one or more urls in it..."/>').css({display:'none',textAlign:'center'}).append($('<textarea />')).appendTo($('#ed_toolbar'));
    $( "#urlpaste" ).dialog({
			autoOpen: false,
			height: 400,
			width: 500,
			modal: true,
			draggable: true,
			resizable: false,
			buttons: {
				"Paste links": function() {
					$( this ).dialog( "close" );
					makeRefs($(this).children('textarea').val());
					$(this).children('textarea').val('');
				},
				Cancel: function() {
					$( this ).dialog( "close" );
				}
			}
		});
    
    if (options.showlookup)
      $('#ed_button_container').append('<input type="button" id="ed_spell" class="ed_button" onclick="edSpell(edCanvas);" title="' + 'Dictionary lookup' + '" value="' + 'lookup' + '" />');
    // document.write('<input type="button" id="ed_close" class="ed_button" onclick="edCloseAllTags();" title="' + 'Close all open tags' + '" value="' + 'close all' + '" />');
    if (options.tabsize)
      $.fn.tabOverride.setTabSize(options.tabsize);
    if (options.showtooltips)
      $('#ed_toolbar input, #helpbutton').tipsy({fade: true,gravity:'s'});
    if (options.font)
      $('#content').css({'font-family':options.font});
    if (options.fontsize)
      $('#content').css({'font-size':options.fontsize+'px'});
    $('#content').bindKeys().bind('textchange', function () {
      if (!undoing) {
        clearTimeout(snaptimeout);
        var self = this;
        snaptimeout = setTimeout(function () {
          takeSnapshot($content.val(),getSelorCaret(content));
        }, 100);
      }
    });
    takeSnapshot($content.val(),getSelorCaret(content));
    $('#mdqt_loader').fadeOut('fast');
  }
})(jQuery);

jQuery(document).ready(function($) {
  $('<div id="mdqt_loader" />').appendTo($('.postarea')).fadeIn('fast');
  
  $.getJSON(ajaxurl,{action:'mdqt_options'},function(json){
    $.mdqt_init(json);
  });
});
function takeSnapshot(content,coords) {
  if (snapshots[snapshots.length - 1] !== content) {
    snapshots.push([content,coords]);
    if (snapshots.length >= 100) {
      snapshots = snapshots.slice(-100,snapshots.length);
    }
    jQuery('#undobutton').css('background','#92bd76');
    clearInterval(snaptimer);
    snaptimer = setTimeout(function(){
      jQuery('#undobutton').css('background','none');
    },250);
  }
}
function undoBack() {
  if (snapshots.length > 0) {
    if (undoing == false)
      snapshots.pop();
    undoing = true;
    $content = jQuery('#content');
    var newcontent = snapshots.pop();
    snapshotsFwd.push([$content.val(),getSelorCaret($content.get(0))]);
    $content.val(newcontent[0]);
    if (typeof newcontent[1] !== 'object') {
      setCaret($content.get(0),newcontent[1]);
    } else {
      mdqt_setSelection($content.get(0),newcontent[1].start,newcontent[1].end)
    }
  }
}

function undoForward() {
  if (snapshotsFwd.length > 0) {
    undoing = true;
    $content = jQuery('#content');
    var newcontent = snapshotsFwd.pop();
    snapshots.push([$content.val(),getSelorCaret($content.get(0))]);
    $content.val(newcontent[0]);
    if (typeof newcontent[1] !== 'object') {
      setCaret($content.get(0),newcontent[1]);
    } else {
      mdqt_setSelection($content.get(0),newcontent[1].start,newcontent[1].end)
    }
  }
}

function restoreSnapshot() {
  if (jQuery('#undobutton').text() == 'Revert')
    jQuery('#undobutton').text('Redo');
  else
    jQuery('#undobutton').text('Revert');
  var cursor = getCaret(jQuery('#content').get(0));
  var temp = jQuery('#content').val();
  jQuery('#content').val(snapshots);
  snapshots = temp;
  setCaret(jQuery('#content').get(0),cursor - (snapshots.length - jQuery('#content').val().length));
}
function insertPair(c,pair) {
  takeSnapshot(jQuery(c).val(),getSelorCaret(c));
  var caret = getCaret(c);
  var sel = mdqt_getSelection(c);
  var newcontent = sel ? pair[0]+sel+pair[1] : pair.join('');
  var newcaret = sel ? caret + newcontent.length : caret + 1;
  edInsertContent(c,newcontent);
  if (pair[0].length > 1) {
    mdqt_setSelection(c,caret+1,caret+pair[0].length);
  } else {
    setCaret(c,newcaret);
  }
}

(function( $ ){
  $.fn.getRefs = function() {
    var matches = $(this).val().match(/\[([^\]]+)\]\: (.*)/gi),a;
    if (matches) {        
      var refs = new Array();
      for (var i in matches) { 
        refs.push(/\[([^\]]+)\]/.exec(matches[i])[1]);
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
  }
  
  $.fn.bindKeys = function(options) {
    return this.each(function(){      
      $(this).unbind('keydown').unbind('keyup').bind('keydown',function(ev){
        if (!ev.ctrlKey && !ev.metaKey && !ev.altKey) {
          undoing = false;
          snapshotsFwd = [];
        }
        var contentEl = $(this).get(0),
        code = (ev.keyCode ? ev.keyCode : ev.which),
        caret = getCaret(contentEl),
        completing = false,
        nextchar = contentEl.value.substring(caret,caret+1),
        prevchar = contentEl.value.substring(caret,caret-1);
        if (completing == false && prevchar == '[' && nextchar == ']') {
          if (contentEl.value.substring(caret-1,caret-2) == ']') {
            $(this).unbind('keydown').unbind('keyup').createSuggest();
            return true;
          }
        } else if (completing == true && nextchar !== ']'){
          completing = false;
          $(this).bindKeys();
          return true;
        }
        switch (code) {
          case 8: // backspace
            if ((/(\[\]|\(\)|""|''|``|<>)/).test(prevchar + nextchar)) {
              ev.preventDefault();
              var contents = $(contentEl).val();
              var before = contents.substring(0,caret - 1);
              var after = contents.substring(caret + 1,contents.length);
              $(contentEl).val(before+after);
              setCaret(contentEl,caret - 1);
              return false;
            } else {
              return true;
            }
            break;
          case 219: // [
          case 57: // 9 || (
          case 188: // , || <
          case 222: // ' || "
          case 192: // `
            if (!ev.ctrlKey && !ev.altKey) {
              var pair;
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
                if (!mdqt_getSelection(contentEl)) {
                  
                  if (nextchar == thechar) {
                    ev.preventDefault();
                    setCaret(contentEl,caret + 1);
                    return false;
                  } else if (/\S/.test(prevchar)) {
                    return true;
                  }
                }
              }
              ev.preventDefault();
              insertPair(contentEl,pair);
              return false;
            }
            break;
          case 221: // ]
          case 48: // 0 || )
          case 190: // . || >
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
              var caret = getCaret(contentEl);
              if (mdqt_getSelection(contentEl))
                return true;              
              if (nextchar == thechar) {
                setCaret(contentEl,caret + 1);
              } else {
                edInsertContent(contentEl,thechar);
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
              var cursorloc = getCaret(contentEl);
              if (mdqt_getSelection(contentEl)) {
                var type = ['u',9];
                if (!ev.shiftKey && (code == 49))
                  type = ['o',10];
                ev.preventDefault();
                edMakeList(contentEl,type[1],type[0]);
                // start = /\d/.test(startchar) ? startchar + '. ' : startchar + ' ';
                // newcontent = start + sel.split('\n').join("\n"+start);
                // edInsertContent(contentEl,newcontent);
                // setCaret(contentEl,cursorloc);
                return false;
              }
            }
            return true;
            break;
          case 90: // z
            if (ev.ctrlKey || ev.metaKey) { // && jQuery.browser.safari
              ev.preventDefault();
              if (ev.shiftKey)
                undoForward();
              else
                undoBack();
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
            var grafs = $(contentEl).val().split("\n");
            var total = 0;
            if (/\n/.test(prevchar)) {
              ev.preventDefault();
              edInsertContent(contentEl,"\n");
              return false;
            }
            if (ev.metaKey) {
              for (var graf in grafs) {
                if ((caret > total && caret < total + grafs[graf].length + 1) || caret == total) {
                  var bef = grafs.slice(0, Number(graf) + 1).join("\n");
                  setCaret(contentEl,bef.length);
                  break;
                } else {
                  total += grafs[graf].length + 1;
                }
              }
            }
            caret = getCaret(contentEl);
            total = 0;
            for (var graf in grafs) {
              if ((caret > total && caret < total + grafs[graf].length + 1) || caret == total) {
                if (/^(\s*)([\-\+\*]|\d+\.)(\s*)[\w`'"\(<\[]/.test(grafs[graf])) {
                  ev.preventDefault();
                  var match = /^(\s*([\-\+\*]|\d+\.)(\s*))(.*)/.exec(grafs[graf]);
                  if (/(\d+)\./.test(match[2])) {
                    var digit = /^(\s*)(\d+)(\.\s.*)/.exec(match[1]);
                    var inc = Number(digit[2]) + 1;
                    match[1] = digit[1] + inc + digit[3];
                  } 
                  var contents = $(contentEl).val();
                  var before = contents.substring(0,caret);
                  var after = contents.substring(caret,contents.length);
                  $(contentEl).val(before+"\n"+match[1]+after);
                  setCaret(contentEl,caret + match[1].length + 1);
                  return false;
                } else if (/(\s*)([\-\+\*]|\d+\.)(\s*)$/.test(grafs[graf])) {              
                  ev.preventDefault();
                  var before = grafs.slice(0, graf).join("\n") + "\n";
                  var after = "\r\n"+grafs.slice(Number(graf) + 1, grafs.length).join("\n");
                  $(contentEl).val(before+after);
                  setCaret(contentEl,before.length);
                  return false;
                } else if (/^(\s*)(.)?/.test(grafs[graf])) {
                  ev.preventDefault();
                  var match = /^(\s*)(.*)/.exec(grafs[graf]);
                  var contents = $(contentEl).val();
                  if (match[2]) {
                    var before = contents.substring(0,caret) + "\n" + match[1];
                    var after = contents.substring(caret,contents.length);
                  } else {
                    var before = contents.substring(0,caret) + "\n";
                    var after = contents.substring(caret,contents.length);
                  }
                  $(contentEl).val(before+after);
                  setCaret(contentEl,before.length);
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
        }
      }).tabOverride();
    });
  };
})( jQuery );
var helptext = '<div id="markdownref"><h2 class="section-name">Text</h2><div class="section"><table><tr><th>Markdown</th><th>Result</th></tr><tr><td>This text is **bold**.</td><td>This text is<strong>bold</strong>.</td></tr><tr class="alternate"><td>This text is *italicized*.</td><td>This text is<em>italicized</em>.</td></tr><tr><td>`This is some code.`</td><td><code>This is some code.</code></td></tr></table></div><h2 class="section-name">Headings</h2><div class="section"><table><tr><th>Markdown</th><th>Result</th></tr><tr><td># First Header</td><td><h1>First Header</h1></td></tr><tr class="alternate"><td>## Second Header</td><td><h2>Second Header</h2></td></tr><tr><td>### Third Header</td><td><h3>Third Header</h3></td></tr></table></div><h2 class="section-name">Quotes</h2><div class="section"><table><tr class="alternate"><td>> This is the first level of quoting.<br />>>This is nested blockquote.<br />> Back to the first level.</td><td><blockquote>This is the first level of quoting.<blockquote>This is nested blockquote.</blockquote>Back to the first level.</blockquote></td></tr></table></div><h2 class="section-name">Horizontal Rules</h2><div class="section"><table><tr class="alternate"><td>- - -<br />* * *<br /></td><td><hr /></td></tr></table></div><h2 class="section-name">Links and Images</h2><div class="section"><table><tr><td>This is an [inline link](http://brettterpstra.com/contact "with an optional title").</td><td>This is an <a href="http://brettterpstra.com/contact" title="with an optional title" target="_blank">inline link</a>.</td></tr><tr class="alternate"><td>This is a [reference link][ref].<br/>[ref]: http://brettterpstra.com "with an optional title"</td><td>This is a <a href="http://brettterpstra.com">reference link</a>.</td></tr><tr><td>Send me an email at &lt;address@example.com&gt;.</td><td>Send me an email at <a href="mailto:address@example.com">address@example.com</a>.</td></tr><tr><td>![Markdown QuickTags logo](http://brettterpstra.com/markdownquicktagsicon.png)<br/>-------OR------<br/>![Reference style][logo]<br/>[logo]: http://brettterpstra.com/markdownquicktagsicon.png</td><td><img src="http://brettterpstra.com/wp-content/uploads/downloads/thumbnails/2010/11/markdownquicktagsicon.png" alt="Markdown QuickLinks logo" /></td></tr></table></div><h2 class="section-name">Lists</h2><div class="section"><table><tr><th>Markdown</th><th>Result</th></tr><tr><td>* Bulleted<br />* List<br />&nbsp;&nbsp;* Nested<br />&nbsp;&nbsp;* List<br />* Parent level</td><td><ul><li>Bulleted</li><li>List<ul><li>Nested</li><li>List</li></ul></li><li>Parent level</li></ul></td></tr><tr class="alternate"><td>1. Numbered<br />2. List<br />&nbsp;&nbsp;1. Nested<br />&nbsp;&nbsp;2. List<br />3. Parent level</td><td><ol><li>Numbered</li><li>List<ol><li>Nested</li><li>List</li></ol></li><li>Parent level</li></ol></td></tr><tr><td>1. Mixed<br />1. Type<br />1. List<br />&nbsp;&nbsp;* Nested<br />&nbsp;&nbsp;* Bulleted<br />&nbsp;&nbsp;* List<br />1. Parent level</td><td><ol><li>Mixed</li><li>Type</li><li>List<ul><li>Nested</li><li>Bulleted</li><li>List</li></ul></li><li>Parent level</li></ol></td></tr></table></div><hr /><p style="text-align:center"><small>Original reference by <a href="https://github.com/edouard/human-markdown-reference" title="">edouard</a>.</small></p></div>'
