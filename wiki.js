const $ = window.$  // because $ is a global variable

function searchToggle (obj, evt) {
  evt.preventDefault()
  var container = $(obj).closest('.search-wrapper')

  if (!container.hasClass('active')) {
    container.addClass('active')
  } else if (container.hasClass('active') && $(obj).closest('.input-holder').length === 0) {
    container.removeClass('active') // clear input
    container.find('.search-input').val('') // clear and hide result container when we press close
    container.find('.result-container').fadeOut(100, function () { $(this).empty() })
  }
}

function createWikiListItem (wikiTitle, wikiSnippet, wikiLink, wikiImg) {
  var wikidl = '<dl class="styledl"><a href=":wikiLink" target="_blank"><div class="divimg"><img src=":wikiImg"><div><dt>:wikiTitle</dt><dd>:wikiSnippet</dd></div></div></a></dl>'
  wikidl = wikidl.replace(':wikiLink', wikiLink)
  wikidl = wikidl.replace(':wikiTitle', wikiTitle)
  wikidl = wikidl.replace(':wikiSnippet', wikiSnippet)
  wikidl = wikidl.replace(':wikiImg', wikiImg)
  return wikidl
}

function afficheUI (data) {
  var wikidl = ''
  var resultContainer = $('.result-container')
  var res = data.query.pages
  console.log(res)

  for (var key in res) {
    var wikiTitle = res[key].title
    console.log(wikiTitle)
    var wikiSippet = res[key].extract
    console.log(wikiSippet)
    var wikiLink = res[key].fullurl
    console.log(wikiLink)
    if (res[key].thumbnail) {
      var wikiImg = res[key].thumbnail.source
      console.log(wikiImg)
    } else {
      wikiImg = 'https://assurancepower.com/components/com_easyblog/themes/wireframe/images/placeholder-image.png'
    }
    wikidl += createWikiListItem(wikiTitle, wikiSippet, wikiLink, wikiImg)
  }
  resultContainer.html(wikidl)

  $('dl').mouseover(function () {
    $(this).css('box-shadow', '-5px 0px 5px 0px pink')
  })
  $('dl').mouseleave(function () {
    $(this).css('box-shadow', 'none')
  })
}

$(document)
  .on('click', '.search-icon', myFunction)

$('.search-input').on('keypress', myFunction)

function myFunction (event) {
    // search only if the user hit the "Enter" (code 13) button
  if (event.keyCode === 13 || event.type === 'click') {
    var inputVal = $('.search-input').val()

    if (inputVal !== '') {
      console.log('submit')
      var url = 'https://en.wikipedia.org/w/api.php?'
      $.ajax({
        url: url,
        dataType: 'jsonp',
        data: {
                // main parameters
          action: 'query',
          format: 'json',
          generator: 'search',

                // parameters for generator
          gsrsearch: inputVal,
          gsrnamespace: 0,
          gsrlimit: 10,
          prop: 'extracts|pageimages|info',

                // parameters for extracts
          inprop: 'url',
          exchars: 200,
          exlimit: 'max',
          explaintext: true,
          exintro: true,

                // parameters for pageimages
          piprop: 'thumbnail',
          pilimit: 'max',
          pithumbsize: 200

                // parameters for random
                // list: 'random',
                // rnlimit: 5,
        },
        success: function (data) {
          console.log(data)
          afficheUI(data)

          if (!data.query) {
            $('.result-container').html('<h2>Ouuupss... ! No results found.</h2>')
          }
        },
        error: function (xhr, error, status) {
          console.error(error)
        }

      })
    }

    $('html, body').animate({scrollTop: ($('.result-container').offset().top)}, 900)
    $('.search-input').val('')
  }
};
