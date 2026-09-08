function waitForTemplateConfig(callback) {
    const timer = setInterval(() => {
        if (
            parent.template_config &&
            Object.keys(parent.template_config).length > 0
        ) {
            clearInterval(timer)
            callback(parent.template_config)
        }
    }, 500)
}


function initWishSlider() {

    waitForTemplateConfig(function(config) {
        // console.log('Готово:', config)
        builtWishSlider()
    })

}

function builtWishSlider(){
    // console.log('initWishSlider')

    var wishItem = '.sm-wishes__content-item';
    var wishPagination = '.sm-wishes__content-wrap_pagination';
    var wishSlider = '.sm-wishes__content-slider';
    var wishSlide = '.sm-wishes__content-slide';
    var counterId = '#counter';
    var counterSlides = '#count-slides';
    var arrowsClass = '';

    if (parent.template_config['WISH_ITEM'] && parent.template_config['WISH_ITEM'] != '') {
        wishItem = parent.template_config['WISH_ITEM'];
        wishPagination = parent.template_config['WISH_PAGINATION'];
        wishSlider = parent.template_config['WISH_SLIDER'];
        wishSlide = parent.template_config['WISH_SLIDE'];
        counterId = parent.template_config['WISH_COUNTER'];
        counterSlides = parent.template_config['WISH_SLIDES_COUNT'];
        arrowsClass = parent.template_config['WISH_SLIDER_ARROWS'];
    }

    var countSlides = 0;

    if ($(wishSlider + '.slick-initialized').length > 0) {
        $(wishSlider).slick('unslick');
    }

    // console.log('compiled mini. ' + wishPagination);
    // console.log(parent.template_config);


    // console.log(wishPagination)
    // console.log($(wishPagination));
    // console.log($(wishPagination).attr('class'));

    var classListPagination = (wishPagination!='') ? $(wishPagination).attr('class').split(/\s+/) : '';
    var classListItem = $(wishItem).attr('class').split(/\s+/);
    var classListSlide = $(wishSlide).attr('class').split(/\s+/);
    var tagNameSlide = $(wishSlide).prop("tagName")



    for (var w = 0; w < 3; w++) {
        // console.log($('[data-sm-text="WISH_TEXT_ITEMS_' + w + '"]').parents(wishSlider).find(wishItem));
        $('[data-sm-text="WISH_TEXT_ITEMS_' + w + '"]').parents(wishSlider).find(wishItem).remove();

        var alignClass='';
        alignClass = (parent && parent.data_value && parent.data_value['WISH_TEXT_ITEMS_' + w + '_ALIGN'] !== undefined) ? 'sm-text_align-'+parent.data_value['WISH_TEXT_ITEMS_' + w + '_ALIGN'] : '';

        if (parent.data_value['WISH_TEXT_ITEMS_' + w] && typeof (parent.data_value['WISH_TEXT_ITEMS_' + w]) != 'undefined') {
            if (parent.data_value['WISH_TEXT_ITEMS_' + w] != '') {
                let wishTitle= $('<div>').html(parent.data_value['WISH_TEXT_ITEMS_' + w]).text();
                // console.log(parent.data_value['WISH_TEXT_ITEMS_' + w + '_ALIGN']);
                // console.log('wish1');
                // console.log('<div class="' + classListItem.join(' ').replace('sm-text_align-left','').replace('sm-text_align-right','').replace('sm-text_align-center','') + ' ' + alignClass + '"><' + tagNameSlide + ' class="' + classListSlide.join(' ').replace('sm-text_align-left','').replace('sm-text_align-right','').replace('sm-text_align-center','') + ' ' + alignClass + '" data-sm-text="WISH_TEXT_ITEMS_' + w + '" title="' + wishTitle + '">' + parent.data_value['WISH_TEXT_ITEMS_' + w] + '</' + tagNameSlide + '></div>');
                $(wishSlider).append('<div class="' + classListItem.join(' ').replace('sm-text_align-left','').replace('sm-text_align-right','').replace('sm-text_align-center','') + ' ' + alignClass + '"><' + tagNameSlide + ' class="' + classListSlide.join(' ').replace('sm-text_align-left','').replace('sm-text_align-right','').replace('sm-text_align-center','') + ' ' + alignClass + '" data-sm-text="WISH_TEXT_ITEMS_' + w + '" title="' + wishTitle +
                    '">' + parent.data_value['WISH_TEXT_ITEMS_' + w] + '</' + tagNameSlide + '></div>');
                countSlides++;
            }
        } else {
            if (parent.data_value['WISH_TEXT_ITEMS'] && parent.data_value['WISH_TEXT_ITEMS'].length > 0) {
                if (parent.data_value['WISH_TEXT_ITEMS_' + w] != '') {
                    // console.log('wish2');
                    let wishTitle= $('<div>').html(parent.data_value['WISH_TEXT_ITEMS_' + w]).text();
                    $(wishSlider).append('<div class="' + classListItem.join(' ').replace('sm-text_align-left','').replace('sm-text_align-right','').replace('sm-text_align-center','')  + ' ' + alignClass + '"><' + tagNameSlide + ' class="' + classListSlide.join(' ').replace('sm-text_align-left','').replace('sm-text_align-right','').replace('sm-text_align-center','') + ' ' + alignClass + '" data-sm-text="WISH_TEXT_ITEMS_' + w + '" title="' + wishTitle +
                        '">' + parent.data_value['WISH_TEXT_ITEMS'][w] + '</' + tagNameSlide + '></div>');
                    countSlides++;
                }
            }
        }
    }

    // console.log('slider length: '+$(wishSlider).length);

    if ($(wishSlider).length > 0) {

        if(counterSlides!='' && counterId!='') {

            // console.log('type normal');

            var arrow_next = '';
            var arrow_prev = '';

            if(parent.template_config['WISH_SLIDER_ARROW_NEXT'] && parent.template_config['WISH_SLIDER_ARROW_NEXT']!='' && parent.template_config['WISH_SLIDER_ARROW_PREV'] && parent.template_config['WISH_SLIDER_ARROW_PREV']!='' && typeof wishSliderParams === 'undefined'){
                arrow_next = $(parent.template_config['WISH_SLIDER_ARROW_NEXT']);
                arrow_prev = $(parent.template_config['WISH_SLIDER_ARROW_PREV']);
                wishSliderParams = {
                    slidesToShow: 1,
                    infinite: true,
                    adaptiveHeight: false,
                    prevArrow: arrow_prev,
                    nextArrow: arrow_next,
                };
            }else if(parent.template_config['WISH_SLIDER_DOTS'] && parent.template_config['WISH_SLIDER_DOTS']=='true' && typeof wishSliderParams === 'undefined') {
                wishSliderParams = {
                    infinite: false,
                    adaptiveHeight: false,
                    dots: true
                }
            }else{
                if (typeof wishSliderParams === 'undefined') {
                    wishSliderParams = {
                        slidesToShow: 1,
                        infinite: true,
                        adaptiveHeight: false,
                    };
                }
            }



            $(counterSlides).text(countSlides);

            if(wishPagination!='') {
                $(wishPagination).toggleClass('sm-hidden', countSlides <= 1)
            }

            if (countSlides > 1) {
                $(wishSlider).slick(wishSliderParams);

                $($(wishSlider)).on('afterChange', function (event, slick, currentSlide) {
                    if(counterId!='dots') {
                        $(counterId).text(currentSlide + 1);
                    }
                });


                $(wishSlider).on("init reInit afterChange", function (event, slick) {
                    if(classListPagination!='') {
                        $(classListPagination.join(' ')).html(
                            slick.slickCurrentSlide() + 1 + "/" + slick.slideCount
                        );
                    }
                });

            }
        }else{

            // console.log('type 15');

            var arrow_next = '<div class="sm-slider__arrow sm-slider__arrow_right"></div>';
            var arrow_prev = '<div class="sm-slider__arrow sm-slider__arrow_left"></div>';

            if(parent.template_config['WISH_SLIDER_ARROW_NEXT'] && parent.template_config['WISH_SLIDER_ARROW_NEXT']!='' && parent.template_config['WISH_SLIDER_ARROW_PREV'] && parent.template_config['WISH_SLIDER_ARROW_PREV']!=''){
                arrow_next = $(parent.template_config['WISH_SLIDER_ARROW_NEXT']);
                arrow_prev = $(parent.template_config['WISH_SLIDER_ARROW_PREV']);
            }


            if (typeof wishSliderParams === 'undefined') {
                wishSliderParams = {
                    infinite: true,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: true,
                    appendArrows: $(arrowsClass),
                    prevArrow: arrow_prev,
                    nextArrow: arrow_next,
                    dots: false
                };
            }

            if(wishPagination!='') {
                $(wishPagination).toggleClass('sm-hidden', countSlides <= 1);
                $(wishPagination + ' .sm-slider-counter').text(1 + '/' + countSlides);
            }

            if (countSlides > 1) {
                $(wishSlider).slick(wishSliderParams);

                if(wishPagination!='') {
                    // console.log('pagination detected');
                    $($(wishSlider)).on('afterChange', function (event, slick, currentSlide) {
                        // console.log('change wish slide');
                        $(wishPagination + ' .sm-slider-counter').text((currentSlide + 1) + '/' + countSlides);
                    });

                    $(wishSlider).on("init reInit afterChange", function (event, slick) {
                        $(classListPagination.join(' ')).html(
                            slick.slickCurrentSlide() + 1 + "/" + slick.slideCount
                        );
                    });
                }
            }
        }
    }
}
