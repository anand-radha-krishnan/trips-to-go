/* eslint-disable*/

export const displayMap = (locations) => {
  maptilersdk.config.apiKey = 'k3Gzvl4XGg3BqdGFSkU0';
  const map = new maptilersdk.Map({
    container: 'map', // container's id or the HTML element in which the SDK will render the map
    style: maptilersdk.MapStyle.DATAVIZ.LIGHT,
    center: [-118.113491, 34.111745], // starting position [lng, lat]
    scrollZoom: false,
  });

  const bounds = new maptilersdk.LngLatBounds();

  locations.forEach((location) => {
    // create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // add marker
    new maptilersdk.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(location.coordinates)
      .addTo(map);

    // add popup
    new maptilersdk.Popup({ offset: 30 })
      .setLngLat(location.coordinates)
      .setHTML(`<p>Day ${location.day}: ${location.description}</p>`)
      .addTo(map);

    // extend map bounds
    bounds.extend(location.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 250,
      left: 100,
      right: 100,
    },
  });
};
