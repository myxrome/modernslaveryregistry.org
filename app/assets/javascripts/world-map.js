$(document).ready(function() {
  if ($('#world-map').length) {
    var map = L.map('world-map').setView([40, 0], 1)

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  		maxZoom: 3
  	}).addTo(map)

    var selectedColour = '#B0008E'
    var unSelectedColour = '#404044'

    var circleByCountryId = {}

    function updateCircles() {
      for(var c in circleByCountryId) {
        circleByCountryId[c].setStyle({
          color: unSelectedColour,
          fillColor: unSelectedColour
        })
      }

      $("#countries_ option:selected").each(function() {
        var circle = circleByCountryId[this.value]
        circle.setStyle({
          color: selectedColour,
          fillColor: selectedColour
        })
      })
    }

    // TODO: Use same search params as form so we can render consistently
    // with statement list?
    $.get("/countries", function(countries) {
      countries.forEach(function (country) {
        var radius = Math.log10(10*country.company_count + 10) * 100000

        var circle = L.circle([country.lat, country.lng], {
          color: selectedColour,
          fillColor: selectedColour,
          weight: 0,
          fillOpacity: 0.5,
          radius: radius
        })
        circleByCountryId[country.id] = circle
        circle.bindTooltip(country.name + "<br>" + country.company_count + ' companies').openTooltip()
        circle.addTo(map)
        circle.on('click', function () {
          var opt = $("#countries_ option[value=" + country.id + "]")
          opt.prop('selected', !opt.prop('selected'))
          $("#countries_").trigger("chosen:updated")
          updateCircles()
        })
      })

      $('#countries_').on('change', function(evt, params) {
        updateCircles()
      })

      updateCircles()
    })
  }
})
