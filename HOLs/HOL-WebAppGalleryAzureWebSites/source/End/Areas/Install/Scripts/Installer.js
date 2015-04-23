/// <reference path="/Areas/Umbraco/Scripts/Umbraco.System/NamespaceManager.js" />

Umbraco.System.registerNamespace("Umbraco.Installer");

(function ($) {

    $(document).ready(function () {
        Umbraco.Installer.init();
      
    });

    Umbraco.Installer = function() {

    function initCustomForm()
    {
        $('select.sel').selectmenu();
    }

    function initButtonHover() {
        if (typeof document.body.style.maxHeight == 'undefined') ie6 = true;
        else ie6 = false;
        var inputs = document.getElementsByTagName("input");
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].type == "image" && inputs[i].className.indexOf("nohover") == -1) {
                if (ie6) {
                    if (inputs[i].src.indexOf(".png") != -1) {
                        var src = inputs[i].src;
                        inputs[i].path = inputs[i].src;
                        inputs[i].src = "images/none.gif";
                        inputs[i].runtimeStyle.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + src + "',sizingMethod='scale')";
                    }
                }
                inputs[i].onmouseover = function () {
                    if (this.path && ie6) this.runtimeStyle.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + this.path.replace(this.path, this.path.substr(0, this.path.lastIndexOf(".")) + "-hover" + this.path.substr(this.path.lastIndexOf("."))) + "',sizingMethod='scale')";
                    else this.src = this.src.replace(this.src, this.src.substr(0, this.src.lastIndexOf(".")) + "-hover" + this.src.substr(this.src.lastIndexOf(".")));
                }
                inputs[i].onmouseout = function () {
                    if (this.path && ie6) this.runtimeStyle.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + this.path + "',sizingMethod='scale')";
                    this.src = this.src.replace("-hover", "");
                }
            }
        }
    }

    function clearInputs() {
        jQuery('input:text, input:password, textarea').each(function () {
            var _el = jQuery(this);
            _el.data('val', _el.val());
            _el.bind('focus', function () {
                if (_el.val() == _el.data('val')) _el.val('');
            }).bind('blur', function () {
                if (_el.val() == '') _el.val(_el.data('val'));
            });
        });
    }

    function ieHover(_selector, _class) {
        if (_class == null) _class = 'hover';
        if (jQuery.browser.msie && jQuery.browser.version < 7) {
            jQuery(_selector).each(function () {
                jQuery(this).mouseenter(function () {
                    jQuery(this).addClass(_class)
                }).mouseleave(function () {
                    jQuery(this).removeClass(_class)
                })
            })
        }
    }

    function initZoomList() {
        var _speed = 250;
        jQuery('.zoom-list').each(function () {
            var set = jQuery(this);
            var link = set.find('ul > li');
            var zoomImg = link.find('.zoom-img');
            var imgWidth = zoomImg.width();
            var imgHeight = zoomImg.height();
            var stepZoom = 60;
            var dropBox = set.find('.drop-hold');
            if (jQuery.browser.msie && jQuery.browser.version < 7) {
                return;
            }
            else {
                link.hover(
				    function () {
				        zoomImg = jQuery(this).find('.zoom-img');
				        zoomImg.animate({
				            width: 202,
				            height: 275,
				            top: -stepZoom / 2,
				            left: -stepZoom / 2
				        }, { queue: false, duration: _speed });
				    },
				    function () {
				        zoomImg.animate({
				            width: imgWidth,
				            height: imgHeight,
				            top: 0,
				            left: 0
				        }, { queue: false, duration: _speed, complete: function () { zoomImg.removeAttr('style') } });
				    }
			    )
                dropBox.bind('mouseout', function () {
                    zoomImg.animate({
                        width: imgWidth,
                        height: imgHeight,
                        top: 0,
                        left: 0
                    }, { queue: false, duration: _speed, complete: function () { zoomImg.removeAttr('style') } });
                })
            }
        })
    }

    function initZoomList2() {
        var _speed = 250;
        jQuery('.zoom-list2').each(function () {
            var set = jQuery(this);
            var link = set.find('.image-hold');
            var faikMask = link.find('.faik-mask');
            var faikMaskIE6 = link.find('.faik-mask-ie6');
            var zoomImg = link.find('.zoom-img');
            var maskWidth = faikMask.width();
            var maskHeight = faikMask.height();
            var imgWidth = zoomImg.width();
            var imgHeight = zoomImg.height();
            var stepZoom = 44;
            var dropBox = link.find('.gal-drop');
            dropBox.css({ top: 12, left: 12 }).hide();
            var timer;
            if (jQuery.browser.msie && jQuery.browser.version < 7) {
                link.hover(
				    function () {
				        dropBox.removeAttr('style').hide();
				        faikMask = jQuery(this).find('.faik-mask');
				        faikMaskIE6 = jQuery(this).find('.faik-mask-ie6');
				        zoomImg = jQuery(this).find('.zoom-img');
				        dropBox = jQuery(this).find('.gal-drop');
				        dropBox.css({
				            top: 12,
				            left: 12
				        }).show();
				        faikMask.hide();
				        jQuery(this).css({
				            marginTop: -stepZoom / 4,
				            marginLeft: -stepZoom / 4
				        });
				        faikMaskIE6.css({
				            top: 0,
				            left: 0
				        })
				        zoomImg.css({
				            width: imgWidth + stepZoom,
				            height: imgHeight + stepZoom - 10,
				            marginTop: 10,
				            marginLeft: 3,
				            marginBottom: -stepZoom
				        });
				    },
				    function () {
				        dropBox.removeAttr('style').hide();
				        faikMask.show();
				        jQuery(this).css({
				            marginTop: 0,
				            marginLeft: 0
				        });
				        faikMaskIE6.css({
				            top: -9999,
				            left: -9999,
				            marginBottom: 0
				        })
				        zoomImg.css({
				            width: imgWidth,
				            height: imgHeight,
				            top: 0,
				            left: 0,
				            marginTop: 0,
				            marginLeft: 0,
				            marginBottom: 0
				        });
				    }
			    )
                set.bind('mouseleave', function () {
                    if (timer) clearTimeout(timer);
                    dropBox.removeAttr('style').hide();
                })
                dropBox.hover(
				    function () {
				        if (timer) clearTimeout(timer);
				        jQuery(this).show();
				    },
				    function () {
				        if (timer) clearTimeout(timer);
				        dropBox.removeAttr('style').hide();
				    }
			    )
            }
            else {
                link.hover(
				    function () {
				        if (timer) clearTimeout(timer);
				        dropBox.stop().hide();
				        faikMask = jQuery(this).find('.faik-mask').removeAttr('style');
				        zoomImg = jQuery(this).find('.zoom-img').removeAttr('style');
				        dropBox = jQuery(this).find('.gal-drop').hide();
				        //Image holder animate
				        jQuery(this).animate({
				            marginTop: -stepZoom / 4,
				            marginLeft: -stepZoom / 4
				        }, { queue: false, duration: _speed });
				        //Zoom mask
				        timer = setTimeout(function () {
				            dropBox.fadeIn(_speed);
				        }, _speed)
				        faikMask.animate({
				            width: maskWidth + stepZoom + 5,
				            height: maskHeight + stepZoom + 5,
				            top: -stepZoom / 2,
				            left: -stepZoom / 2,
				            marginBottom: -stepZoom
				        }, { queue: false, duration: _speed });
				        //Zoom image
				        zoomImg.animate({
				            width: imgWidth + stepZoom,
				            height: imgHeight + stepZoom - 10,
				            marginTop: 5,
				            marginLeft: 3,
				            marginBottom: -stepZoom
				        }, { queue: false, duration: _speed });
				        if (jQuery.browser.msie && jQuery.browser.version == 7) {
				            zoomImg.animate({
				                width: imgWidth + stepZoom,
				                height: imgHeight + stepZoom - 10,
				                marginTop: 11,
				                marginLeft: 3,
				                marginBottom: -stepZoom
				            }, { queue: false, duration: _speed });
				        }
				    },
				    function () {
				        if (timer) clearTimeout(timer);
				        dropBox.hide();
				        jQuery(this).animate({
				            marginTop: 0,
				            marginLeft: 0
				        }, { queue: false, duration: _speed });
				        faikMask.animate({
				            width: maskWidth,
				            height: maskHeight,
				            top: 0,
				            left: 0,
				            marginTop: 0,
				            marginLeft: 0,
				            marginBottom: 0
				        }, { queue: false, duration: _speed, complete: function () { faikMask.removeAttr('style') } });

				        zoomImg.animate({
				            width: imgWidth,
				            height: imgHeight,
				            top: 0,
				            left: 0,
				            marginTop: 0,
				            marginLeft: 0,
				            marginBottom: 0
				        }, { queue: false, duration: _speed, complete: function () { zoomImg.removeAttr('style') } });
				    }
			    )
                set.bind('mouseleave', function () {
                    if (timer) clearTimeout(timer);
                    dropBox.hide();
                    link.animate({
                        marginTop: 0,
                        marginLeft: 0
                    }, { queue: false, duration: _speed });
                    faikMask.animate({
                        width: maskWidth,
                        height: maskHeight,
                        top: 0,
                        left: 0,
                        marginTop: 0,
                        marginLeft: 0,
                        marginBottom: 0
                    }, { queue: false, duration: _speed, complete: function () { faikMask.removeAttr('style') } });
                    zoomImg.animate({
                        width: imgWidth,
                        height: imgHeight,
                        top: 0,
                        left: 0,
                        marginTop: 0,
                        marginLeft: 0,
                        marginBottom: 0
                    }, { queue: false, duration: _speed, complete: function () { zoomImg.removeAttr('style') } });
                })
            }
        })
    }

    function initSlide() {
        jQuery('.gallery').each(function () {
            var set = jQuery(this);
            var btnPrev = set.find('.btn-prev');
            var btnNext = set.find('.btn-next');
            var slider = set.find('.gal-box');
            var swicher = set.find('.swicher');
            swicher.empty();

            //numberOfSkins is a global varibale injected into the page by the loadStarterkitDesigns usercontrol
            if (numberOfSkins < 5) {
                btnPrev.hide();
                btnNext.hide();
            }

            slider.cycle({
                fx: 'scrollHorz',
                timeout: 5000,
                prev: btnPrev,
                next: btnNext,
                autostopCount: 1,
                autostop: 1,
                manualTrump: false,
                pager: swicher,
                activePagerClass: 'active',
                pagerAnchorBuilder: function (index) {
                    return '<li><a href="#">' + (index + 1) + '</a></li>';
                }
            });
        })
    }

    function initProgressBar() {
        Umbraco.Installer.updateProgressBar(0, '.progress-bar');
    }

    function initLightBox() {
        jQuery('a.btn-preview').simpleLightbox({
            faderOpacity: 0.7,
            faderBackground: '#000000',
            closeLink: 'a.btn-close-box',
            onClick: function () {
                var link = jQuery(this);
                var title = link.attr("title");
                var desc = link.siblings("div.gal-desc").html();
                var owner = link.siblings("div.gal-owner").html();

                jQuery("#lightbox .title").text(title);
                jQuery("#lightbox .create").html(owner);
                jQuery("#lightbox .carusel").html(desc);

                jQuery("#lightbox footer a").click(function () {
                    var installLink = link.siblings("a.btn-install-gal");
                    //this is f'ing nasty, we'll switch to a neater solution then an updatepanel after the beta
                    eval(installLink.attr('href'));
                    installLink.click();
                });
            }
        });
    }

    function initStep() {
        jQuery('.tabset').each(function () {
            var set = jQuery(this);
            var link = set.find('ul > li');
            var ind = link.index(link.filter('.active:eq(0)'));
            link.each(function (i, el) {
                if (i < ind) link.eq(i).addClass('disable');
                else link.eq(i).removeClass('disable');
            });
            link.bind('click', function () {
                return false;
            })
        })
    }

    function initTabs() {
        jQuery('.database-hold').each(function () {
            var _list = $(this);
            var _links = _list.find('a.database-tab');
            var _select = _list.find('.sel');
            var _currentDatabase
            var selectVal;
            var selectValNew;

            _select.each(function () {
                var select = $(this);
                selectVal = select.val();

                jQuery('#database-step1').hide();
                jQuery('#database-step1-2').hide();
                jQuery('#database-step2').hide();

                select.change(function () {
                    selectValNew = jQuery(this).val();

                    toggleDatabaseOption(selectValNew);
                });
            })
            _links.each(function () {
                var _link = $(this);
                var _href = _link.attr('href');
                var _tab = jQuery(_href);

                if (_link.hasClass('active')) _tab.show();
                else _tab.hide();

                _link.click(function () {
                    _links.filter('.active').each(function () {
                        jQuery(jQuery(this).removeClass('active').attr('href')).hide();
                    });
                    _link.addClass('active');
                    _tab.show();

                    return false;
                });
            });

            toggleDatabaseOption(jQuery(".sel").val());
        });
    }

    function initSingleTab() {
        jQuery('a.single-tab').each(function () {
            var _links = jQuery(this);
            _links.each(function () {
                var _link = $(this);
                var _href = _link.attr('href');
                var _tab = $(_href);
                _tab.hide();
                _link.click(function () {
                    _links.filter('.active').each(function () {
                        $($(this).removeClass('active').attr('href')).hide();
                    });
                    _link.addClass('active');
                    _tab.show();
                    jQuery(this).parents('div.main-tabinfo').hide();
                    jQuery(this).parents('div.install-tab').hide();
                    setTimeout(function () {
                        jQuery('html').scrollTop(0)
                    }, 1)
                });
            });
            if (_links.parents('.lightbox').length) {
                jQuery('.lightbox').each(function () {
                    jQuery(this).find('.single-tab').bind('click', function () {
                        jQuery('#single-tab2').hide();
                    })
                })
            }
        })
        jQuery('.bg-main').each(function () {
            var set = jQuery(this);
            var _nav = jQuery('.add-nav > ul');
            var link = _nav.find('> li');
            var itemBg = set.find('>div');
            var itemHeight;
            var waitAnimation = true;
            if (jQuery(window).height() < jQuery('#wrapper').outerHeight(true)) itemHeight = jQuery('#wrapper').outerHeight(true);
            else itemHeight = jQuery('#wrapper').outerHeight(true);
            itemBg.css({ height: itemHeight })
            var ind = 0;
            var prevInd = ind;
            var _timer;
            var _speedAnim = 5000;
            itemBg.hide();
            itemBg.filter(':last').show();
            link.bind('click', function () {
                prevInd = ind;
                ind = link.index(this);
                itemBg.eq(ind).css({ zIndex: 10 });
                itemBg.eq(ind).fadeIn(_speedAnim);
                if (prevInd != ind) itemBg.eq(prevInd).fadeOut(_speedAnim).css({ zIndex: 1 });
            })
        })
    }
    //add by pph, updated by tg for db step refactor
    function toggleDatabaseOption(selectValNew) {

  

        var step1 = '#database-options';

        //Defensive if else to prevent this being executed on non database pages
        if (jQuery(step1).length) {

       

            var instructionText = jQuery(step1 + ' .instructionText');
            var buttonBox = jQuery('.installbtn');
       

            //hide instructions
            jQuery('#database-blank-inputs').hide();
            //instructionText.hide();
            buttonBox.hide();

            //hide all db options
            //jQuery(step1 + ' .row').hide();

            if (selectValNew != '') {
                if (selectValNew == 'MSSQL' || selectValNew == 'MySQL') {
                    jQuery('#database-blank-inputs').show();
                    //instructionText.show();
                    buttonBox.show();
                }
    //            else if (selectValNew == 'Custom') {
    //                jQuery(step1 + ' .custom').show();
    //                instructionText.show();
    //                buttonBox.show();
    //            }
    //            else if (selectValNew.indexOf('SQLCE4Umbraco') > -1 && !hasEmbeddedDlls) {
    //                jQuery(step1 + ' .embeddedError').show();
    //            }
    //            else if (selectValNew.indexOf('SQLCE4Umbraco') > -1) {
    //                jQuery(step1 + ' .embedded').show();
    //                instructionText.show();
    //                buttonBox.show();
    //            }
            }
        }
    }
    return {
        init: function() {

            initCustomForm();
            initButtonHover();
            clearInputs();
            ieHover(".add-nav ul li, .gallery .box ul li");
            initZoomList();
            initZoomList2();
            initSlide();
            initProgressBar();
            initLightBox();
            initStep();
            initTabs();
            initSingleTab();

        },

        updateProgressBar: function(percent, selector){

            $('.loader').each(function () {
                var set = $(this);
                //var _loader = set.find('.progress-bar');
                var _loader = set.find(selector);
                //var _loaderValue = set.find('.progress-bar-value');
                _loader.progressbar({
                    value: parseInt(percent)
                });
                //_loaderValue.text(percent + '%');
            })

        }
    }

    }();

})(jQuery);























