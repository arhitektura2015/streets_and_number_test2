sessionStorage.clear();

var lat, lng;

var orangeIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var map = L.map('map', {renderer: L.canvas(), zoomControl: false, zoom: 12, minZoom: 5, maxZoom: 22});

map.attributionControl.addAttribution('<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>');

map.createPane('Optional_Rasters');
map.createPane('Parcels');
map.createPane('Others');
map.createPane('IKK');
map.createPane('Geoman');
map.createPane('Geoman_marker');

map.getPane('Optional_Rasters').style.zIndex = 251;
map.getPane('Parcels').style.zIndex = 252;
map.getPane('Others').style.zIndex = 253;
map.getPane('IKK').style.zIndex = 254;
map.getPane('Geoman').style.zIndex = 600;
map.getPane('Geoman_marker').style.zIndex = 601;

map.getPane('Optional_Rasters').style.pointerEvents = 'none';
map.getPane('Parcels').style.pointerEvents = 'none';
map.getPane('Others').style.pointerEvents = 'none';
map.getPane('IKK').style.pointerEvents = 'none';
map.getPane('Geoman').style.pointerEvents = 'none';
map.getPane('Geoman_marker').style.pointerEvents = 'none';

var geojson_style = {
    "color": "yellow",
    "weight": 2,
    "fillOpacity": .55
}


function getColor_Parcels(d) {
    return d == "Комунальна власність" ? 'green' :
        d == "Приватна власність" ? 'yellow' :
            d == "Державна власність" ? 'purple' :
                d == "Не визначено" ? '#990000' : 'white'
}

function style_Parcels(feature) {
    return {
        color: getColor_Parcels(feature.properties.ownership),
        fillOpacity: 0.35,
        weight: 3
    };
}

map.createPane('streets');
map.createPane('buildings');
map.createPane('boundaries');
map.createPane('labels');


map.getPane('buildings').style.zIndex = 301;
map.getPane('streets').style.zIndex = 300;
map.getPane('boundaries').style.zIndex = 300;
map.getPane('labels').style.zIndex = 402;

function onEachFeature_streets(feature, layer) {

    var props = layer.feature.properties;
    layer.bindTooltip(props.name_old != null ? `${str_type[props.str_type]} ${props.str_name} (${props.name_old})` : `${str_type[props.str_type]} ${props.str_name}`, {
        sticky: true,
    });
}

function get_fillColor_Buildings(build_num, condition) {
    return condition == 2 || condition == 3 ? 'red' :
        build_num != "0" && build_num != null && build_num != '0' ? 'orange' :
            build_num == "0" || build_num == null || build_num == '0' ? 'grey' : 'purple'
}


function get_borderColor_Buildings(build_num, condition) {
    return condition == 2 || condition == 3 ? '#800000' :
        build_num != "0" && build_num != null && build_num != '0' ? '#ff6600' :
            build_num == "0" || build_num == null || build_num == '0' ? 'black' : 'purple'
}


function style_Buildings(feature) {
    return {
        fillColor: get_fillColor_Buildings(feature.properties.build_num, feature.properties.condition),
        color: get_borderColor_Buildings(feature.properties.build_num, feature.properties.condition),
        fillOpacity: 0.7,
        opacity: 1
    };
}


var IKK = L.geoJson(IKK_data, {
    renderer: L.canvas({pane: 'IKK'}),
    pmIgnore: true,
    snapIgnore: true,
    id: "IKK",
    layername: 'Кадастровий поділ',
    style: {color: 'blue'/*'#0ffc03'*/, fillOpacity: .0, weight: 5},
    canGetInfo: true
}).addTo(map);

map.fitBounds(IKK.getBounds())
map.setZoom(12)

var Parcels = L.geoJson(parcels, {
    renderer: L.canvas({pane: "Parcels"}),
    pmIgnore: true,
    snapIgnore: true,
    id: "Parcels",
    layername: 'Земельні ділянки станом на 23.02.2024',
    style: style_Parcels,
    canGetInfo: true
}).addTo(map);

var LayerDrawnByGeoman = L.geoJson();

// map.setView(Parcels.getBounds().getCenter(), 13)


LayerDrawnByGeoman.options = {
    id: 'LayerDrawnByGeoman',
    layername: 'Намальовані фігури',
    style: {color: 'orange', weight: 7},
    icon: orangeIcon/*, style: {color: 'orange', weight: 7}, stripeColor:'black', stripeId: "diagonal_left_down_to_right_up" */
}
console.log(LayerDrawnByGeoman)
LayerDrawnByGeoman.addTo(map)


var streets_map_layer_Pokrovsk  = L.geoJson(street_layer_Pokrovsk, {renderer: L.canvas({pane: 'streets'}),     pmIgnore: true,     snapIgnore: true,     id: 'streets_map_layer_Pokrovsk',     layername: 'Вісі вулиць Покровськ',     style: {color: 'white', fillOpacity: .0, weight: 13},     canGetInfo: true,     onEachFeature: onEachFeature_streets });
var streets_map_layer_Rodynske  = L.geoJson(street_layer_Rodynske, {renderer: L.canvas({pane: 'streets'}),     pmIgnore: true,     snapIgnore: true,     id: 'streets_map_layer_Rodynske',     layername: 'Вісі вулиць Родинське',     style: {color: 'white', fillOpacity: .0, weight: 13},     canGetInfo: true,     onEachFeature: onEachFeature_streets });
var streets_map_layer_Shevchenko  = L.geoJson(street_layer_Shevchenko, {renderer: L.canvas({pane: 'streets'}),     pmIgnore: true,     snapIgnore: true,     id: 'streets_map_layer_Shevchenko',     layername: 'Вісі вулиць Шевченко',     style: {color: 'white', fillOpacity: .0, weight: 13},     canGetInfo: true,     onEachFeature: onEachFeature_streets });
var streets_map_layer_Hryshyne  = L.geoJson(street_layer_Hryshyne, {renderer: L.canvas({pane: 'streets'}),     pmIgnore: true,     snapIgnore: true,     id: 'streets_map_layer_Hryshyne',     layername: 'Вісі вулиць Гришине',     style: {color: 'white', fillOpacity: .0, weight: 13},     canGetInfo: true,     onEachFeature: onEachFeature_streets });
var streets_map_layer_Bohdanivka  = L.geoJson(street_layer_Bohdanivka, {renderer: L.canvas({pane: 'streets'}),     pmIgnore: true,     snapIgnore: true,     id: 'streets_map_layer_Bohdanivka',     layername: 'Вісі вулиць Богданівка',     style: {color: 'white', fillOpacity: .0, weight: 13},     canGetInfo: true,     onEachFeature: onEachFeature_streets });
var streets_map_layer_Dachenske  = L.geoJson(street_layer_Dachenske, {renderer: L.canvas({pane: 'streets'}),     pmIgnore: true,     snapIgnore: true,     id: 'streets_map_layer_Dachenske',     layername: 'Вісі вулиць Даченське',     style: {color: 'white', fillOpacity: .0, weight: 13},     canGetInfo: true,     onEachFeature: onEachFeature_streets });
var streets_map_layer_Zelene  = L.geoJson(street_layer_Zelene, {renderer: L.canvas({pane: 'streets'}),     pmIgnore: true,     snapIgnore: true,     id: 'streets_map_layer_Zelene',     layername: 'Вісі вулиць Зелене',     style: {color: 'white', fillOpacity: .0, weight: 13},     canGetInfo: true,     onEachFeature: onEachFeature_streets });
var streets_map_layer_Lysivka  = L.geoJson(street_layer_Lysivka, {renderer: L.canvas({pane: 'streets'}),     pmIgnore: true,     snapIgnore: true,     id: 'streets_map_layer_Lysivka',     layername: 'Вісі вулиць Лисівка',     style: {color: 'white', fillOpacity: .0, weight: 13},     canGetInfo: true,     onEachFeature: onEachFeature_streets });
var streets_map_layer_Novyy_Trud  = L.geoJson(street_layer_Novyy_Trud, {renderer: L.canvas({pane: 'streets'}),     pmIgnore: true,     snapIgnore: true,     id: 'streets_map_layer_Novyy_Trud',     layername: 'Вісі вулиць Новий Труд',     style: {color: 'white', fillOpacity: .0, weight: 13},     canGetInfo: true,     onEachFeature: onEachFeature_streets });
var streets_map_layer_Novoolenivka  = L.geoJson(street_layer_Novoolenivka, {renderer: L.canvas({pane: 'streets'}),     pmIgnore: true,     snapIgnore: true,     id: 'streets_map_layer_Novoolenivka',     layername: 'Вісі вулиць Новооленівка',     style: {color: 'white', fillOpacity: .0, weight: 13},     canGetInfo: true,     onEachFeature: onEachFeature_streets });
var streets_map_layer_Novopavlivka  = L.geoJson(street_layer_Novopavlivka, {renderer: L.canvas({pane: 'streets'}),     pmIgnore: true,     snapIgnore: true,     id: 'streets_map_layer_Novopavlivka',     layername: 'Вісі вулиць Новопавлівка',     style: {color: 'white', fillOpacity: .0, weight: 13},     canGetInfo: true,     onEachFeature: onEachFeature_streets });
var streets_map_layer_Novotroyitske  = L.geoJson(street_layer_Novotroyitske, {renderer: L.canvas({pane: 'streets'}),     pmIgnore: true,     snapIgnore: true,     id: 'streets_map_layer_Novotroyitske',     layername: 'Вісі вулиць Новотроїцьке',     style: {color: 'white', fillOpacity: .0, weight: 13},     canGetInfo: true,     onEachFeature: onEachFeature_streets });
var streets_map_layer_Novoukrayinka  = L.geoJson(street_layer_Novoukrayinka, {renderer: L.canvas({pane: 'streets'}),     pmIgnore: true,     snapIgnore: true,     id: 'streets_map_layer_Novoukrayinka',     layername: 'Вісі вулиць Новоукраїнка',     style: {color: 'white', fillOpacity: .0, weight: 13},     canGetInfo: true,     onEachFeature: onEachFeature_streets });
var streets_map_layer_Preobrazhenka  = L.geoJson(street_layer_Preobrazhenka, {renderer: L.canvas({pane: 'streets'}),     pmIgnore: true,     snapIgnore: true,     id: 'streets_map_layer_Preobrazhenka',     layername: 'Вісі вулиць Преображенка',     style: {color: 'white', fillOpacity: .0, weight: 13},     canGetInfo: true,     onEachFeature: onEachFeature_streets });
var streets_map_layer_Rih  = L.geoJson(street_layer_Rih, {renderer: L.canvas({pane: 'streets'}),     pmIgnore: true,     snapIgnore: true,     id: 'streets_map_layer_Rih',     layername: 'Вісі вулиць Ріг',     style: {color: 'white', fillOpacity: .0, weight: 13},     canGetInfo: true,     onEachFeature: onEachFeature_streets });
var streets_map_layer_Sukhyy_Yar  = L.geoJson(street_layer_Sukhyy_Yar, {renderer: L.canvas({pane: 'streets'}),     pmIgnore: true,     snapIgnore: true,     id: 'streets_map_layer_Sukhyy_Yar',     layername: 'Вісі вулиць Сухий Яр',     style: {color: 'white', fillOpacity: .0, weight: 13},     canGetInfo: true,     onEachFeature: onEachFeature_streets });
var streets_map_layer_Troyanda  = L.geoJson(street_layer_Troyanda, {renderer: L.canvas({pane: 'streets'}),     pmIgnore: true,     snapIgnore: true,     id: 'streets_map_layer_Troyanda',     layername: 'Вісі вулиць Троянда',     style: {color: 'white', fillOpacity: .0, weight: 13},     canGetInfo: true,     onEachFeature: onEachFeature_streets });
var streets_map_layer_Kotlyne  = L.geoJson(street_layer_Kotlyne, {renderer: L.canvas({pane: 'streets'}),     pmIgnore: true,     snapIgnore: true,     id: 'streets_map_layer_Kotlyne',     layername: 'Вісі вулиць Котлине',     style: {color: 'white', fillOpacity: .0, weight: 13},     canGetInfo: true,     onEachFeature: onEachFeature_streets });
var streets_map_layer_Pershe_Travnya  = L.geoJson(street_layer_Pershe_Travnya, {renderer: L.canvas({pane: 'streets'}),     pmIgnore: true,     snapIgnore: true,     id: 'streets_map_layer_Pershe_Travnya',     layername: 'Вісі вулиць Перше Травня',     style: {color: 'white', fillOpacity: .0, weight: 13},     canGetInfo: true,     onEachFeature: onEachFeature_streets });
var streets_map_layer_Pushkine  = L.geoJson(street_layer_Pushkine, {renderer: L.canvas({pane: 'streets'}),     pmIgnore: true,     snapIgnore: true,     id: 'streets_map_layer_Pushkine',     layername: 'Вісі вулиць Пушкіне',     style: {color: 'white', fillOpacity: .0, weight: 13},     canGetInfo: true,     onEachFeature: onEachFeature_streets });
var streets_map_layer_Chunyshyne  = L.geoJson(street_layer_Chunyshyne, {renderer: L.canvas({pane: 'streets'}),     pmIgnore: true,     snapIgnore: true,     id: 'streets_map_layer_Chunyshyne',     layername: 'Вісі вулиць Чунишине',     style: {color: 'white', fillOpacity: .0, weight: 13},     canGetInfo: true,     onEachFeature: onEachFeature_streets });
var streets_map_layer_Novopustynka  = L.geoJson(street_layer_Novopustynka, {renderer: L.canvas({pane: 'streets'}),     pmIgnore: true,     snapIgnore: true,     id: 'streets_map_layer_Novopustynka',     layername: 'Вісі вулиць Новопустинка',     style: {color: 'white', fillOpacity: .0, weight: 13},     canGetInfo: true,     onEachFeature: onEachFeature_streets });
var streets_map_layer_Novoandriyivka  = L.geoJson(street_layer_Novoandriyivka, {renderer: L.canvas({pane: 'streets'}),     pmIgnore: true,     snapIgnore: true,     id: 'streets_map_layer_Novoandriyivka',     layername: 'Вісі вулиць Новоандріївка',     style: {color: 'white', fillOpacity: .0, weight: 13},     canGetInfo: true,     onEachFeature: onEachFeature_streets });
var streets_map_layer_Horikhove  = L.geoJson(street_layer_Horikhove, {renderer: L.canvas({pane: 'streets'}),     pmIgnore: true,     snapIgnore: true,     id: 'streets_map_layer_Horikhove',     layername: 'Вісі вулиць Горіхове',     style: {color: 'white', fillOpacity: .0, weight: 13},     canGetInfo: true,     onEachFeature: onEachFeature_streets });
var streets_map_layer_Novoyelyzavetivka  = L.geoJson(street_layer_Novoyelyzavetivka, {renderer: L.canvas({pane: 'streets'}),     pmIgnore: true,     snapIgnore: true,     id: 'streets_map_layer_Novoyelyzavetivka',     layername: 'Вісі вулиць Новоєлизаветівка',     style: {color: 'white', fillOpacity: .0, weight: 13},     canGetInfo: true,     onEachFeature: onEachFeature_streets });
var streets_map_layer_Novovasylivka  = L.geoJson(street_layer_Novovasylivka, {renderer: L.canvas({pane: 'streets'}),     pmIgnore: true,     snapIgnore: true,     id: 'streets_map_layer_Novovasylivka',     layername: 'Вісі вулиць Нововасилівка',     style: {color: 'white', fillOpacity: .0, weight: 13},     canGetInfo: true,     onEachFeature: onEachFeature_streets });
var streets_map_layer_Pishchane  = L.geoJson(street_layer_Pishchane, {renderer: L.canvas({pane: 'streets'}),     pmIgnore: true,     snapIgnore: true,     id: 'streets_map_layer_Pishchane',     layername: 'Вісі вулиць Піщане',     style: {color: 'white', fillOpacity: .0, weight: 13},     canGetInfo: true,     onEachFeature: onEachFeature_streets });
var streets_map_layer_Novooleksandrivka  = L.geoJson(street_layer_Novooleksandrivka, {renderer: L.canvas({pane: 'streets'}),     pmIgnore: true,     snapIgnore: true,     id: 'streets_map_layer_Novooleksandrivka',     layername: 'Вісі вулиць Новоолександрівка',     style: {color: 'white', fillOpacity: .0, weight: 13},     canGetInfo: true,     onEachFeature: onEachFeature_streets });
var streets_map_layer_Sribne  = L.geoJson(street_layer_Sribne, {renderer: L.canvas({pane: 'streets'}),     pmIgnore: true,     snapIgnore: true,     id: 'streets_map_layer_Sribne',     layername: 'Вісі вулиць Срібне',     style: {color: 'white', fillOpacity: .0, weight: 13},     canGetInfo: true,     onEachFeature: onEachFeature_streets });
var streets_map_layer_Uspenivka  = L.geoJson(street_layer_Uspenivka, {renderer: L.canvas({pane: 'streets'}),     pmIgnore: true,     snapIgnore: true,     id: 'streets_map_layer_Uspenivka',     layername: 'Вісі вулиць Успенівка',     style: {color: 'white', fillOpacity: .0, weight: 13},     canGetInfo: true,     onEachFeature: onEachFeature_streets });
var streets_map_layer_Yasenovo  = L.geoJson(street_layer_Yasenovo, {renderer: L.canvas({pane: 'streets'}),     pmIgnore: true,     snapIgnore: true,     id: 'streets_map_layer_Yasenovo',     layername: 'Вісі вулиць Ясенове',     style: {color: 'white', fillOpacity: .0, weight: 13},     canGetInfo: true,     onEachFeature: onEachFeature_streets });
var streets_map_layer_Nadezhdinka  = L.geoJson(street_layer_Nadezhdinka, {renderer: L.canvas({pane: 'streets'}),     pmIgnore: true,     snapIgnore: true,     id: 'streets_map_layer_Nadezhdinka',     layername: 'Вісі вулиць Надеждинка',     style: {color: 'white', fillOpacity: .0, weight: 13},     canGetInfo: true,     onEachFeature: onEachFeature_streets });
var streets_map_layer_Solone  = L.geoJson(street_layer_Solone, {renderer: L.canvas({pane: 'streets'}),     pmIgnore: true,     snapIgnore: true,     id: 'streets_map_layer_Solone',     layername: 'Вісі вулиць Солоне',     style: {color: 'white', fillOpacity: .0, weight: 13},     canGetInfo: true,     onEachFeature: onEachFeature_streets });
var streets_map_layer_Vovkove  = L.geoJson(street_layer_Vovkove, {renderer: L.canvas({pane: 'streets'}),     pmIgnore: true,     snapIgnore: true,     id: 'streets_map_layer_Vovkove',     layername: 'Вісі вулиць Вовкове',     style: {color: 'white', fillOpacity: .0, weight: 13},     canGetInfo: true,     onEachFeature: onEachFeature_streets });




var boundaries_map_layer_Pokrovsk  = L.geoJson(boundaries_layer_Pokrovsk, {renderer: L.canvas({pane: 'boundaries'}),     pmIgnore: true,     snapIgnore: true,     id: 'boundaries_map_layer_Pokrovsk',     layername: 'Полігони будинків Покровськ',     style: {color: '#bd0d00', fillOpacity: .0, weight: 7},     canGetInfo: false });


var boundaries_map_layer_Rodynske  = L.geoJson(boundaries_layer_Rodynske, {renderer: L.canvas({pane: 'boundaries'}),     pmIgnore: true,     snapIgnore: true,     id: 'boundaries_map_layer_Rodynske',     layername: 'Полігони будинків Родинське',     style: {color: '#bd0d00', fillOpacity: .0, weight: 7},     canGetInfo: false });
var boundaries_map_layer_Shevchenko  = L.geoJson(boundaries_layer_Shevchenko, {renderer: L.canvas({pane: 'boundaries'}),     pmIgnore: true,     snapIgnore: true,     id: 'boundaries_map_layer_Shevchenko',     layername: 'Полігони будинків Шевченко',     style: {color: '#bd0d00', fillOpacity: .0, weight: 7},     canGetInfo: false });
var boundaries_map_layer_Hryshyne  = L.geoJson(boundaries_layer_Hryshyne, {renderer: L.canvas({pane: 'boundaries'}),     pmIgnore: true,     snapIgnore: true,     id: 'boundaries_map_layer_Hryshyne',     layername: 'Полігони будинків Гришине',     style: {color: '#bd0d00', fillOpacity: .0, weight: 7},     canGetInfo: false });
var boundaries_map_layer_Bohdanivka  = L.geoJson(boundaries_layer_Bohdanivka, {renderer: L.canvas({pane: 'boundaries'}),     pmIgnore: true,     snapIgnore: true,     id: 'boundaries_map_layer_Bohdanivka',     layername: 'Полігони будинків Богданівка',     style: {color: '#bd0d00', fillOpacity: .0, weight: 7},     canGetInfo: false });
var boundaries_map_layer_Dachenske  = L.geoJson(boundaries_layer_Dachenske, {renderer: L.canvas({pane: 'boundaries'}),     pmIgnore: true,     snapIgnore: true,     id: 'boundaries_map_layer_Dachenske',     layername: 'Полігони будинків Даченське',     style: {color: '#bd0d00', fillOpacity: .0, weight: 7},     canGetInfo: false });
var boundaries_map_layer_Zelene  = L.geoJson(boundaries_layer_Zelene, {renderer: L.canvas({pane: 'boundaries'}),     pmIgnore: true,     snapIgnore: true,     id: 'boundaries_map_layer_Zelene',     layername: 'Полігони будинків Зелене',     style: {color: '#bd0d00', fillOpacity: .0, weight: 7},     canGetInfo: false });
var boundaries_map_layer_Lysivka  = L.geoJson(boundaries_layer_Lysivka, {renderer: L.canvas({pane: 'boundaries'}),     pmIgnore: true,     snapIgnore: true,     id: 'boundaries_map_layer_Lysivka',     layername: 'Полігони будинків Лисівка',     style: {color: '#bd0d00', fillOpacity: .0, weight: 7},     canGetInfo: false });
var boundaries_map_layer_Novyy_Trud  = L.geoJson(boundaries_layer_Novyy_Trud, {renderer: L.canvas({pane: 'boundaries'}),     pmIgnore: true,     snapIgnore: true,     id: 'boundaries_map_layer_Novyy_Trud',     layername: 'Полігони будинків Новий Труд',     style: {color: '#bd0d00', fillOpacity: .0, weight: 7},     canGetInfo: false });
var boundaries_map_layer_Novoolenivka  = L.geoJson(boundaries_layer_Novoolenivka, {renderer: L.canvas({pane: 'boundaries'}),     pmIgnore: true,     snapIgnore: true,     id: 'boundaries_map_layer_Novoolenivka',     layername: 'Полігони будинків Новооленівка',     style: {color: '#bd0d00', fillOpacity: .0, weight: 7},     canGetInfo: false });
var boundaries_map_layer_Novopavlivka  = L.geoJson(boundaries_layer_Novopavlivka, {renderer: L.canvas({pane: 'boundaries'}),     pmIgnore: true,     snapIgnore: true,     id: 'boundaries_map_layer_Novopavlivka',     layername: 'Полігони будинків Новопавлівка',     style: {color: '#bd0d00', fillOpacity: .0, weight: 7},     canGetInfo: false });
var boundaries_map_layer_Novotroyitske  = L.geoJson(boundaries_layer_Novotroyitske, {renderer: L.canvas({pane: 'boundaries'}),     pmIgnore: true,     snapIgnore: true,     id: 'boundaries_map_layer_Novotroyitske',     layername: 'Полігони будинків Новотроїцьке',     style: {color: '#bd0d00', fillOpacity: .0, weight: 7},     canGetInfo: false });
var boundaries_map_layer_Novoukrayinka  = L.geoJson(boundaries_layer_Novoukrayinka, {renderer: L.canvas({pane: 'boundaries'}),     pmIgnore: true,     snapIgnore: true,     id: 'boundaries_map_layer_Novoukrayinka',     layername: 'Полігони будинків Новоукраїнка',     style: {color: '#bd0d00', fillOpacity: .0, weight: 7},     canGetInfo: false });
var boundaries_map_layer_Preobrazhenka  = L.geoJson(boundaries_layer_Preobrazhenka, {renderer: L.canvas({pane: 'boundaries'}),     pmIgnore: true,     snapIgnore: true,     id: 'boundaries_map_layer_Preobrazhenka',     layername: 'Полігони будинків Преображенка',     style: {color: '#bd0d00', fillOpacity: .0, weight: 7},     canGetInfo: false });
var boundaries_map_layer_Rih  = L.geoJson(boundaries_layer_Rih, {renderer: L.canvas({pane: 'boundaries'}),     pmIgnore: true,     snapIgnore: true,     id: 'boundaries_map_layer_Rih',     layername: 'Полігони будинків Ріг',     style: {color: '#bd0d00', fillOpacity: .0, weight: 7},     canGetInfo: false });
var boundaries_map_layer_Sukhyy_Yar  = L.geoJson(boundaries_layer_Sukhyy_Yar, {renderer: L.canvas({pane: 'boundaries'}),     pmIgnore: true,     snapIgnore: true,     id: 'boundaries_map_layer_Sukhyy_Yar',     layername: 'Полігони будинків Сухий Яр',     style: {color: '#bd0d00', fillOpacity: .0, weight: 7},     canGetInfo: false });
var boundaries_map_layer_Troyanda  = L.geoJson(boundaries_layer_Troyanda, {renderer: L.canvas({pane: 'boundaries'}),     pmIgnore: true,     snapIgnore: true,     id: 'boundaries_map_layer_Troyanda',     layername: 'Полігони будинків Троянда',     style: {color: '#bd0d00', fillOpacity: .0, weight: 7},     canGetInfo: false });
var boundaries_map_layer_Kotlyne  = L.geoJson(boundaries_layer_Kotlyne, {renderer: L.canvas({pane: 'boundaries'}),     pmIgnore: true,     snapIgnore: true,     id: 'boundaries_map_layer_Kotlyne',     layername: 'Полігони будинків Котлине',     style: {color: '#bd0d00', fillOpacity: .0, weight: 7},     canGetInfo: false });
var boundaries_map_layer_Pershe_Travnya  = L.geoJson(boundaries_layer_Pershe_Travnya, {renderer: L.canvas({pane: 'boundaries'}),     pmIgnore: true,     snapIgnore: true,     id: 'boundaries_map_layer_Pershe_Travnya',     layername: 'Полігони будинків Перше Травня',     style: {color: '#bd0d00', fillOpacity: .0, weight: 7},     canGetInfo: false });
var boundaries_map_layer_Pushkine  = L.geoJson(boundaries_layer_Pushkine, {renderer: L.canvas({pane: 'boundaries'}),     pmIgnore: true,     snapIgnore: true,     id: 'boundaries_map_layer_Pushkine',     layername: 'Полігони будинків Пушкіне',     style: {color: '#bd0d00', fillOpacity: .0, weight: 7},     canGetInfo: false });
var boundaries_map_layer_Chunyshyne  = L.geoJson(boundaries_layer_Chunyshyne, {renderer: L.canvas({pane: 'boundaries'}),     pmIgnore: true,     snapIgnore: true,     id: 'boundaries_map_layer_Chunyshyne',     layername: 'Полігони будинків Чунишине',     style: {color: '#bd0d00', fillOpacity: .0, weight: 7},     canGetInfo: false });
var boundaries_map_layer_Novopustynka  = L.geoJson(boundaries_layer_Novopustynka, {renderer: L.canvas({pane: 'boundaries'}),     pmIgnore: true,     snapIgnore: true,     id: 'boundaries_map_layer_Novopustynka',     layername: 'Полігони будинків Новопустинка',     style: {color: '#bd0d00', fillOpacity: .0, weight: 7},     canGetInfo: false });
var boundaries_map_layer_Novoandriyivka  = L.geoJson(boundaries_layer_Novoandriyivka, {renderer: L.canvas({pane: 'boundaries'}),     pmIgnore: true,     snapIgnore: true,     id: 'boundaries_map_layer_Novoandriyivka',    layername: 'Полігони будинків Новоандріївка',     style: {color: '#bd0d00', fillOpacity: .0, weight: 7},     canGetInfo: false });
var boundaries_map_layer_Horikhove  = L.geoJson(boundaries_layer_Horikhove, {renderer: L.canvas({pane: 'boundaries'}),     pmIgnore: true,     snapIgnore: true,     id: 'boundaries_map_layer_Horikhove',    layername: 'Полігони будинків Горіхове',     style: {color: '#bd0d00', fillOpacity: .0, weight: 7},     canGetInfo: false });
var boundaries_map_layer_Novoyelyzavetivka  = L.geoJson(boundaries_layer_Novoyelyzavetivka, {renderer: L.canvas({pane: 'boundaries'}),     pmIgnore: true,     snapIgnore: true,     id: 'boundaries_map_layer_Novoyelyzavetivka',    layername: 'Полігони будинків Новоєлизаветівка',     style: {color: '#bd0d00', fillOpacity: .0, weight: 7},     canGetInfo: false });
var boundaries_map_layer_Novovasylivka  = L.geoJson(boundaries_layer_Novovasylivka, {renderer: L.canvas({pane: 'boundaries'}),     pmIgnore: true,     snapIgnore: true,     id: 'boundaries_map_layer_Novovasylivka',    layername: 'Полігони будинків Нововасилівка',     style: {color: '#bd0d00', fillOpacity: .0, weight: 7},     canGetInfo: false });
var boundaries_map_layer_Pishchane  = L.geoJson(boundaries_layer_Pishchane, {renderer: L.canvas({pane: 'boundaries'}),     pmIgnore: true,     snapIgnore: true,     id: 'boundaries_map_layer_Pishchane',    layername: 'Полігони будинків Піщане',     style: {color: '#bd0d00', fillOpacity: .0, weight: 7},     canGetInfo: false });
var boundaries_map_layer_Novooleksandrivka  = L.geoJson(boundaries_layer_Novooleksandrivka, {renderer: L.canvas({pane: 'boundaries'}),     pmIgnore: true,     snapIgnore: true,     id: 'boundaries_map_layer_Novooleksandrivka',    layername: 'Полігони будинків Новоолександрівка',     style: {color: '#bd0d00', fillOpacity: .0, weight: 7},     canGetInfo: false });
var boundaries_map_layer_Sribne  = L.geoJson(boundaries_layer_Sribne, {renderer: L.canvas({pane: 'boundaries'}),     pmIgnore: true,     snapIgnore: true,     id: 'boundaries_map_layer_Sribne',    layername: 'Полігони будинків Срібне',     style: {color: '#bd0d00', fillOpacity: .0, weight: 7},     canGetInfo: false });
var boundaries_map_layer_Uspenivka  = L.geoJson(boundaries_layer_Uspenivka, {renderer: L.canvas({pane: 'boundaries'}),     pmIgnore: true,     snapIgnore: true,     id: 'boundaries_map_layer_Uspenivka',    layername: 'Полігони будинків Успенівка',     style: {color: '#bd0d00', fillOpacity: .0, weight: 7},     canGetInfo: false });
var boundaries_map_layer_Yasenovo  = L.geoJson(boundaries_layer_Yasenovo, {renderer: L.canvas({pane: 'boundaries'}),     pmIgnore: true,     snapIgnore: true,     id: 'boundaries_map_layer_Yasenovo',    layername: 'Полігони будинків Ясенове',     style: {color: '#bd0d00', fillOpacity: .0, weight: 7},     canGetInfo: false });
var boundaries_map_layer_Nadezhdinka  = L.geoJson(boundaries_layer_Nadezhdinka, {renderer: L.canvas({pane: 'boundaries'}),     pmIgnore: true,     snapIgnore: true,     id: 'boundaries_map_layer_Nadezhdinka',    layername: 'Полігони будинків Надеждинка',     style: {color: '#bd0d00', fillOpacity: .0, weight: 7},     canGetInfo: false });
var boundaries_map_layer_Solone  = L.geoJson(boundaries_layer_Solone, {renderer: L.canvas({pane: 'boundaries'}),     pmIgnore: true,     snapIgnore: true,     id: 'boundaries_map_layer_Solone',    layername: 'Полігони будинків Солоне',     style: {color: '#bd0d00', fillOpacity: .0, weight: 7},     canGetInfo: false });
var boundaries_map_layer_Vovkove  = L.geoJson(boundaries_layer_Vovkove, {renderer: L.canvas({pane: 'boundaries'}),     pmIgnore: true,     snapIgnore: true,     id: 'boundaries_map_layer_Vovkove',    layername: 'Полігони будинків Вовкове',     style: {color: '#bd0d00', fillOpacity: .0, weight: 7},     canGetInfo: false });




var buildings_layer_Pokrovsk  = L.geoJson(addressPolygon_layer_Pokrovsk, {renderer: L.canvas({pane: 'buildings'}),     pmIgnore: true,     snapIgnore: true,     id: 'buildings_layer_Pokrovsk',     layername: 'Полігони будинків Покровськ',     style: style_Buildings,  canGetInfo: true });
var buildings_layer_Rodynske  = L.geoJson(addressPolygon_layer_Rodynske, {renderer: L.canvas({pane: 'buildings'}),     pmIgnore: true,     snapIgnore: true,     id: 'buildings_layer_Rodynske',     layername: 'Полігони будинків Родинське',     style: style_Buildings,  canGetInfo: true });
var buildings_layer_Shevchenko  = L.geoJson(addressPolygon_layer_Shevchenko, {renderer: L.canvas({pane: 'buildings'}),     pmIgnore: true,     snapIgnore: true,     id: 'buildings_layer_Shevchenko',     layername: 'Полігони будинків Шевченко',     style: style_Buildings,  canGetInfo: true });
var buildings_layer_Hryshyne  = L.geoJson(addressPolygon_layer_Hryshyne, {renderer: L.canvas({pane: 'buildings'}),     pmIgnore: true,     snapIgnore: true,     id: 'buildings_layer_Hryshyne',     layername: 'Полігони будинків Гришине',     style: style_Buildings,  canGetInfo: true });
var buildings_layer_Bohdanivka  = L.geoJson(addressPolygon_layer_Bohdanivka, {renderer: L.canvas({pane: 'buildings'}),     pmIgnore: true,     snapIgnore: true,     id: 'buildings_layer_Bohdanivka',     layername: 'Полігони будинків Богданівка',     style: style_Buildings,  canGetInfo: true });
var buildings_layer_Dachenske  = L.geoJson(addressPolygon_layer_Dachenske, {renderer: L.canvas({pane: 'buildings'}),     pmIgnore: true,     snapIgnore: true,     id: 'buildings_layer_Dachenske',     layername: 'Полігони будинків Даченське',     style: style_Buildings,  canGetInfo: true });
var buildings_layer_Zelene  = L.geoJson(addressPolygon_layer_Zelene, {renderer: L.canvas({pane: 'buildings'}),     pmIgnore: true,     snapIgnore: true,     id: 'buildings_layer_Zelene',     layername: 'Полігони будинків Зелене',     style: style_Buildings,  canGetInfo: true });
var buildings_layer_Lysivka  = L.geoJson(addressPolygon_layer_Lysivka, {renderer: L.canvas({pane: 'buildings'}),     pmIgnore: true,     snapIgnore: true,     id: 'buildings_layer_Lysivka',     layername: 'Полігони будинків Лисівка',     style: style_Buildings,  canGetInfo: true });
var buildings_layer_Novyy_Trud  = L.geoJson(addressPolygon_layer_Novyy_Trud, {renderer: L.canvas({pane: 'buildings'}),     pmIgnore: true,     snapIgnore: true,     id: 'buildings_layer_Novyy Trud',     layername: 'Полігони будинків Новий Труд',     style: style_Buildings,  canGetInfo: true });
var buildings_layer_Novoolenivka  = L.geoJson(addressPolygon_layer_Novoolenivka, {renderer: L.canvas({pane: 'buildings'}),     pmIgnore: true,     snapIgnore: true,     id: 'buildings_layer_Novoolenivka',     layername: 'Полігони будинків Новооленівка',     style: style_Buildings,  canGetInfo: true });
var buildings_layer_Novopavlivka  = L.geoJson(addressPolygon_layer_Novopavlivka, {renderer: L.canvas({pane: 'buildings'}),     pmIgnore: true,     snapIgnore: true,     id: 'buildings_layer_Novopavlivka',     layername: 'Полігони будинків Новопавлівка',     style: style_Buildings,  canGetInfo: true });
var buildings_layer_Novotroyitske  = L.geoJson(addressPolygon_layer_Novotroyitske, {renderer: L.canvas({pane: 'buildings'}),     pmIgnore: true,     snapIgnore: true,     id: 'buildings_layer_Novotroyitske',     layername: 'Полігони будинків Новотроїцьке',     style: style_Buildings,  canGetInfo: true });
var buildings_layer_Novoukrayinka  = L.geoJson(addressPolygon_layer_Novoukrayinka, {renderer: L.canvas({pane: 'buildings'}),     pmIgnore: true,     snapIgnore: true,     id: 'buildings_layer_Novoukrayinka',     layername: 'Полігони будинків Новоукраїнка',     style: style_Buildings,  canGetInfo: true });
var buildings_layer_Preobrazhenka  = L.geoJson(addressPolygon_layer_Preobrazhenka, {renderer: L.canvas({pane: 'buildings'}),     pmIgnore: true,     snapIgnore: true,     id: 'buildings_layer_Preobrazhenka',     layername: 'Полігони будинків Преображенка',     style: style_Buildings,  canGetInfo: true });
var buildings_layer_Rih  = L.geoJson(addressPolygon_layer_Rih, {renderer: L.canvas({pane: 'buildings'}),     pmIgnore: true,     snapIgnore: true,     id: 'buildings_layer_Rih',     layername: 'Полігони будинків Ріг',     style: style_Buildings,  canGetInfo: true });
var buildings_layer_Sukhyy_Yar  = L.geoJson(addressPolygon_layer_Sukhyy_Yar, {renderer: L.canvas({pane: 'buildings'}),     pmIgnore: true,     snapIgnore: true,     id: 'buildings_layer_Sukhyy Yar',     layername: 'Полігони будинків Сухий Яр',     style: style_Buildings,  canGetInfo: true });
var buildings_layer_Troyanda  = L.geoJson(addressPolygon_layer_Troyanda, {renderer: L.canvas({pane: 'buildings'}),     pmIgnore: true,     snapIgnore: true,     id: 'buildings_layer_Troyanda',     layername: 'Полігони будинків Троянда',     style: style_Buildings,  canGetInfo: true });
var buildings_layer_Kotlyne  = L.geoJson(addressPolygon_layer_Kotlyne, {renderer: L.canvas({pane: 'buildings'}),     pmIgnore: true,     snapIgnore: true,     id: 'buildings_layer_Kotlyne',     layername: 'Полігони будинків Котлине',     style: style_Buildings,  canGetInfo: true });
var buildings_layer_Pershe_Travnya  = L.geoJson(addressPolygon_layer_Pershe_Travnya, {renderer: L.canvas({pane: 'buildings'}),     pmIgnore: true,     snapIgnore: true,     id: 'buildings_layer_Pershe Travnya',     layername: 'Полігони будинків Перше Травня',     style: style_Buildings,  canGetInfo: true });
var buildings_layer_Pushkine  = L.geoJson(addressPolygon_layer_Pushkine, {renderer: L.canvas({pane: 'buildings'}),     pmIgnore: true,     snapIgnore: true,     id: 'buildings_layer_Pushkine',     layername: 'Полігони будинків Пушкіне',     style: style_Buildings,  canGetInfo: true });
var buildings_layer_Chunyshyne  = L.geoJson(addressPolygon_layer_Chunyshyne, {renderer: L.canvas({pane: 'buildings'}),     pmIgnore: true,     snapIgnore: true,     id: 'buildings_layer_Chunyshyne',     layername: 'Полігони будинків Чунишине',     style: style_Buildings,  canGetInfo: true });
var buildings_layer_Novopustynka  = L.geoJson(addressPolygon_layer_Novopustynka, {renderer: L.canvas({pane: 'buildings'}),     pmIgnore: true,     snapIgnore: true,     id: 'buildings_layer_Novopustynka',     layername: 'Полігони будинків Новопустинка',     style: style_Buildings,  canGetInfo: true });
var buildings_layer_Novoandriyivka  = L.geoJson(addressPolygon_layer_Novoandriyivka, {renderer: L.canvas({pane: 'buildings'}),     pmIgnore: true,     snapIgnore: true,     id: 'buildings_layer_Novoandriyivka',     layername: 'Полігони будинків Новоандріївка',     style: style_Buildings,  canGetInfo: true });
var buildings_layer_Horikhove  = L.geoJson(addressPolygon_layer_Horikhove, {renderer: L.canvas({pane: 'buildings'}),     pmIgnore: true,     snapIgnore: true,     id: 'buildings_layer_Horikhove',     layername: 'Полігони будинків Горіхове',     style: style_Buildings,  canGetInfo: true });
var buildings_layer_Novoyelyzavetivka  = L.geoJson(addressPolygon_layer_Novoyelyzavetivka, {renderer: L.canvas({pane: 'buildings'}),     pmIgnore: true,     snapIgnore: true,     id: 'buildings_layer_Novoyelyzavetivka',     layername: 'Полігони будинків Новоєлизаветівка',     style: style_Buildings,  canGetInfo: true });
var buildings_layer_Novovasylivka  = L.geoJson(buildings_layer_Novovasylivka, {renderer: L.canvas({pane: 'buildings'}),     pmIgnore: true,     snapIgnore: true,     id: 'buildings_layer_Novovasylivka',     layername: 'Полігони будинків Нововасилівка',     style: style_Buildings,  canGetInfo: true });
var buildings_layer_Pishchane  = L.geoJson(addressPolygon_layer_Pishchane, {renderer: L.canvas({pane: 'buildings'}),     pmIgnore: true,     snapIgnore: true,     id: 'buildings_layer_Pishchane',     layername: 'Полігони будинків Піщане',     style: style_Buildings,  canGetInfo: true });
var buildings_layer_Novooleksandrivka  = L.geoJson(addressPolygon_layer_Novooleksandrivka, {renderer: L.canvas({pane: 'buildings'}),     pmIgnore: true,     snapIgnore: true,     id: 'buildings_layer_Novooleksandrivka',     layername: 'Полігони будинків Новоолександрівка',     style: style_Buildings,  canGetInfo: true });
var buildings_layer_Sribne  = L.geoJson(addressPolygon_layer_Sribne, {renderer: L.canvas({pane: 'buildings'}),     pmIgnore: true,     snapIgnore: true,     id: 'buildings_layer_Sribne',     layername: 'Полігони будинків Срібне',     style: style_Buildings,  canGetInfo: true });
var buildings_layer_Uspenivka  = L.geoJson(addressPolygon_layer_Uspenivka, {renderer: L.canvas({pane: 'buildings'}),     pmIgnore: true,     snapIgnore: true,     id: 'buildings_layer_Uspenivka',     layername: 'Полігони будинків Успенівка',     style: style_Buildings,  canGetInfo: true });
var buildings_layer_Yasenovo  = L.geoJson(addressPolygon_layer_Yasenovo, {renderer: L.canvas({pane: 'buildings'}),     pmIgnore: true,     snapIgnore: true,     id: 'buildings_layer_Yasenovo',     layername: 'Полігони будинків Ясенове',     style: style_Buildings,  canGetInfo: true });
var buildings_layer_Nadezhdinka  = L.geoJson(addressPolygon_layer_Nadezhdinka, {renderer: L.canvas({pane: 'buildings'}),     pmIgnore: true,     snapIgnore: true,     id: 'buildings_layer_Nadezhdinka',     layername: 'Полігони будинків Надеждинка',     style: style_Buildings,  canGetInfo: true });
var buildings_layer_Solone  = L.geoJson(addressPolygon_layer_Solone, {renderer: L.canvas({pane: 'buildings'}),     pmIgnore: true,     snapIgnore: true,     id: 'buildings_layer_Solone',     layername: 'Полігони будинків Солоне',     style: style_Buildings,  canGetInfo: true });
var buildings_layer_Vovkove  = L.geoJson(addressPolygon_layer_Vovkove, {renderer: L.canvas({pane: 'buildings'}),     pmIgnore: true,     snapIgnore: true,     id: 'buildings_layer_Vovkove',     layername: 'Полігони будинків Вовкове',     style: style_Buildings,  canGetInfo: true });



let settlement_list = {
'Pokrovsk' : {'boundaries_layer': 'boundaries_map_layer_Pokrovsk', 'streets_layer': 'streets_map_layer_Pokrovsk', 'buildings_layer': 'buildings_layer_Pokrovsk', 'ua_name': 'Покровськ', 'buildings_tiles': 'buildings_tiles_Pokrovsk', 'streets_tiles': 'streets_tiles_Pokrovsk'},
'Rodynske' : {'boundaries_layer': 'boundaries_map_layer_Rodynske', 'streets_layer': 'streets_map_layer_Rodynske', 'buildings_layer': 'buildings_layer_Rodynske', 'ua_name': 'Родинське', 'buildings_tiles': 'buildings_tiles_Rodynske', 'streets_tiles': 'streets_tiles_Rodynske'},
'Shevchenko' : {'boundaries_layer': 'boundaries_map_layer_Shevchenko', 'streets_layer': 'streets_map_layer_Shevchenko', 'buildings_layer': 'buildings_layer_Shevchenko', 'ua_name': 'Шевченко', 'buildings_tiles': 'buildings_tiles_Shevchenko', 'streets_tiles': 'streets_tiles_Shevchenko'},
'Hryshyne' : {'boundaries_layer': 'boundaries_map_layer_Hryshyne', 'streets_layer': 'streets_map_layer_Hryshyne', 'buildings_layer': 'buildings_layer_Hryshyne', 'ua_name': 'Гришине', 'buildings_tiles': 'buildings_tiles_Hryshyne', 'streets_tiles': 'streets_tiles_Hryshyne'},
'Bohdanivka' : {'boundaries_layer': 'boundaries_map_layer_Bohdanivka', 'streets_layer': 'streets_map_layer_Bohdanivka', 'buildings_layer': 'buildings_layer_Bohdanivka', 'ua_name': 'Богданівка', 'buildings_tiles': 'buildings_tiles_Bohdanivka', 'streets_tiles': 'streets_tiles_Bohdanivka'},
'Dachenske' : {'boundaries_layer': 'boundaries_map_layer_Dachenske', 'streets_layer': 'streets_map_layer_Dachenske', 'buildings_layer': 'buildings_layer_Dachenske', 'ua_name': 'Даченське', 'buildings_tiles': 'buildings_tiles_Dachenske', 'streets_tiles': 'streets_tiles_Dachenske'},
'Zelene' : {'boundaries_layer': 'boundaries_map_layer_Zelene', 'streets_layer': 'streets_map_layer_Zelene', 'buildings_layer': 'buildings_layer_Zelene', 'ua_name': 'Зелене', 'buildings_tiles': 'buildings_tiles_Zelene', 'streets_tiles': 'streets_tiles_Zelene'},
'Lysivka' : {'boundaries_layer': 'boundaries_map_layer_Lysivka', 'streets_layer': 'streets_map_layer_Lysivka', 'buildings_layer': 'buildings_layer_Lysivka', 'ua_name': 'Лисівка', 'buildings_tiles': 'buildings_tiles_Lysivka', 'streets_tiles': 'streets_tiles_Lysivka'},
'Novyy Trud' : {'boundaries_layer': 'boundaries_map_layer_Novyy_Trud', 'streets_layer': 'streets_map_layer_Novyy_Trud', 'buildings_layer': 'buildings_layer_Novyy_Trud', 'ua_name': 'Новий Труд', 'buildings_tiles': 'buildings_tiles_Novyy_Trud', 'streets_tiles': 'streets_tiles_Novyy_Trud'},
'Novoolenivka' : {'boundaries_layer': 'boundaries_map_layer_Novoolenivka', 'streets_layer': 'streets_map_layer_Novoolenivka', 'buildings_layer': 'buildings_layer_Novoolenivka', 'ua_name': 'Новооленівка', 'buildings_tiles': 'buildings_tiles_Novoolenivka', 'streets_tiles': 'streets_tiles_Novoolenivka'},
'Novopavlivka' : {'boundaries_layer': 'boundaries_map_layer_Novopavlivka', 'streets_layer': 'streets_map_layer_Novopavlivka', 'buildings_layer': 'buildings_layer_Novopavlivka', 'ua_name': 'Новопавлівка', 'buildings_tiles': 'buildings_tiles_Novopavlivka', 'streets_tiles': 'streets_tiles_Novopavlivka'},
'Novotroyitske' : {'boundaries_layer': 'boundaries_map_layer_Novotroyitske', 'streets_layer': 'streets_map_layer_Novotroyitske', 'buildings_layer': 'buildings_layer_Novotroyitske', 'ua_name': 'Новотроїцьке', 'buildings_tiles': 'buildings_tiles_Novotroyitske', 'streets_tiles': 'streets_tiles_Novotroyitske'},
'Novoukrayinka' : {'boundaries_layer': 'boundaries_map_layer_Novoukrayinka', 'streets_layer': 'streets_map_layer_Novoukrayinka', 'buildings_layer': 'buildings_layer_Novoukrayinka', 'ua_name': 'Новоукраїнка', 'buildings_tiles': 'buildings_tiles_Novoukrayinka', 'streets_tiles': 'streets_tiles_Novoukrayinka'},
'Preobrazhenka' : {'boundaries_layer': 'boundaries_map_layer_Preobrazhenka', 'streets_layer': 'streets_map_layer_Preobrazhenka', 'buildings_layer': 'buildings_layer_Preobrazhenka', 'ua_name': 'Преображенка', 'buildings_tiles': 'buildings_tiles_Preobrazhenka', 'streets_tiles': 'streets_tiles_Preobrazhenka'},
'Rih' : {'boundaries_layer': 'boundaries_map_layer_Rih', 'streets_layer': 'streets_map_layer_Rih', 'buildings_layer': 'buildings_layer_Rih', 'ua_name': 'Ріг', 'buildings_tiles': 'buildings_tiles_Rih', 'streets_tiles': 'streets_tiles_Rih'},
'Sukhyy Yar' : {'boundaries_layer': 'boundaries_map_layer_Sukhyy_Yar', 'streets_layer': 'streets_map_layer_Sukhyy_Yar', 'buildings_layer': 'buildings_layer_Sukhyy_Yar', 'ua_name': 'Сухий Яр', 'buildings_tiles': 'buildings_tiles_Sukhyy_Yar', 'streets_tiles': 'streets_tiles_Sukhyy_Yar'},
'Troyanda' : {'boundaries_layer': 'boundaries_map_layer_Troyanda', 'streets_layer': 'streets_map_layer_Troyanda', 'buildings_layer': 'buildings_layer_Troyanda', 'ua_name': 'Троянда', 'buildings_tiles': 'buildings_tiles_Troyanda', 'streets_tiles': 'streets_tiles_Troyanda'},
'Kotlyne' : {'boundaries_layer': 'boundaries_map_layer_Kotlyne', 'streets_layer': 'streets_map_layer_Kotlyne', 'buildings_layer': 'buildings_layer_Kotlyne', 'ua_name': 'Котлине', 'buildings_tiles': 'buildings_tiles_Kotlyne', 'streets_tiles': 'streets_tiles_Kotlyne'},
'Pershe Travnya' : {'boundaries_layer': 'boundaries_map_layer_Pershe_Travnya', 'streets_layer': 'streets_map_layer_Pershe_Travnya', 'buildings_layer': 'buildings_layer_Pershe_Travnya', 'ua_name': 'Перше Травня', 'buildings_tiles': 'buildings_tiles_Pershe_Travnya', 'streets_tiles': 'streets_tiles_Pershe_Travnya'},
'Pushkine' : {'boundaries_layer': 'boundaries_map_layer_Pushkine', 'streets_layer': 'streets_map_layer_Pushkine', 'buildings_layer': 'buildings_layer_Pushkine', 'ua_name': 'Пушкіне', 'buildings_tiles': 'buildings_tiles_Pushkine', 'streets_tiles': 'streets_tiles_Pushkine'},
'Chunyshyne' : {'boundaries_layer': 'boundaries_map_layer_Chunyshyne', 'streets_layer': 'streets_map_layer_Chunyshyne', 'buildings_layer': 'buildings_layer_Chunyshyne', 'ua_name': 'Чунишине', 'buildings_tiles': 'buildings_tiles_Chunyshyne', 'streets_tiles': 'streets_tiles_Chunyshyne'},
'Novopustynka' : {'boundaries_layer': 'boundaries_map_layer_Novopustynka', 'streets_layer': 'streets_map_layer_Novopustynka', 'buildings_layer': 'buildings_layer_Novopustynka', 'ua_name': 'Новопустинка', 'buildings_tiles': 'buildings_tiles_Novopustinka', 'streets_tiles': 'streets_tiles_Novopustinka'},
'Novoandriyivka' : {'boundaries_layer': 'boundaries_map_layer_Novoandriyivka', 'streets_layer': 'streets_map_layer_Novoandriyivka', 'buildings_layer': 'buildings_layer_Novoandriyivka', 'ua_name': 'Новоандріївка', 'buildings_tiles': 'buildings_tiles_Novoandriyivka', 'streets_tiles': 'streets_tiles_Novoandriyivka'},
'Horikhove' : {'boundaries_layer': 'boundaries_map_layer_Horikhove', 'streets_layer': 'streets_map_layer_Horikhove', 'buildings_layer': 'buildings_layer_Horikhove', 'ua_name': 'Горіхове', 'buildings_tiles': 'buildings_tiles_Horikhove', 'streets_tiles': 'streets_tiles_Horikhove'},
'Novoyelyzavetivka' : {'boundaries_layer': 'boundaries_map_layer_Novoyelyzavetivka', 'streets_layer': 'streets_map_layer_Novoyelyzavetivka', 'buildings_layer': 'buildings_layer_Novoyelyzavetivka', 'ua_name': 'Новоєлизаветівка', 'buildings_tiles': 'buildings_tiles_Novoyelyzavetivka', 'streets_tiles': 'streets_tiles_Novoyelyzavetivka'},
'Novovasylivka' : {'boundaries_layer': 'boundaries_map_layer_Novovasylivka', 'streets_layer': 'streets_map_layer_Novovasylivka', 'buildings_layer': 'buildings_layer_Novovasylivka', 'ua_name': 'Нововасилівка', 'buildings_tiles': 'buildings_tiles_Novovasylivka', 'streets_tiles': 'streets_tiles_Novovasylivka'},
'Pishchane' : {'boundaries_layer': 'boundaries_map_layer_Pishchane', 'streets_layer': 'streets_map_layer_Pishchane', 'buildings_layer': 'buildings_layer_Pishchane', 'ua_name': 'Піщане', 'buildings_tiles': 'buildings_tiles_Pishchane', 'streets_tiles': 'streets_tiles_Pishchane'},
'Novooleksandrivka' : {'boundaries_layer': 'boundaries_map_layer_Novooleksandrivka', 'streets_layer': 'streets_map_layer_Novooleksandrivka', 'buildings_layer': 'buildings_layer_Novooleksandrivka', 'ua_name': 'Новоолександрівка', 'buildings_tiles': 'buildings_tiles_Novooleksandrivka', 'streets_tiles': 'streets_tiles_Novooleksandrivka'},
'Sribne' : {'boundaries_layer': 'boundaries_map_layer_Sribne', 'streets_layer': 'streets_map_layer_Sribne', 'buildings_layer': 'buildings_layer_Sribne', 'ua_name': 'Срібне', 'buildings_tiles': 'buildings_tiles_Sribne', 'streets_tiles': 'streets_tiles_Sribne'},
'Uspenivka' : {'boundaries_layer': 'boundaries_map_layer_Uspenivka', 'streets_layer': 'streets_map_layer_Uspenivka', 'buildings_layer': 'buildings_layer_Uspenivka', 'ua_name': 'Успенівка', 'buildings_tiles': 'buildings_tiles_Uspenivka', 'streets_tiles': 'streets_tiles_Uspenivka'},
'Yasenovo' : {'boundaries_layer': 'boundaries_map_layer_Yasenovo', 'streets_layer': 'streets_map_layer_Yasenovo', 'buildings_layer': 'buildings_layer_Yasenovo', 'ua_name': 'Ясенове', 'buildings_tiles': 'buildings_tiles_Yasenovo', 'streets_tiles': 'streets_tiles_Yasenovo'},
'Nadezhdinka' : {'boundaries_layer': 'boundaries_map_layer_Nadezhdinka', 'streets_layer': 'streets_map_layer_Nadezhdinka', 'buildings_layer': 'buildings_layer_Nadezhdinka', 'ua_name': 'Надеждинка', 'buildings_tiles': 'buildings_tiles_Nadezhdinka', 'streets_tiles': 'streets_tiles_Nadezhdinka'},
'Solone' : {'boundaries_layer': 'boundaries_map_layer_Solone', 'streets_layer': 'streets_map_layer_Solone', 'buildings_layer': 'buildings_layer_Solone', 'ua_name': 'Солоне', 'buildings_tiles': 'buildings_tiles_Solone', 'streets_tiles': 'streets_tiles_Solone'},
'Vovkove' : {'boundaries_layer': 'boundaries_map_layer_Vovkove', 'streets_layer': 'streets_map_layer_Vovkove', 'buildings_layer': 'buildings_layer_Vovkove', 'ua_name': 'Вовкове', 'buildings_tiles': 'buildings_tiles_Vovkove', 'streets_tiles': 'streets_tiles_Vovkove'},

}  


/*

// streets_layer.on

// streets_layer.on('remove', function () {
//     map.removeLayer(streets_layer_wide)
// })
// streets_layer.on('add', function () {
//     map.addLayer(streets_layer_wide)
// })


var streets_list = {};

for (x in streets_layer._layers) {
    var props = streets_layer._layers[x].feature['properties'];
    var street_id = props['str_id']
    streets_list[street_id] = JSON.stringify(streets_layer._layers[x].toGeoJSON())


}


var connection_lines = L.geoJson();
connection_lines.options = {
    renderer: L.canvas(),
    layername: 'Лінії зв\'язку',
    id: 'connection_lines',
    pmIgnore: true,
    snapIgnore: true
}
buildings_layer.eachLayer(function (layer) {
    var props = layer.feature.properties;
    str_line = turf.multiLineString(JSON.parse(streets_list[props['str_id']])['geometry']['coordinates'])

    point_on_line = turf.nearestPointOnLine(str_line, turf.centroid(layer.feature.geometry))
    // console.log()
    // connection_lines.addLayer(L.polyline([turf.pointOnFeature(layer.feature.geometry)['geometry']['coordinates'].slice(0, 2).reverse(), point_on_line['geometry']['coordinates'].slice(0, 2).reverse()], {
        pmIgnore: true,
        snapIgnore: true
    }));
})


map.on('zoomend', function () {
    if (map.getZoom() <= 13 && map.hasLayer(buildings_layer) && map.hasLayer(streets_layer)) {

        map.removeLayer(buildings_layer);
        map.removeLayer(streets_layer);
        // map.removeLayer(connection_lines);
        map.removeLayer(labels_building_xyz);
        map.removeLayer(labels_streets_xyz)

    }
    if (map.getZoom() > 13 && map.hasLayer(buildings_layer) == false && map.hasLayer(streets_layer) == false) {
        map.addLayer(buildings_layer);
        map.addLayer(streets_layer);
        // map.addLayer(connection_lines);
        map.addLayer(labels_building_xyz);
        map.addLayer(labels_streets_xyz)

    }

    if (map.getZoom() <= 17 && map.hasLayer(connection_lines)) {

        map.removeLayer(connection_lines)

    }
    if (map.getZoom() > 17 && map.hasLayer(connection_lines) == false) {
        map.addLayer(connection_lines);

    }
});*/


//     console.log(user_layer_group)
var user_layers_list = []
for (x in Array.from({length: 11}, (v, i) => i)) {
    // console.log(x)
    window['user_layer_' + x] = L.geoJson()
    user_layers_list.push(window['user_layer_' + x])
    window['user_layer_' + x].options = {id: "user_layer_" + x}
    // console.log(window['user_layer_' + x].options)
}

var user_layer_group = L.layerGroup(user_layers_list)

var googlemaps = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
    maxNativeZoom: 18,
    maxZoom: 22,
    id: "GoogleMaps",
    layername: 'Google знімки із супутника'
}).addTo(map)

var openstreetmap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 22,
    id: "OpenStreetMap",
    layername: 'OpenStreetMap'
})

var arcgis_map = L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png', {
    maxZoom: 22,
    maxNativeZoom: 16,
    id: "WorldImageryArcGIS",
    layername: 'World Imagery (ArcGIS) знімки із супутника'
})

var whitebackground = L.tileLayer('url/{z}/{x}/{y}.png', {
    id: "whitebackground",
    maxZoom: 22,
    layername: 'Без фону',
    preferCanvas: true
});


function generate_layers_tree(settlement_list_var) {
var settlement_layers_tree = []
for (x in settlement_list_var) {
var settlement_ua_name = settlement_list_var[x]['ua_name']
var boundaries_layer = window[settlement_list_var[x]['boundaries_layer']]

var buildings_layer = window[settlement_list_var[x]['buildings_layer']]

streets_layer = window[settlement_list_var[x]['streets_layer']]

var labels_building_xyz = L.tileLayer(`tiles/${settlement_list_var[x]['buildings_tiles']}/OUTPUT_DIRECTORY/{z}/{x}/{y}.png` , {pane: 'labels', maxZoom: 22, minZoom: 12,
  maxNativeZoom: 19, id: "labels_building_xyz", layername: 'Номери будівель', preferCanvas: true/*, tms: true*/})

var labels_streets_xyz = L.tileLayer(`tiles/${settlement_list_var[x]['streets_tiles']}/OUTPUT_DIRECTORY/{z}/{x}/{y}.png`, {pane: 'labels', maxZoom: 22, minZoom: 12,
  maxNativeZoom: 19, id: "labels_streets_xyz", layername: 'Назви вулиць', preferCanvas: true/*, tms: true*/})

settlement_address_layer_tree = {label: `${settlement_ua_name}. Адресний реєстр`, selectAllCheckbox: true, collapsed: true, children: [  

       {label: 'Будівлі та споруди', selectAllCheckbox: true, children: [
        {label: buildings_layer.options.layername, layer: buildings_layer},
       
       {label: labels_building_xyz.options.layername, layer: labels_building_xyz}
       ]},
                      { label: 'Вулиці', selectAllCheckbox: true, children: [
                    {label: streets_layer.options.layername, layer: streets_layer},
                       {label: labels_streets_xyz.options.layername, layer: labels_streets_xyz}]},
                  
         
                           {label: 'Межа населеного пункту', selectAllCheckbox: true, children: [
        {label: boundaries_layer.options.layername, layer: boundaries_layer}
       ]}
    
                    
                ]}

settlement_layers_tree.push(settlement_address_layer_tree)
}
return settlement_layers_tree
}

var users_layers_tree = [
//                         {label: 'СТВОРИТИ НОВИЙ ШАР <input type="file" name="inputfile" id="inputfile" onchange="file_upload(this)">'},
    {label: '<p></p>'},
    {label: '<button name="create_layer" id="create_layer" href="#popup_window" onclick="show_popup_create_layer()">СТВОРИТИ НОВИЙ ШАР</button>'},
    {label: '<button name="upload_layer" id="upload_layer" href="#popup_window" onclick="show_popup_upload_layer()">ЗАВАНТАЖИТИ ШАР НА КАРТУ</button>'},
    {label: `<button name="save_geoman_layer" id="save_geoman_layer" href="#popup_window" onclick="show_popup_save_drawn_layer('${LayerDrawnByGeoman.options.id}')">ЗБЕРЕГТИ НАМАЛЬОВАНІ ФІГУРИ</button>`}
]


var baseTree = {
    label: 'Базові карти',
    selectAllCheckbox: 'Un/select all',
    children: [
        {label: whitebackground.options.layername, layer: whitebackground},
        {label: googlemaps.options.layername, layer: googlemaps},
        {label: openstreetmap.options.layername, layer: openstreetmap},
        {label: arcgis_map.options.layername, layer: arcgis_map}

    ]
}

var systemOverlayTree = {
    label: 'СИСТЕМНІ ШАРИ',
    selectAllCheckbox: true,
    children: [
        {label: LayerDrawnByGeoman.options.layername, layer: LayerDrawnByGeoman},
 {
             label: 'АДРЕСНИЙ РЕЄСТР',
             selectAllCheckbox: true,
             collapsed: true,
             children: generate_layers_tree(settlement_list)
         },
       

        {label: Parcels.options.layername, layer: Parcels},
        {label: IKK.options.layername, layer: IKK}


    ]
}

var overlaysTree = {
    label: 'ШАРИ КАРТИ',
    selectAllCheckbox: true,
    children: [
        systemOverlayTree,
        {label: '<div class="leaflet-control-layers-separator"></div>'},
        {
            label: 'ШАРИ КОРИСТУВАЧА',
            selectAllCheckbox: true,
            children: users_layers_tree
        }
    ]
}

silrada = L.featureGroup([Parcels])


var control_layers = L.control.layers.tree(baseTree, overlaysTree, {
    selectorBack: false,
    closedSymbol: '&#8862; &#x1f5c0;',
    openedSymbol: '&#8863; &#x1f5c1;',

}).addTo(map);

change_geoman_map_events()
change_geoman_map_events()
change_geoman_map_events()

function save_layer(layer_id, layer_name) {
//      console.log(layer_id)
    var collection = window[layer_id].toGeoJSON();
    var bounds = map.getBounds();

    collection.bbox = [[
        bounds.getSouthWest().lng,
        bounds.getSouthWest().lat,
        bounds.getNorthEast().lng,
        bounds.getNorthEast().lat
    ]];

    function download(content, fileName, contentType) {
        var a = document.createElement("a");
        var file = new Blob([content], {type: contentType});
//         a.href = URL.createObjectURL(file);
//         a.download = fileName;
//         a.click();
        saveAs(file, filename);
    }

    var file = new File([JSON.stringify(collection)], layer_name + '.geojson', {type: "text/plain;charset=utf-8"});
    saveAs(file);
//     download(JSON.stringify(collection), layer_name + '.geojson', 'text/plain');

    setTimeout(() => {
        close_popup_window()
    }, 500);

}


function get_id_empty_user_layer() {
    var active_user_layer_list = get_all_user_layer_list()
    if (active_user_layer_list.length === 0) {
        // console.log('length = 0')
        return 'user_layer_0'
    } else if (active_user_layer_list.length !== 0) {
        var all_user_layers_list = new Array(0)
        for (x in user_layer_group._layers) {
            all_user_layers_list.push(user_layer_group._layers[x].options.id)
        }

        for (y in active_user_layer_list) {
            all_user_layers_list.shift(active_user_layer_list[y])
        }

        return all_user_layers_list[0]
    }
}


function change_geoman_map_events() {
    edit_layers_id_list = get_edit_layers_id_list()
    edit_layers_list = new Array(0)
    for (x in edit_layers_id_list) {
        edit_layers_list.push(window[edit_layers_id_list[x]])
    }

    var drawn_layer_feature_group = L.featureGroup(edit_layers_list)
    map.pm.setGlobalOptions({
        layerGroup: drawn_layer_feature_group,
        panes: {vertexPane: 'Geoman_marker', layerPane: 'Geoman', markerPane: 'Geoman_marker'}
    })

    map.pm.setPathOptions(
        {
            color: 'orange',
            weight: 7,
            stripeColor: 'black',
            icon: orangeIcon, /*renderer: L.canvas(), */
            stripeId: "diagonal_left_down_to_right_up"
        },
        {
            merge: true, ignoreShapes: ['Line'],
        }
    );
//      map.pm.markerStyle({icon: orangeIcon})

    map.removeEventListener('pm:create')
    drawn_layer_feature_group.removeEventListener('pm:update')
    drawn_layer_feature_group.removeEventListener('pm:markerdrag')
    drawn_layer_feature_group.removeEventListener('pm:cut')
    drawn_layer_feature_group.removeEventListener('pm:edit')
    drawn_layer_feature_group.removeEventListener('pm:remove')

    map.on('pm:create', e => {
        if (edit_layers_id_list.length === 1 && edit_layers_id_list[0] === 'LayerDrawnByGeoman') {
            LayerDrawnByGeoman.addData(e.layer.toGeoJSON())
        } else if (edit_layers_id_list.length > 1) {
            show_popup_create_properties_value(e.layer.toGeoJSON())
        }

        for (x in LayerDrawnByGeoman._layers) {
            // console.log(LayerDrawnByGeoman._layers[x])


            if (LayerDrawnByGeoman._layers[x].feature.geometry.type === 'Polygon' || LayerDrawnByGeoman._layers[x].feature.geometry.type === 'MultiPolygon') {
                LayerDrawnByGeoman._layers[x].options.color = 'orange'
                LayerDrawnByGeoman._layers[x].options.stripeColor = 'black'
                LayerDrawnByGeoman._layers[x].options.stripeId = 'diagonal_left_down_to_right_up'
            }

            bindTooltip_geometry_info(LayerDrawnByGeoman._layers[x])
        }
        points = []
        geoman_info_label = ``
    })

    drawn_layer_feature_group.on('pm:update', e => {
        // console.log(e)
        geoman_info_label = ``
        layer_id = e.layer.options.id
        leaflet_id = e.layer._leaflet_id
        raw_geojson_data = JSON.stringify(e.layer.toGeoJSON())
        change_object_property(layer_id, leaflet_id, raw_geojson_data)
    })

    drawn_layer_feature_group.on('pm:markerdrag', e => {

        if (e.layer.pm.getShape() === "Polygon") {

            geoman_info_label = `<b style="font-size: 15px">Площа: ${(turf.area(e.layer.toGeoJSON()) / 10000).toFixed(4)} га| Периметр: ${(turf.length(e.layer.toGeoJSON(), {units: 'meters'})).toFixed(1)} м</b>`
        } else if (e.layer.pm.getShape() === "Line") {
            geoman_info_label = `<b style="font-size: 14px">Довжина: ${turf.length(e.layer.toGeoJSON(), {units: 'meters'}).toFixed(1)} м </b>`
        }
    })

    drawn_layer_feature_group.on('pm:cut', e => {
        // console.log('cuted')

        e.originalLayer.setLatLngs(e.layer.getLatLngs());
        e.originalLayer.addTo(map);
        e.originalLayer._pmTempLayer = false;

        e.layer._pmTempLayer = true;
        e.layer.remove();

        if (e.originalLayer.options.id === 'LayerDrawnByGeoman') {
            for (x in LayerDrawnByGeoman._layers) {
                bindTooltip_geometry_info(LayerDrawnByGeoman._layers[x])
            }

        }
    })

    drawn_layer_feature_group.on('pm:edit', e => {

        setTimeout(() => geoman_info_label = ``, 1000)
    })

    drawn_layer_feature_group.on('pm:remove', e => {
        delete_object_from_layer(e.layer.options.id, e.layer._leaflet_id)

    })


}

function add_layer_to_overlay_tree(user_layer_id) {
    users_layers_tree.unshift({
        label: `${window[user_layer_id].options.layername} <button name="save_window[user_layer_id]" id="save_window${user_layer_id}" href="#popup_window" onclick="show_popup_save_drawn_layer('${window[user_layer_id].options.id}')">ЗБЕРЕГТИ ШАР</button>  <button name="remove_window${user_layer_id}" id="remove_window_${user_layer_id}" href="#popup_window" onclick="remove_layer('${window[user_layer_id].options.id}')">ВИДАЛИТИ ШАР</button>`,
        layer: window[user_layer_id]
    })

    control_layers.setOverlayTree(overlaysTree)
}

function upload_layer(layer_file, layer_options) {

    user_layer_id = get_id_empty_user_layer()

    layer_options.id = user_layer_id

    var data_attributes_dict = {}
    var layer_properties = JSON.parse(file_content).features[0].properties

    for (x in layer_properties) {
        if (typeof layer_properties[x] === 'object' || typeof layer_properties[x] === undefined) {
            data_attributes_dict[x] = 'string'
        } else {
            data_attributes_dict[x] = typeof layer_properties[x]
        }
    }
    layer_options.data_attributes = data_attributes_dict
    window[user_layer_id] = L.geoJson(JSON.parse(layer_file), layer_options)

    add_layer_to_overlay_tree(user_layer_id)

    change_geoman_map_events()

    window[user_layer_id].addTo(map);

    setTimeout(() => {
        close_popup_window()
    }, 500);

}

function create_new_layer(layer_options) {
    user_layer_id = get_id_empty_user_layer()

    layer_options.id = user_layer_id

    window[user_layer_id] = L.geoJson().addTo(map);

    window[user_layer_id].options = layer_options

    add_layer_to_overlay_tree(user_layer_id)

    change_geoman_map_events()

    // console.log(window[user_layer_id])

    setTimeout(() => {
        close_popup_window()
    }, 500);


}

function remove_layer(layer_id) {
    // console.log(users_layers_tree)
    // console.log(layer_id)
    map.removeLayer(window[layer_id])
    for (x in users_layers_tree) {
        if (users_layers_tree[x].layer === window[layer_id]) {
            delete users_layers_tree[x]
        }
    }

    control_layers.setOverlayTree(overlaysTree);
    delete sessionStorage['last_clicked_layer']
//     document.getElementById('show_hide_info_control_container').click();
    hide_info_container()
    change_geoman_map_events()
    setTimeout(() => {
        close_popup_window()
    }, 500);
}

function delete_object_from_layer(layer_id, leaflet_id) {
    window[layer_id].removeLayer(window[layer_id].getLayer(leaflet_id))

//     delete window[layer_id].getLayer(leaflet_id)
    delete sessionStorage['last_clicked_layer']
//     document.getElementById('show_hide_info_control_container').click();
    hide_info_container()
}


function show_popup_save_drawn_layer(layer_id) {
    var popup_window = document.getElementById('popup_window')
    // console.log(layer_id)
    popup_window.innerHTML = `<div class="popup">
        <form action="javascript:save_layer('${layer_id}', document.getElementById('layer_name').value)">
		<h2>Введіть назву файлу</h2>
		<a class="close" href="#" onclick='close_popup_window()'>&times;</a>
		<div class="content">
			<input id="layer_name" type="text">
			<button type="submit">Зберегти</button>
			<p style='font-size: 1em'>Назву шару рекомендовано вводити латинськими літерами<p>
		</div>
		</form>
	</div>`
    popup_window.style.visibility = 'visible';
    popup_window.style.opacity = 1

}

function get_edit_layers_id_list() {
    var layers_list_for_save = new Array(0)

    layers_list_for_save.push('LayerDrawnByGeoman')
    var active_user_layer_list = get_all_user_layer_list()

    // console.log(active_user_layer_list)

    if (active_user_layer_list.length !== 0) {
        for (x in active_user_layer_list) {
            if (window[active_user_layer_list[x]].options.pmIgnore === undefined) {
                layers_list_for_save.push(active_user_layer_list[x])
            }
        }
    }

    return layers_list_for_save
}

function show_popup_change_properties_value(layer_id, leaflet_id) {
//     console.log(layer_id)
    geojson_data = window[layer_id].getLayer(leaflet_id).toGeoJSON()
    var popup_window = document.getElementById('popup_window')

    var layers_list_for_save = get_edit_layers_id_list()

    var layers_innerHTML = ``

    var geojson_data_text_el = document.createElement('text')
    geojson_data_text_el.setAttribute('id', "geojson_data_el")
    geojson_data_text_el.hidden = true;

    var layer_for_save_select_tag = document.createElement('select')
    layer_for_save_select_tag.setAttribute('id', "layer_for_save_select_tag")

    var layer_properties_div = document.createElement('div')
    layer_properties_div.setAttribute('id', "layer_properties_div")

    layers_innerHTML += `<br> ${layer_properties_div.outerHTML} <br>`

    geojson_innerHTML = `${geojson_data_text_el.outerHTML}`

    geometry_info_innerHTML = `<b style="font-size: 14px">Геометричні параметри об'єкту: <br>Площа: ${(turf.area(geojson_data) / 10000).toFixed(4)} га     |     
      Периметр: ${(turf.length(geojson_data, {units: 'meters'})).toFixed(1)} м </b>`

    popup_window.innerHTML = `<div class="popup">
        <form id='properties_form' action="javascript:change_object_property('${layer_id}', '${leaflet_id}', document.getElementById('geojson_data_el').innerHTML)">
        
 		<h2>Оберіть шар для збереження об'єкту</h2>
 		<a class="close" href="#" onclick='close_popup_window()'>&times;</a>
 		${geojson_innerHTML}
 		${geometry_info_innerHTML}
 		<div class="content">
 			${layers_innerHTML}
 			<button type="submit">Зберегти</button>         
 		</div>
 		</form>
 	</div>`

    layer_properties_div = document.getElementById("layer_properties_div")


    var table_inner = `<tr><td colspan="2">Встановіть значення атрибутів</td></tr>`
    for (y in window[layer_id].getLayer(leaflet_id).options.data_attributes) {

        if (window[layer_id].getLayer(leaflet_id).options.data_attributes[y] === 'number') {
            table_inner += `<tr>
        <td>${y}</td>
        <td><input type="${window[layer_id].getLayer(leaflet_id).options.data_attributes[y]}" id="${y}" value="${window[layer_id].getLayer(leaflet_id).feature.properties[y]}" step="0.0001"></td>
        </tr>`
        } else {
            table_inner += `<tr>
            <td>${y}</td>
            <td><input type="${window[layer_id].getLayer(leaflet_id).options.data_attributes[y]}" value="${window[layer_id].getLayer(leaflet_id).feature.properties[y]}" id="${y}"></td>
            </tr>`
        }

    }
    layer_properties_div.innerHTML = `<table>${table_inner}</table>`

    document.getElementById('properties_form').onclick = function () {
        // console.log('click')
        if (layer_properties_div.innerHTML !== ``) {
            var input_list = layer_properties_div.getElementsByTagName('INPUT')
            var layer_properties = {}
            for (x in input_list) {
                if (input_list[x].tagName === 'INPUT') {
                    layer_properties[input_list[x].id] = input_list[x].value
                }
            }
            geojson_data.properties = layer_properties
            // console.log(geojson_data)
        }
        document.getElementById('geojson_data_el').innerHTML = JSON.stringify(geojson_data)

    }
    document.getElementById('properties_form').dispatchEvent(new Event('change'))

    popup_window.style.visibility = 'visible';
    popup_window.style.opacity = 1

}


function change_object_property(layer_id, leaflet_id, raw_geojson_data) {
//     console.log(layer_id, leaflet_id)
//     console.log(window[layer_id].getLayer(leaflet_id))
    geojson_data = JSON.parse(raw_geojson_data)
    window[layer_id].getLayer(leaflet_id).feature = geojson_data
    hide_info_container()
    setTimeout(() => {
        close_popup_window()
    }, 500);

}

function show_popup_create_properties_value(geojson_data) {

    var popup_window = document.getElementById('popup_window')

    var layers_list_for_save = get_edit_layers_id_list()

    var layers_innerHTML = ``

    var geojson_data_text_el = document.createElement('text')
    geojson_data_text_el.setAttribute('id', "geojson_data_el")
    geojson_data_text_el.hidden = true;

    var layer_for_save_select_tag = document.createElement('select')
    layer_for_save_select_tag.setAttribute('id', "layer_for_save_select_tag")

    var layer_properties_div = document.createElement('div')
    layer_properties_div.setAttribute('id', "layer_properties_div")

    for (x in layers_list_for_save) {
        var select_layer_option_tag = document.createElement('option')
        select_layer_option_tag.setAttribute('id', layers_list_for_save[x])
        select_layer_option_tag.setAttribute('value', layers_list_for_save[x])
        select_layer_option_tag.textContent = window[layers_list_for_save[x]].options.layername
        layer_for_save_select_tag.appendChild(select_layer_option_tag)
    }

    layers_innerHTML += `${layer_for_save_select_tag.outerHTML} <br><br> ${layer_properties_div.outerHTML} <br>`

    layer_for_save_select_tag.dispatchEvent(new Event('change'))

    geojson_innerHTML = `${geojson_data_text_el.outerHTML}`

    geometry_info_innerHTML = `<b style="font-size: 14px">Геометричні параметри об'єкту: <br>Площа: ${(turf.area(geojson_data) / 10000).toFixed(4)} га     |     
      Периметр: ${(turf.length(geojson_data, {units: 'meters'})).toFixed(1)} м </b>`

    popup_window.innerHTML = `<div class="popup">
        <form id='properties_form' action="javascript:add_new_object_to_layer(layer_for_save_select_tag.value, document.getElementById('geojson_data_el').innerHTML)">
        
 		<h2>Оберіть шар для збереження об'єкту</h2>
 		<a class="close" href="#" onclick='close_popup_window()'>&times;</a>
 		${geojson_innerHTML}
 		${geometry_info_innerHTML}
 		<div class="content">
 			${layers_innerHTML}
 			<button type="submit">Зберегти</button>         
 		</div>
 		</form>
 	</div>`


    layer_for_save_select_tag = document.getElementById("layer_for_save_select_tag")
    layer_properties_div = document.getElementById("layer_properties_div")

    layer_for_save_select_tag.onchange = function () {

        if (layer_for_save_select_tag.value === 'LayerDrawnByGeoman') {
            layer_properties_div.innerHTML = ``
        } else if (Object.entries(window[layer_for_save_select_tag.value].options.data_attributes).length === 0) {
            layer_properties_div.innerHTML = ``
        } else if (Object.entries(window[layer_for_save_select_tag.value].options.data_attributes).length > 0) {
            var table_inner = `<tr><td colspan="2">Встановіть значення атрибутів</td></tr>`
            for (y in window[layer_for_save_select_tag.value].options.data_attributes) {

                if (window[layer_for_save_select_tag.value].options.data_attributes[y] === 'number') {
                    table_inner += `<tr>
                        <td>${y}</td>
                        <td><input type="${window[layer_for_save_select_tag.value].options.data_attributes[y]}" id="${y}" step="0.0001"></td>
                    </tr>`


                } else {
                    table_inner += `<tr>
                        <td>${y}</td>
                        <td><input type="${window[layer_for_save_select_tag.value].options.data_attributes[y]}" id="${y}"></td>
                    </tr>`
                }

            }
            layer_properties_div.innerHTML = `<table>${table_inner}</table>`
        }

    }

    document.getElementById('properties_form').onclick = function () {
        // console.log('click')
        if (layer_properties_div.innerHTML !== ``) {
            var input_list = layer_properties_div.getElementsByTagName('INPUT')
            var layer_properties = {}
            for (x in input_list) {
                if (input_list[x].tagName === 'INPUT') {
                    layer_properties[input_list[x].id] = input_list[x].value
                }
            }
            geojson_data.properties = layer_properties
            // console.log(geojson_data)
        }
        document.getElementById('geojson_data_el').innerHTML = JSON.stringify(geojson_data)


//         console.log(geojson_data)
    }
    document.getElementById('properties_form').dispatchEvent(new Event('change'))

    popup_window.style.visibility = 'visible';
    popup_window.style.opacity = 1

}

// function read_geojson()

function add_new_object_to_layer(layer_id, raw_geojson_data) {
    geojson_data = JSON.parse(raw_geojson_data)
    window[layer_id].addData(geojson_data)
    if (layer_id === 'LayerDrawnByGeoman') {
        for (x in LayerDrawnByGeoman._layers) {
            bindTooltip_geometry_info(LayerDrawnByGeoman._layers[x])
        }
    }


    setTimeout(() => {
        close_popup_window()
    }, 500);

}

function show_popup_create_layer() {
    var popup_window = document.getElementById('popup_window')

    popup_window.innerHTML = `<div class="popup">
        <form action="javascript:get_new_layer_options_values()">
		<h2>Додати новий шар</h2>
		<a class="close" href="#" onclick='close_popup_window()'>&times;</a>
		<div class="content">
			<table style="border: 1px solid #000; border-collapse: collapse;">
  <tr>
    <td colspan=2 style="text-align: center">
        <label for="layer_name">Назва шару</label>
        <input id="layer_name" type="text" required>
    </td>
  </tr>
    <tr>
        <td>
            <label for="borderColor">Колір лінії межі</label>
            <input id="borderColor" type="color" value="#000000" >
        </td>
        <td>
            <label for="fillColor">Колір фону</label>
            <input id="fillColor" type="color" value="#ffffff" >
            <p><label for="transparency">Прозорість фону </label>
            <input id="transparency" type="number" min="0" max="100" value="100" maxlength="3" ></p>
        </td>
    </tr>
    
    <tr>
        <td>
            <p><input type="checkbox" id="stripe_checkbox" name="stripe_checkbox" onclick="set_stripes()" />
             <label for="stripe_checkbox">Штриховка</label></p>
            <input type="radio" id="diagonal_left_up_to_right_down" name="stripesRadio" onclick="set_layer_final_view()" />
            <label for="diagonal_left_up_to_right_down"><canvas id="stripe0" name="stripe_example" width="200" height="200"  style="width:40px; height:40px;" ></canvas></label>
            <input type="radio" id="diagonal_left_down_to_right_up" name="stripesRadio" onclick="set_layer_final_view()" />
            <label for="diagonal_left_down_to_right_up"><canvas id="stripe1" name="stripe_example" width="200" height="200"  style="width:40px; height:40px;" ></canvas></label>
            <input type="radio" id="crossing" name="stripesRadio" onclick="set_layer_final_view()" />
            <label for="crossing"><canvas id="stripe2" name="stripe_example" width="200" height="200"  style="width:40px; height:40px;" ></canvas></label>
            <input type="radio" id="horizontal" name="stripesRadio" onclick="set_layer_final_view()" />
            <label for="horizontal"><canvas id="stripe3" name="stripe_example" width="200" height="200"  style="width:40px; height:40px;" ></canvas></label>
            <input type="radio" id="vertical" name="stripesRadio" onclick="set_layer_final_view()" />
            <label for="vertical"><canvas id="stripe4" name="stripe_example" width="200" height="200"  style="width:40px; height:40px;" ></canvas></label>
            <p><label for="strokeColor">Колір штриховки </label><input id="strokeColor" type="color" value="#000000" ></p>
        </td>
        <td>

            
            <p><input type="checkbox" id="snapIgnore" name="snapIgnore" />
            <label for="snapIgnore">Прилипання до шару</label></p>
        </td>
    </tr>
    <tr>
        <td colspan="2" style="text-align: center"> 
            Вигляд шару
            <canvas id="layer_final_view" width="400" height="200"  style="width:100px; height:50px;" ></canvas>
        </td>
    </tr>
</table>
<br>
<div id="attributes_table" style="height:150px; width: 350px; overflow: auto;">

</div>
  <br>   
			<button type="submit">Додати новий шар на карту</button>
			
		</div>
		</form>
	</div>`
    set_elements_new_layer_events()
    popup_window.style.visibility = 'visible';
    popup_window.style.opacity = 1

}

function show_popup_upload_layer() {
    var popup_window = document.getElementById('popup_window')

    popup_window.innerHTML = `<div class="popup">
        <form action="javascript:get_upload_values()">
		<h2>Завантаження шару</h2>
		<a class="close" href="#" onclick='close_popup_window()'>&times;</a>
		<div class="content">
			<table style="border: 1px solid #000; border-collapse: collapse;">
  <tr>
    <td style="text-aling: left">
        <label for="layer_file">Оберіть файл</label>
        <input id="layer_file" type="file" required>
    </td>
    <td style="text-aling: left">
        <label for="layer_name">Назва шару</label>
        <input id="layer_name" type="text" required>
    </td>
  </tr>
    <tr>
        <td>
            <label for="borderColor">Колір лінії межі</label>
            <input id="borderColor" type="color" value="#000000" >
        </td>
        <td>
            <label for="fillColor">Колір фону</label>
            <input id="fillColor" type="color" value="#ffffff" >
            <p><label for="transparency">Прозорість фону </label>
            <input id="transparency" type="number" min="0" max="100" value="100" maxlength="3" ></p>
        </td>
    </tr>
    
    <tr>
        <td>
            <p><input type="checkbox" id="stripe_checkbox" name="stripe_checkbox" onclick="set_stripes()" />
             <label for="stripe_checkbox">Штриховка</label></p>
            <input type="radio" id="diagonal_left_up_to_right_down" name="stripesRadio" onclick="set_layer_final_view()" />
            <label for="diagonal_left_up_to_right_down"><canvas id="stripe0" name="stripe_example" width="200" height="200"  style="width:40px; height:40px;" ></canvas></label>
            <input type="radio" id="diagonal_left_down_to_right_up" name="stripesRadio" onclick="set_layer_final_view()" />
            <label for="diagonal_left_down_to_right_up"><canvas id="stripe1" name="stripe_example" width="200" height="200"  style="width:40px; height:40px;" ></canvas></label>
            <input type="radio" id="crossing" name="stripesRadio" onclick="set_layer_final_view()" />
            <label for="crossing"><canvas id="stripe2" name="stripe_example" width="200" height="200"  style="width:40px; height:40px;" ></canvas></label>
            <input type="radio" id="horizontal" name="stripesRadio" onclick="set_layer_final_view()" />
            <label for="horizontal"><canvas id="stripe3" name="stripe_example" width="200" height="200"  style="width:40px; height:40px;" ></canvas></label>
            <input type="radio" id="vertical" name="stripesRadio" onclick="set_layer_final_view()" />
            <label for="vertical"><canvas id="stripe4" name="stripe_example" width="200" height="200"  style="width:40px; height:40px;" ></canvas></label>
            <p><label for="strokeColor">Колір штриховки </label><input id="strokeColor" type="color" value="#000000" ></p>
        </td>
        <td>

            <p><input type="checkbox" id="pmIgnore" name="pmIgnore" />
            <label for="pmIgnore">Редагування шару</label></p>
            <p><input type="checkbox" id="snapIgnore" name="snapIgnore" />
            <label for="snapIgnore">Прилипання до шару</label></p>
        </td>
    </tr>
    <tr>
        <td colspan="2" style="text-align: center"> 
            Вигляд шару
            <canvas id="layer_final_view" width="400" height="200"  style="width:100px; height:50px;" ></canvas>
        </td>
    </tr>
</table>
			<button type="submit">Додати шар на карту</button>
			
		</div>
		</form>
	</div>`
    set_el_events()
    popup_window.style.visibility = 'visible';
    popup_window.style.opacity = 1

}

function close_popup_window() {
    var popup_window = document.getElementById('popup_window')
    popup_window.innerHTML = ``
    popup_window.style.visibility = 'hidden';
    popup_window.style.opacity = 0

}

function randomPointInPoly(layer) {
    // https://gis.stackexchange.com/questions/163044/mapbox-how-to-generate-a-random-coordinate-inside-a-polygon
    var bounds = layer.getBounds();
    var x_min = bounds.getEast();
    var x_max = bounds.getWest();
    var y_min = bounds.getSouth();
    var y_max = bounds.getNorth();

    var lat_point = y_min + (Math.random() * (y_max - y_min));
    var lng_point = x_min + (Math.random() * (x_max - x_min));

    var point = turf.point([lng_point, lat_point]);
    var poly = layer.toGeoJSON();
    var inside = turf.booleanPointInPolygon(point, poly);

    if (inside) {
        return point
    } else {
        return randomPointInPoly(layer)
    }
}

var searchControl = new L.Control.Search({
    layer: Parcels,  // Determines the name of variable, which includes our GeoJSON layer!
    propertyName: 'cadnum',
    marker: false,
    moveToLocation: function (latlng, title, map) {
        var zoom = map.getBoundsZoom(latlng.layer.getBounds());
        map.setView(latlng, zoom); // access the zoom
    }
});


searchControl.on('search:locationfound', function (e) {
    point_in_layer = (randomPointInPoly(e.layer))
    lat = point_in_layer['geometry']['coordinates'][1]
    lng = point_in_layer['geometry']['coordinates'][0]
    map.fireEvent('click', {latlng: [lat, lng]})
})


searchControl.on('search:expanded', function (e) {
    var search_input = document.getElementById('searchtext9')
    var patternMask = IMask(search_input, {
        mask: '0000000000{:}00{:}000{:}0000', lazy: false

    });
    search_input.setSelectionRange(0, 0);
})


map.addControl(searchControl);

L.control.zoom({
    position: 'topleft'
}).addTo(map);


const search_adress_control_container = L.Control.extend({
    onAdd: map => {
        const container = L.DomUtil.create("div", 'leaflet-control-zoom leaflet-bar');
        const search_adress_show_hide_button = document.createElement('a');
        search_adress_show_hide_button.setAttribute('id', 'search_adress')
        search_adress_show_hide_button.setAttribute('class', 'leaflet-buttons-control-button')
        search_adress_show_hide_button.setAttribute('role', 'button')
        search_adress_show_hide_button.setAttribute('tabindex', '0')
        search_adress_show_hide_button.setAttribute('href', '#')
		search_adress_show_hide_button.style.setProperty('background-color', "#bdfcff")
        search_adress_show_hide_button.innerHTML = '<i class="fa-solid fa-a"></i>'

        search_adress_show_hide_button.onclick = function () {

            var popup_window = document.getElementById('popup_window')

            popup_window.innerHTML = `<div class="popup" >
      <a class="close" href="#" onclick='close_popup_window()'>&times;</a>
      </br>
		<div class="content" style="height: 490px;">
		<p></p>
		 <table style="width:100%; border:0px; font-weight: normal>
		             <tr style="border:0px; padding:5px; font-weight: normal">
            <th style="border:0px; padding:10px; text-align:left; font-weight: normal;"><label for="demo-3">Оберіть населений пункт</label>
<select id="demo-3" placeholder="Оберіть вулицю" position='bottom' aria-selected="false">
</select></th>
            <th style="border:0px; padding:10px; text-align:right; width:15%"><button onclick="search_city()" style="padding:10px; font-size:1em">Знайти населений пукнт</button></th>
            </tr>
		 
                
            <tr style="border:0px; padding:5px; font-weight: normal">
            <th style="border:0px; padding:10px; text-align:left; font-weight: normal;"><label for="demo-1">Оберіть об'єкт вулично-дорожньої мережі (вулицю)</label>
<select id="demo-1" placeholder="Оберіть вулицю" position='bottom' aria-selected="false">
</select></th>
            <th style="border:0px; padding:10px; text-align:right; width:15%"><button onclick="search_street()" style="padding:10px; font-size:1em">Знайти вулицю</button></th>
            </tr>
          
  


<tr style="border:0px; padding:5px">
 <th style="border:0px; padding:10px; text-align:left; font-weight: normal; font-size:1em">
<label for="demo-2">Оберіть номер будинку</label>
<select name="demo-2" id="demo-2" placeholder="Оберіть будинок" position='bottom' aria-selected="false">
</th>
<th style="border:0px; padding:10px; text-align:right; width:15%">
</select> <button onclick="search_building()" style="padding:10px; font-size:1em">Знайти будівлю</button>
 </tr>
 
 <tr style="border:0px; padding:5px">
 <th style="border:0px; padding:10px; text-align:left; font-weight: normal; font-size:1em">
<label for="search_cadnum_input">Введіть кадастровий номер земельної ділянки</label>
<input class="choices__inner" placeholder="" id="search_cadnum_input" position='bottom' style="font-size:1.5em" onsubmit="search_parcel_by_cadnum()">
</th>
<th style="border:0px; padding:10px; text-align:right; width:15%">
 <button onclick="search_parcel_by_cadnum()" style="padding:10px; font-size:1em">Знайти земельну ділянку</button>
 </tr>
 
 
          


      </div>
      </div>`

            popup_window.style.visibility = 'visible';
            popup_window.style.opacity = 1

            set_search_selects()
            cadnum_mask()
        }


        container.appendChild(search_adress_show_hide_button)
        L.DomEvent.disableClickPropagation(container)
        L.DomEvent.disableScrollPropagation(container);
        return container
    }
});


map.addControl(new search_adress_control_container({position: "topleft"}));





const search_location_control_container = L.Control.extend({
    onAdd: map => {
        const container = L.DomUtil.create("div", 'leaflet-control-zoom leaflet-bar');
        const search_location_show_hide_button = document.createElement('a');
        search_location_show_hide_button.setAttribute('id', 'search_location')
        search_location_show_hide_button.setAttribute('class', 'leaflet-buttons-control-button')
        search_location_show_hide_button.setAttribute('role', 'button')
        search_location_show_hide_button.setAttribute('tabindex', '0')
        search_location_show_hide_button.setAttribute('href', '#')
        search_location_show_hide_button.style.setProperty('background-color', "#bdfcff")
        search_location_show_hide_button.innerHTML = '<i class="fa-solid fa-location-dot"></i>'

        search_location_show_hide_button.onclick = function () {

            var popup_window = document.getElementById('popup_window')

            popup_window.innerHTML = `<div class="popup" >
      <a class="close" href="#" onclick='close_popup_window()'>&times;</a>
      </br>
		<div class="content" style="height: 490px;">
		<p></p>
		 <table style="width:100%; border:0px; font-weight: normal>
		                  
  


<tr style="border:0px; padding:5px">
 <th style="border:0px; padding:10px; text-align:left; font-weight: normal; font-size:1em">
<label for="search_location_one_input">Вкажіть координати у форматі Широта, Довгота (наприклад: 49.870000, 33.90000. Число вводити через крапку!)</label>
<input class="choices__inner" id="search_location_one_input" placeholder="Широта, Довгота" position='bottom' style="font-size:1.5em">
</th>
<th style="border:0px; padding:10px; text-align:right; width:15%">
<button onclick="search_location_one_input()" style="padding:10px; font-size:1em">Знайти на карті</button>
 </tr>
 
 <tr style="border:0px; padding:5px">
 <th style="border:0px; padding:10px; text-align:left; font-weight: normal; font-size:1em">
 <label for="latitude_input">Широта (наприклад: 49.87000. Число вводити через крапку!)</label>
<input class="choices__inner" placeholder="Широта" id="latitude_input" position='bottom' style="font-size:1.5em" type="number">

<label for="longitude_input">Довгота (наприклад: 33.90000. Число вводити через крапку!)</label>
<input class="choices__inner" placeholder="Довгота" id="longitude_input" position='bottom' type="number" style="font-size:1.5em">

</th>
<th style="border:0px; padding:10px; text-align:right; width:15%">
 <button onclick="search_location_two_inputs()" style="padding:10px; font-size:1em">Знайти на карті</button>
 </tr>
 
 </table>
          


      </div>
      </div>`

            popup_window.style.visibility = 'visible';
            popup_window.style.opacity = 1
        }


        container.appendChild(search_location_show_hide_button)
        L.DomEvent.disableClickPropagation(container)
        L.DomEvent.disableScrollPropagation(container);
        return container
    }
});


map.addControl(new search_location_control_container({position: "topleft"}));



function cadnum_mask() {
    
var search_input = document.getElementById('search_cadnum_input')
var patternMask = IMask(search_input, {
        mask: '0000000000{:}00{:}000{:}0000', lazy: false
});
search_input.setSelectionRange(0, 0);
}




var legend_select_options = '',
    info_select_options = '',
    legend_container_content = 'ТУТ ПОВИННІ БУТИ УМОВНІ ПОЗНАЧЕННЯ',
    info_container_content = 'ТУТ ПОВИННА МІСТИТИСЯ ІНФОРМАЦІЯ', info_container_showed_html = `
        <div class='info_container' id='information_container'>
        <div class='info_header' style="text-align:right;"><b> &emsp;&emsp;&emsp; ІНФОРМАЦІЯ  &emsp;&emsp;&emsp;     </b> </div>
        <div class='info_select'>
        <select id="info_selector" style="text-align: center;">
        ${info_select_options}
        </select>
        </div>
        <div class='info_content' id='information_container_content'>
        ${info_container_content}
        </div>
        </div>
`,
    legend_container_showed_html = `
        <div class='info_container' id='legend_container'>
        <div class='info_header' style="text-align: right;"><b> &emsp; УМОВНІ ПОЗНАЧЕННЯ  &emsp;    </b> </div>
        <div class='info_select'>
        <select id="legend_selector" style="text-align: center;">
        ${legend_select_options}
        </select>
        </div>
        <div class='info_content' id='legend_container_content'>
        ${legend_container_content}
        </div>
        </div>
`,
    info_container_hidden_icon = `<i class="fa-solid fa-info"></i>`,
    legend_container_hidden_icon = `<i class="fa-solid fa-map"></i>`,
    info_container_button_id = 'show_hide_info_control_container',
    legend_container_button_id = 'show_hide_legend_control_container';

function add_info_container(container_showed_html, icon_html, button_id) {
    const container = L.DomUtil.create("div", 'leaflet-control-zoom leaflet-bar');
    const information_show_hide_button = document.createElement('a');
    information_show_hide_button.setAttribute('id', button_id)
    information_show_hide_button.setAttribute('class', 'leaflet-buttons-control-button')
    information_show_hide_button.setAttribute('role', 'button')
    information_show_hide_button.setAttribute('tabindex', '0')
    information_show_hide_button.setAttribute('href', '#')
    information_show_hide_button.innerHTML = icon_html

    container.appendChild(information_show_hide_button)
    information_show_hide_button.onclick = function () {
        if (container.innerHTML == information_show_hide_button.outerHTML.replace('\\', '')) {
            information_show_hide_button.innerHTML = `<i class="fas fa-angle-down"></i>`;
            information_show_hide_button.setAttribute('style', 'display:inline-block; z-index:200');
            container.innerHTML = container_showed_html;
            container.children[0].children[0].appendChild(information_show_hide_button)
        } else {
            information_show_hide_button.innerHTML = icon_html
            information_show_hide_button.setAttribute('style', 'display:block')
            container.innerHTML = ''
            container.appendChild(information_show_hide_button)
        }
    }
    L.DomEvent.disableClickPropagation(container)
    L.DomEvent.disableScrollPropagation(container);

    return container;
}

const information_control_container = L.Control.extend({
    onAdd: map => {
        return add_info_container(info_container_showed_html, info_container_hidden_icon, info_container_button_id)
    }
});

map.addControl(new information_control_container({position: "bottomleft"}));

const legend_control_container = L.Control.extend({
    onAdd: map => {
        return add_info_container(legend_container_showed_html, legend_container_hidden_icon, legend_container_button_id)
    }
});

map.addControl(new legend_control_container({position: "bottomright"}));


L.control.scale({imperial: false, maxWidth: 200, position: "bottomright"}).addTo(map);


var geoman_info_label = ``;
const Geoman_label = L.Control.extend({
    onAdd: map => {
        const container = L.DomUtil.create("div");
        container.style.background = "white"
        map.addEventListener("mousemove", e => {
            container.innerHTML = geoman_info_label
        });
        return container;
    }
});

map.addControl(new Geoman_label({position: "topleft"}));


map.addEventListener("mousemove", e => {

    lat = e.latlng.lat
    lng = e.latlng.lng


    if (!map.pm.globalDrawModeEnabled() && !map.pm.globalEditModeEnabled() && !map.pm.globalCutModeEnabled() && !map.pm.globalRemovalModeEnabled() && !map.pm.globalRotateModeEnabled()) {
//     console.log('empry_label_while_mousemove')
        geoman_info_label = ``
    }
});


function copy_value(value, icon_id) {
    // console.log(value, icon_id)
    var copy_icon = document.getElementById(icon_id)
    copy_icon.className = 'fa-solid fa-square-check';
    setTimeout(() => {
        copy_icon.className = 'fa fa-clone';
    }, 200);

    if (navigator.clipboard && window.isSecureContext) {
        // navigator clipboard api method'
        return navigator.clipboard.writeText(value);
    } else {
        // text area method
        let textArea = document.createElement("textarea");
        textArea.value = value;
        // make the textarea out of viewport
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        return new Promise((res, rej) => {
            // here the magic happens
            document.execCommand('copy') ? res() : rej();
            textArea.remove();
        });
    }
}

var marker;

// function convert_layer_to_json (layer) {
//             var layer_json = {}
//             for (i in layer) {
//                 layer_json[i] = layer[i]
//             for (x in layer[i]) {
//                 if (x[0]=='_') {layer_json[i][('p_' + x.slice(1,))] = layer[i][x];}
//                 else {layer_json[i][x] = layer[i][x];}                
//                 }
//             }
//             sessionStorage['last_clicked_layer'] = layer_json
// }

function set_last_clicked_layer(layer) {
    var layer_json = {}
//     layer_json['feature'] = layer['feature'];
    layer_json['options'] = {};
    layer_json['options']['id'] = layer['options']['id']
    layer_json['options']['color'] = layer['options']['color']
    if (layer['options']['fillColor']) {
        layer_json['options']['fillColor'] = layer['options']['fillColor']
    }
    if (layer['options']['stripeColor']) {
        layer_json['options']['stripeColor'] = layer['options']['stripeColor']
    }
    layer_json['leaflet_id'] = layer['_leaflet_id'];
    console.log(layer_json)
    sessionStorage['last_clicked_layer'] = JSON.stringify(layer_json)
}

function reset_color_last_clicked_layer() {
    // console.log(sessionStorage['last_clicked_layer'])
    // console.log(sessionStorage['last_clicked_layer'] !== undefined)
    if (sessionStorage['last_clicked_layer'] !== undefined) {
//         Parcels.getLayer(JSON.parse(sessionStorage['last_clicked_layer']).leaflet_id)
        window[JSON.parse(sessionStorage['last_clicked_layer']).options.id].getLayer(JSON.parse(sessionStorage['last_clicked_layer']).leaflet_id).options.color = JSON.parse(sessionStorage['last_clicked_layer']).options.color;
        if (JSON.parse(sessionStorage['last_clicked_layer']).options.stripeColor) {
            window[JSON.parse(sessionStorage['last_clicked_layer']).options.id].getLayer(JSON.parse(sessionStorage['last_clicked_layer']).leaflet_id).options.stripeColor = JSON.parse(sessionStorage['last_clicked_layer']).options.stripeColor;
        }
        console.log(JSON.parse(sessionStorage['last_clicked_layer']).options.fillColor)
        if (JSON.parse(sessionStorage['last_clicked_layer']).options.fillColor) {
            window[JSON.parse(sessionStorage['last_clicked_layer']).options.id].getLayer(JSON.parse(sessionStorage['last_clicked_layer']).leaflet_id).options.fillColor = JSON.parse(sessionStorage['last_clicked_layer']).options.fillColor;
        }
    }
}

function change_color_clicked_layer(layer, color) {
    // console.log(layer)
//     reset_color_last_clicked_layer()

    set_last_clicked_layer(layer)
    layer.options.color = color
    if (layer.options.stripeColor) {
        layer.options.stripeColor = color
    }
    if (layer.options.fillColor) {
        layer.options.fillColor = color
    }
    layer.bringToFront()
    map.fitBounds(map.getBounds())
}

function show_info_container() {
    var show_hide_button = document.getElementById("show_hide_info_control_container")
    var info_container_content_div = document.getElementById("information_container_content")
    if (!info_container_content_div) {
        show_hide_button.click()
        info_container_content_div = document.getElementById("information_container_content")
        info_container_content_div.innerHTML = ``
    } else {
        info_container_content_div.innerHTML = ``
    }
}

function hide_info_container() {
    var show_hide_button = document.getElementById("show_hide_info_control_container")
    var info_container_content_div = document.getElementById("information_container_content")
    if (info_container_content_div) {
        show_hide_button.click()
    }
//     else {info_container_content_div.innerHTML = ``}
}


function set_info_select() {
    function get_layer_from_info_select(layer_list, layer_var) {
        var layer = new Array(0)
        for (x in layer_list) {
            layer.push(layer_var.getLayer(JSON.parse(layer_list[x])))
        }
        display_info(layer)
    }

    var info_selector = document.getElementById("info_selector")
    info_selector.innerHTML = ``
    if (sessionStorage['clicked_layers_list']) {
        var clicked_layers_list = JSON.parse(sessionStorage['clicked_layers_list'])
        for (x in clicked_layers_list) {
            var layers_list_option_tag = document.createElement('option')
            layers_list_option_tag.setAttribute('id', x)
            layers_list_option_tag.textContent = window[x].options.layername
            info_selector.appendChild(layers_list_option_tag)
        }
    }

    info_selector.onchange = function () {
        var info_selector_options = info_selector.options
        get_layer_from_info_select(clicked_layers_list[info_selector_options[info_selector_options.selectedIndex].id], window[info_selector_options[info_selector_options.selectedIndex].id])
    }
    info_selector.dispatchEvent(new Event('change'))
}

function string_includes(full_string, key_string) {
    if (full_string.includes(key_string)) {
        return full_string
    }
}

function set_legend_select() {

    var legend_selector = document.getElementById("legend_selector")
    var legend_container_content = document.getElementById("legend_container_content")

    var all_layer_list = get_active_overlay_layers_list()

        legend_container_content.innerHTML = ``
      
                var ownership_form_list = ["Комунальна власність", "Приватна власність", "Державна власність", "Не визначено"]
                legend_container_content.innerHTML = `<h3>Земельні ділянки<h3> <p style="font-size:14px; margin:0px; margin-bottom:5px">За формою власності:</p>`

                var ownership_colors_table = ``


                for (var i = 0; i < ownership_form_list.length; i++) {
                    ownership_colors_table += `<tr>
                <th><canvas id="Parcels_legend_sign_${i}" width="200" height="200" style="width:40px; height:40px; "></canvas></th>
                <th style="text-align: left; text-decoration: none">${ownership_form_list[i]}</th>
                </tr>`

                }

                legend_container_content.innerHTML += `<table>${ownership_colors_table}</table></hr>`
				
						
				
				var building_dict = [{"condition": 1, "build_num":1, "label": "Основна будівля"}, {"condition": 1, "build_num":0, "label": "Будівля/споруда"}, {"condition": 2, "build_num":0, "label": "Руїна/будується"}]
				
				legend_container_content.innerHTML += `<h3>Будівлі та споруди<h3> <p style="font-size:14px; margin:0px; margin-bottom:5px">За станом та номером:</p>`

                var buildings_colors_table = ``
				
				for (var i = 0; i < building_dict.length; i++) {
                    buildings_colors_table += `<tr>
                <th><canvas id="Buildings_legend_sign_${i}" width="200" height="200" style="width:40px; height:40px; "></canvas></th>
                <th style="text-align: left; text-decoration: none">${building_dict[i]['label']}</th>
                </tr>`

                }
				
				legend_container_content.innerHTML += `<table>${buildings_colors_table}</table></br>`
				
				
				legend_container_content.innerHTML += `<h3>Межі<h3>`
				legend_container_content.innerHTML += `<table><tr>
                <th><canvas id="IKK_legend_sign" width="200" height="200" style="width:40px; height:40px;"></canvas></th>
                <th style="text-align: left; text-decoration: none;">Межа кадастрового квартала</th>
                </tr></table>`
                
				
				
				legend_container_content.innerHTML += `<table><tr>
                <th><canvas id="BOUNDARY_legend_sign" width="200" height="200" style="width:40px; height:40px;"></canvas></th>
                <th style="text-align: left; text-decoration: none;">Межа населеного пункту</th>
                </tr></table>`
				
				for (var i = 0; i < building_dict.length; i++) {
                    set_canvas_element_fill_color('Buildings_legend_sign_' + i, get_fillColor_Buildings(building_dict[i]['build_num'], building_dict[i]['condition']), 0.7, get_borderColor_Buildings(building_dict[i]['build_num'], building_dict[i]['condition']))
                }
				
				for (var i = 0; i < ownership_form_list.length; i++) {
                    set_canvas_element_fill_color('Parcels_legend_sign_' + i, getColor_Parcels(ownership_form_list[i]), 0.35, getColor_Parcels(ownership_form_list[i]))
				}
              		
				
				set_canvas_element_one_line('IKK_legend_sign', IKK.options.style.color)
                set_canvas_element_one_line('BOUNDARY_legend_sign', "#bd0d00")
				
				
  
				
            


        
    

}

var show_hide_legend_control_container_button = document.getElementById("show_hide_legend_control_container")
show_hide_legend_control_container_button.addEventListener("click", function () {
    if (document.getElementById("legend_selector")) {
        set_legend_select()
    }
})


function display_info(layer) {
    var info_container_content_div = document.getElementById("information_container_content")
    info_container_content_div.innerHTML = ``

    function display_attributes(selected_layer, info_container_div) {
        var layer_id = null
        var streets_list = {}
        if (selected_layer.options.id.includes("streets_layer")) {
          layer_id = "streets_layer"
        }
        else if (selected_layer.options.id.includes("buildings_layer")) {
           var layer_id = "buildings_layer"
           var settlement_name = selected_layer.options.id.split("buildings_layer_")[1]
           // console.log()
           var streets_layer = window[settlement_list[settlement_name]['streets_layer']]
            for (x in streets_layer._layers) {
        var props = streets_layer._layers[x].feature['properties'];
        var street_id =  props['str_id']
         streets_list[street_id] = JSON.stringify(streets_layer._layers[x].toGeoJSON())
    

   }
        }
        else {
            layer_id = selected_layer.options.id
        }
        
        switch (layer_id) {
            case 'Parcels':
                info_container_div.innerHTML = `
                <table >
            <tr>
            <th style="font-weight:normal; text-align:left"><b>Кадастровий номер:</b> ${selected_layer.feature.properties.cadnum}</th>
            <th><i class="fa fa-clone" id="copy_cadnum" aria-hidden="true" style="cursor: pointer; font-size:18px" onclick="copy_value('${selected_layer.feature.properties.cadnum}', this.id)"></i></th>
            </tr>
            
            <tr>
            <th style="font-weight:normal; text-align:left"><b>Тип власності:</b> ${selected_layer.feature.properties.ownership}</th>
            <th><i class="fa fa-clone" id="copy_ownership" aria-hidden="true" style="cursor: pointer; font-size:18px" onclick="copy_value('${selected_layer.feature.properties.ownership}', this.id)"></i></th>
            </tr>
            
            <tr>
            <th style="font-weight:normal; text-align:left"><b>Категорія:</b> ${selected_layer.feature.properties.category}</th>
            <th><i class="fa fa-clone" id="copy_category" aria-hidden="true" style="cursor: pointer; font-size:18px" onclick="copy_value('${selected_layer.feature.properties.category}', this.id)"></i></th>
            </tr>            
            
            <tr>
            <th style="font-weight:normal; text-align:left"><b>Цільове призначення:</b> ${selected_layer.feature.properties.purpose}</th>
            <th><i class="fa fa-clone" id="copy_purpose" aria-hidden="true" style="cursor: pointer; font-size:18px" onclick="copy_value('${selected_layer.feature.properties.purpose}', this.id)"></i></th>
            </tr>          
            
            <tr>
            <th style="font-weight:normal; text-align:left"><b>Площа:</b> ${selected_layer.feature.properties.area + ' ' + selected_layer.feature.properties.unit_area}</th>
            <th><i class="fa fa-clone" id="copy_area" aria-hidden="true" style="cursor: pointer; font-size:18px" onclick="copy_value('${selected_layer.feature.properties.area}', this.id)"></i></th>
            </tr>
            <tr>
            <th style="font-weight:normal; text-align:left"><b>Адреса:</b> ${selected_layer.feature.properties.address}</th>
            <th><i class="fa fa-clone" id="copy_address" aria-hidden="true" style="cursor: pointer; font-size:18px" onclick="copy_value('${selected_layer.feature.properties.address}', this.id)"></i></th>
            </tr>
           
            </table>
            <hr>
            <p><a href=https://e.land.gov.ua/back/cadaster/?cad_num=${selected_layer.feature.properties.cadnum} target="_blank" style="
	background-color: #fff;
	border-bottom: 1px solid #ccc;
	width: 100%;
	line-height: 1;
	display: block;
	text-align: justify;
	text-decoration: underline;
	color: blue;">Інформація про право власності та речові права (Е-сервіси ДЗК)</a></p>
                `
                break;
          
            case 'IKK':
                info_container_div.innerHTML = `
                <table >
            <tr>
            <th style="font-weight:normal; text-align:left"><b>КОАТУУ:</b> ${selected_layer.feature.properties.koatuu}</th>
            <th><i class="fa fa-clone" id="copy_koatuu" aria-hidden="true" style="cursor: pointer; font-size:18px" onclick="copy_value('${selected_layer.feature.properties.koatuu}', this.id)"></i></th>
            </tr>
            
            <tr>
            <th style="font-weight:normal; text-align:left"><b>Кадастрова зона:</b> ${selected_layer.feature.properties.zona}</th>
            <th><i class="fa fa-clone" id="copy_zona" aria-hidden="true" style="cursor: pointer; font-size:18px" onclick="copy_value('${selected_layer.feature.properties.zona}', this.id)"></i></th>
            </tr>
            
            <tr>
            <th style="font-weight:normal; text-align:left"><b>Кадастровий квартал:</b> ${selected_layer.feature.properties.kvart}</th>
            <th><i class="fa fa-clone" id="copy_kvart" aria-hidden="true" style="cursor: pointer; font-size:18px" onclick="copy_value('${selected_layer.feature.properties.kvart}', this.id)"></i></th>
            </tr>            
          
            </table>
                `
                break;
         
            case 'streets_layer':
                info_container_div.innerHTML = `
                <table >
                
            <tr>
            <th style="font-weight:normal; text-align:left"><b>Повна назва: </b> ${selected_layer.feature.properties.name_old != null ? str_type[selected_layer.feature.properties.str_type] + ' ' + selected_layer.feature.properties.str_name + ' (' + selected_layer.feature.properties.name_old + ')' : str_type[selected_layer.feature.properties.str_type] + ' ' + selected_layer.feature.properties.str_name}</th>
            </tr>
            
            <tr>
            <th style="font-weight:normal; text-align:left"><b>Назва вулиці (поточна): </b> ${selected_layer.feature.properties.str_name}</th>
            <th><i class="fa fa-clone" id="copy_str_name" aria-hidden="true" style="cursor: pointer; font-size:18px" onclick="copy_value('${selected_layer.feature.properties.str_name}', this.id)"></i></th>
            </tr>
            
            <tr>
            <th style="font-weight:normal; text-align:left"><b>Назва вулиці (латиницею): </b> ${selected_layer.feature.properties.name_eng}</th>
            <th><i class="fa fa-clone" id="copy_area" aria-hidden="true" style="cursor: pointer; font-size:18px" onclick="copy_value('${selected_layer.feature.properties.name_eng}', this.id)"></i></th>
            </tr>
            
            <tr>
            <th style="font-weight:normal; text-align:left"><b>Назва вулиці (архівна): </b> ${selected_layer.feature.properties.name_old}</th>
            <th><i class="fa fa-clone" id="copy_name_old" aria-hidden="true" style="cursor: pointer; font-size:18px" onclick="copy_value('${selected_layer.feature.properties.name_old}', this.id)"></i></th>
            </tr>
            
            <tr>
            <th style="font-weight:normal; text-align:left"><b>Уточнююча частина назви вулиці: </b> ${selected_layer.feature.properties.additional}</th>
            <th><i class="fa fa-clone" id="copy_additional" aria-hidden="true" style="cursor: pointer; font-size:18px" onclick="copy_value('${selected_layer.feature.properties.additional}', this.id)"></i></th>
            </tr>
            
            <tr>
            <th style="font-weight:normal; text-align:left"><b>Тип дорожньо-вуличної мережі: </b> ${str_type[selected_layer.feature.properties.str_type]}</th>
            <th><i class="fa fa-clone" id="copy_str_type" aria-hidden="true" style="cursor: pointer; font-size:18px" onclick="copy_value('${selected_layer.feature.properties.str_type}', this.id)"></i></th>
            </tr>
            
             <tr>
            <th style="font-weight:normal; text-align:left"><b>КАТОТТГ: </b> ${selected_layer.feature.properties.codifier}</th>
            <th><i class="fa fa-clone" id="copy_codifier" aria-hidden="true" style="cursor: pointer; font-size:18px" onclick="copy_value('${selected_layer.feature.properties.codifier}', this.id)"></i></th>
            </tr>
            
            <tr>
            <th style="font-weight:normal; text-align:left"><b>ID запису про вулицю: </b> ${selected_layer.feature.properties.str_id}</th>
            <th><i class="fa fa-clone" id="copy_str_id" aria-hidden="true" style="cursor: pointer; font-size:18px" onclick="copy_value('${selected_layer.feature.properties.str_id}', this.id)"></i></th>
            </tr>
            
            <tr>
            <th style="font-weight:normal; text-align:left"><b>Примітка: </b> ${selected_layer.feature.properties.note}</th>
            <th><i class="fa fa-clone" id="copy_note" aria-hidden="true" style="cursor: pointer; font-size:18px" onclick="copy_value('${selected_layer.feature.properties.note}', this.id)"></i></th>
            </tr>

            </table>
            
                `
                break;

            case 'buildings_layer':
                info_container_div.innerHTML = `
                <table >

            <tr>
            <th style="font-weight:normal; text-align:left"><b>Повна адреса: </b> ${selected_layer.feature.properties.index != null ? selected_layer.feature.properties.index + ',' : ''} ${JSON.parse(streets_list[selected_layer.feature.properties.str_id])['properties']['name_old'] != null ? str_type[JSON.parse(streets_list[selected_layer.feature.properties.str_id])['properties']['str_type']] + ' ' + JSON.parse(streets_list[selected_layer.feature.properties.str_id])['properties']['str_name'] + ' (' + JSON.parse(streets_list[selected_layer.feature.properties.str_id])['properties']['name_old'] + ')' : str_type[JSON.parse(streets_list[selected_layer.feature.properties.str_id])['properties']['str_type']] + ' ' + JSON.parse(streets_list[selected_layer.feature.properties.str_id])['properties']['str_name']}, ${selected_layer.feature.properties.build_num}, ${selected_layer.feature.properties.corp_num != null ? selected_layer.feature.properties.corp_num : ''}</th>
            </tr>
     
            
            <tr>
            <th style="font-weight:normal; text-align:left"><b>Номер будівлі: </b> ${selected_layer.feature.properties.build_num}</th>
            <th><i class="fa fa-clone" id="copy_build_num" aria-hidden="true" style="cursor: pointer; font-size:18px" onclick="copy_value('${selected_layer.feature.properties.build_num}', this.id)"></i></th>
            </tr>
            
            
            <tr>
            <th style="font-weight:normal; text-align:left"><b>Номер корпусу: </b> ${selected_layer.feature.properties.corp_num}</th>
            <th><i class="fa fa-clone" id="copy_corp_num" aria-hidden="true" style="cursor: pointer; font-size:18px" onclick="copy_value('${selected_layer.feature.properties.corp_num}', this.id)"></i></th>
            </tr>
            
            <tr>
            <th style="font-weight:normal; text-align:left"><b>Поштовий індекс: </b> ${selected_layer.feature.properties.index}</th>
            <th><i class="fa fa-clone" id="copy_index" aria-hidden="true" style="cursor: pointer; font-size:18px" onclick="copy_value('${selected_layer.feature.properties.index}', this.id)"></i></th>
            </tr>
            
            <tr>
            <th style="font-weight:normal; text-align:left"><b>Кількість поверхів: </b> ${selected_layer.feature.properties.floor}</th>
            <th><i class="fa fa-clone" id="copy_floor" aria-hidden="true" style="cursor: pointer; font-size:18px" onclick="copy_value('${selected_layer.feature.properties.floor}', this.id)"></i></th>
            </tr>
            
            <tr>
            <th style="font-weight:normal; text-align:left"><b>Кількість під’їздів: </b> ${selected_layer.feature.properties.entrance}</th>
            <th><i class="fa fa-clone" id="copy_entrance" aria-hidden="true" style="cursor: pointer; font-size:18px" onclick="copy_value('${selected_layer.feature.properties.entrance}', this.id)"></i></th>
            </tr>
            
            <tr>
            <th style="font-weight:normal; text-align:left"><b>Кількість квартир: </b> ${selected_layer.feature.properties.flat}</th>
            <th><i class="fa fa-clone" id="copy_flat" aria-hidden="true" style="cursor: pointer; font-size:18px" onclick="copy_value('${selected_layer.feature.properties.flat}', this.id)"></i></th>
            </tr>
            
            <tr>
            <th style="font-weight:normal; text-align:left"><b>Матеріал споруди: </b> ${selected_layer.feature.properties.build_type}</th>
            <th><i class="fa fa-clone" id="copy_build_type" aria-hidden="true" style="cursor: pointer; font-size:18px" onclick="copy_value('${selected_layer.feature.properties.build_type}', this.id)"></i></th>
            </tr>
            
            
            
             <tr>
            <th style="font-weight:normal; text-align:left"><b>Тип об'єкту адресації: </b> ${selected_layer.feature.properties.obj_type == 1 ? 'Будівля'
                    : selected_layer.feature.properties.obj_type == 2 ? 'Земельна ділянка'
                        : selected_layer.feature.properties.obj_type == 3 ? 'Cадиба'
                            : 'НЕ ВИЗНАЧЕНО'}</th>
            <th><i class="fa fa-clone" id="copy_obj_type" aria-hidden="true" style="cursor: pointer; font-size:18px" onclick="copy_value('${selected_layer.feature.properties.obj_type}', this.id)"></i></th>
            </tr>
            
            <tr>
            <th style="font-weight:normal; text-align:left"><b>Підтип об’єкту адресації: </b> ${selected_layer.feature.properties.sub_type == 1 ? 'жилий'
                    : selected_layer.feature.properties.sub_type == 2 ? 'нежилий'
                        : 'НЕ ВИЗНАЧЕНО'}</th>
            <th><i class="fa fa-clone" id="copy_sub_type" aria-hidden="true" style="cursor: pointer; font-size:18px" onclick="copy_value('${selected_layer.feature.properties.sub_type}', this.id)"></i></th>
            </tr>
            
             <tr>
            <th style="font-weight:normal; text-align:left"><b>Категорія об’єкту: </b> ${build_category[selected_layer.feature.properties.category]}</th>
            <th><i class="fa fa-clone" id="copy_category" aria-hidden="true" style="cursor: pointer; font-size:18px" onclick="copy_value('${selected_layer.feature.properties.category}', this.id)"></i></th>
            </tr>
            
            <tr>
            <th style="font-weight:normal; text-align:left"><b>Стан: </b> ${selected_layer.feature.properties.condition == 1 ? 'не зруйнована'
                    : selected_layer.feature.properties.condition == 2 ? 'напівзруйнована'
                        : selected_layer.feature.properties.condition == 3 ? 'зруйнована'
                            : 'НЕ ВИЗНАЧЕНО'}</th>
            <th><i class="fa fa-clone" id="copy_condition" aria-hidden="true" style="cursor: pointer; font-size:18px" onclick="copy_value('${selected_layer.feature.properties.condition}', this.id)"></i></th>
            </tr>
            
             <tr>
            <th style="font-weight:normal; text-align:left"><b>Площа будівлі: </b> ${selected_layer.feature.properties.area}</th>
            <th><i class="fa fa-clone" id="copy_area" aria-hidden="true" style="cursor: pointer; font-size:18px" onclick="copy_value('${selected_layer.feature.properties.area}', this.id)"></i></th>
            </tr>
            
            <tr>
            <th style="font-weight:normal; text-align:left"><b>ID запису про будівлю: </b> ${selected_layer.feature.properties.build_code}</th>
            <th><i class="fa fa-clone" id="copy_build_code" aria-hidden="true" style="cursor: pointer; font-size:18px" onclick="copy_value('${selected_layer.feature.properties.build_code}', this.id)"></i></th>
            </tr>
            
            <tr>
            <th style="font-weight:normal; text-align:left"><b>Примітка: </b> ${selected_layer.feature.properties.note}</th>
            <th><i class="fa fa-clone" id="copy_note" aria-hidden="true" style="cursor: pointer; font-size:18px" onclick="copy_value('${selected_layer.feature.properties.note}', this.id)"></i></th>
            </tr>

            </table>
            
                `
                break;
//             case string_includes(selected_layer.options.id, 'user_layer'):
//                 if ()

            default:
                if (selected_layer.feature.properties) {

                    var table_rows = ''
                    for (x in selected_layer.feature.properties) {
                        // console.log(x)
                        // console.log(selected_layer.feature.properties)
                        // console.log(selected_layer.feature.properties[x])
                        table_rows += `<tr>
                        <th style="font-weight:normal; text-align:left"><b>${x}:</b> ${selected_layer.feature.properties[x]}</th>
                        <th><i class="fa fa-clone" id="copy_user_property_${x}" aria-hidden="true" style="cursor: pointer; font-size:18px" onclick="copy_value('${selected_layer.feature.properties[x]}',this.id)"></i></th>
                        </tr>`
                    }
                    if (selected_layer.options.pmIgnore !== undefined) {
                        info_container_div.innerHTML = `<table>${table_rows}</table>`
                    } else {
                        info_container_div.innerHTML = `<table>${table_rows}</table><p>ШАР ДЛЯ РЕДАГУВАННЯ</p><button onclick="show_popup_change_properties_value('${selected_layer.options.id}', ${selected_layer._leaflet_id})">РЕДАГУВАТИ АТРИБУТИ</button>   
                        <button onclick="delete_object_from_layer('${selected_layer.options.id}', ${selected_layer._leaflet_id})">ВИДАЛИТИ ОБ'ЄКТ</button>`

                    }
                }
        }
        reset_color_last_clicked_layer()
        change_color_clicked_layer(selected_layer, '#03f8fc')
        // console.log(selected_layer)
    }

    if (layer.length > 1) {
        var created_layer_select_tag = document.createElement('select')
        var created_layer_info_div_tag = document.createElement('div')
        var text_p_tag = document.createElement('b')
        var text_p1_tag = document.createElement('b')
        created_layer_select_tag.setAttribute('id', "layer_select_tag")
        created_layer_info_div_tag.setAttribute('id', "layer_info_div_tag")
        text_p_tag.textContent = "Об`єкт "
        info_container_content_div.appendChild(text_p_tag)
        info_container_content_div.appendChild(created_layer_select_tag)
        text_p1_tag.textContent = " із " + layer.length
        info_container_content_div.appendChild(text_p1_tag)

//             info_container_content_div.innerHTML += 
        info_container_content_div.appendChild(created_layer_info_div_tag)
        for (x in layer) {
            var layer_option_tag = document.createElement('option')
            layer_option_tag.setAttribute('id', x)
            layer_option_tag.textContent = parseInt(x) + 1
            created_layer_select_tag.appendChild(layer_option_tag)
        }
        if (document.getElementById("layer_select_tag")) {
            layer_select_tag = document.getElementById("layer_select_tag")

            layer_select_tag.onchange = function () {
                display_attributes(layer[parseInt(layer_select_tag.value) - 1], layer_info_div_tag)
            }
            layer_select_tag.dispatchEvent(new Event('change'))
        }
    } else if (layer.length === 1) {
        display_attributes(layer[0], info_container_content_div)
    }
}

function zoom_on_layer(layer) {
    layer_group = L.featureGroup(layer)
    map.fitBounds(layer_group.getBounds())
}

function get_geojsonlayer_from_point(layer_id, current_point_latlng) {
console.log(layer_id)
    var layer_list = new Array(0)
    geojson_layer = window[layer_id]
    for (y in geojson_layer._layers) {
//         console.log(y)
        if (geojson_layer._layers[y].feature['geometry']['type'] == 'Polygon') {
            var layer_polygon = turf.polygon(geojson_layer._layers[y].feature['geometry']['coordinates'])
            if (turf.booleanPointInPolygon(current_point_latlng, layer_polygon)) {
                layer_list.push(geojson_layer._layers[y]._leaflet_id)
            }
        } else if (geojson_layer._layers[y].feature['geometry']['type'] == 'MultiPolygon') {
            var layer_polygon = turf.multiPolygon(geojson_layer._layers[y].feature['geometry']['coordinates'])
            if (turf.booleanPointInPolygon(current_point_latlng, layer_polygon)) {
                layer_list.push(geojson_layer._layers[y]._leaflet_id)
            }
        } else if (geojson_layer._layers[y].feature['geometry']['type'] == 'LineString') {
            var layer_line = turf.lineString(geojson_layer._layers[y].feature['geometry']['coordinates'])
            var distance = turf.pointToLineDistance(current_point_latlng, layer_line, {units: 'kilometers'});
//             console.log('intersect_LINE')
            if (distance <= 0.005) {
//                 console.log('intersect_LINE')
                layer_list.push(geojson_layer._layers[y]._leaflet_id)
            }
        } else if (geojson_layer._layers[y].feature['geometry']['type'] == 'MultiLineString') {
//             console.log(geojson_layer._layers[y].feature['geometry']['coordinates'].length)
            if (geojson_layer._layers[y].feature['geometry']['coordinates'].length == 1) {
                var layer_line = turf.lineString(geojson_layer._layers[y].feature['geometry']['coordinates'][0])
                var distance = turf.pointToLineDistance(current_point_latlng, layer_line, {units: 'kilometers'});
//             console.log('intersect_LINE')
                if (distance <= 0.005) {
                    //                 console.log('intersect_LINE')
                    layer_list.push(geojson_layer._layers[y]._leaflet_id)
                }
            } else if (geojson_layer._layers[y].feature['geometry']['coordinates'].length >= 1) {
                for (x in geojson_layer._layers[y].feature['geometry']['coordinates']) {
                    var layer_line = turf.lineString(geojson_layer._layers[y].feature['geometry']['coordinates'][x])
                    var distance = turf.pointToLineDistance(current_point_latlng, layer_line, {units: 'kilometers'});
                    //             console.log('intersect_LINE')
                    if (distance <= 0.010) {
                        //                 console.log('intersect_LINE')
                        layer_list.push(geojson_layer._layers[y]._leaflet_id)
                    }
                }
            }
        } else if (geojson_layer._layers[y].feature['geometry']['type'] == 'Point') {
            var layer_point = turf.point(geojson_layer._layers[y].feature['geometry']['coordinates'])

            var distance = turf.distance(current_point_latlng, layer_point)

            if (distance <= 0.010) {
//                 console.log('ok', distance)
                layer_list.push(geojson_layer._layers[y]._leaflet_id)
            }
        } else if (geojson_layer._layers[y].feature['geometry']['type'] == 'MultiPoint') {
//             console.log(geojson_layer._layers[y].feature['geometry']['coordinates'].length)
            if (geojson_layer._layers[y].feature['geometry']['coordinates'].length == 1) {
                var layer_point = turf.point(geojson_layer._layers[y].feature['geometry']['coordinates'][0])
                var distance = turf.distance(current_point_latlng, layer_point);
//             console.log('intersect_LINE')
                if (distance <= 0.010) {
                    //                 console.log('intersect_LINE')
                    layer_list.push(geojson_layer._layers[y]._leaflet_id)
                }
            } else if (geojson_layer._layers[y].feature['geometry']['coordinates'].length >= 1) {
                for (x in geojson_layer._layers[y].feature['geometry']['coordinates']) {
                    var layer_point = turf.point(geojson_layer._layers[y].feature['geometry']['coordinates'][x])
                    var distance = turf.distance(current_point_latlng, layer_point);
                    //             console.log('intersect_LINE')
                    if (distance <= 0.010) {
                        //                 console.log('intersect_LINE')
                        layer_list.push(geojson_layer._layers[y]._leaflet_id)
                    }
                }
            }
        }


    }
    if (layer_list.length !== 0) {
        return layer_list
    } else {
        return undefined
    }
}


function get_active_overlay_layers_list() {

    var active_overlay_layers_list = new Array(0)
    // console.log(control_layers)
    for (x in control_layers._layers) {
        if (
            (control_layers._layerControlInputs[x].type === "checkbox" && control_layers._layerControlInputs[x].checked === true && !control_layers._layers[x].layer._url && control_layers._layers[x].layer.options.canGetInfo === true)
        )// остання умова для виключення тайловий шарів

        {
            if (control_layers._layers[x].layer.options.id.includes("user_layer")) {
                active_overlay_layers_list.unshift(control_layers._layers[x].layer.options.id)
            } else {
                active_overlay_layers_list.push(control_layers._layers[x].layer.options.id)
            }
        }


//         else if   (control_layers._layerControlInputs[x].type === "checkbox" && control_layers._layerControlInputs[x].checked === true && control_layers._layers[x].layer.dataLayerNames) 
//Для pbf шарів, вони містять властивість _url, але при тому мають атрибутику
//         {
//             active_overlay_layers_list.push(control_layers._layers[x].layer.options.id)
//         }
    }
    return active_overlay_layers_list

}

function get_all_user_layer_list() {

    var active_user_layers_list = new Array(0)

    for (x in control_layers._layers) {
        if (
            (control_layers._layerControlInputs[x].type === "checkbox" && !control_layers._layers[x].layer._url && control_layers._layers[x].layer.options.id.includes("user_layer", 0))
        )// остання умова для виключення тайловий шарів
        {
            active_user_layers_list.push(control_layers._layers[x].layer.options.id)
        }

    }
    return active_user_layers_list

}

map.addEventListener('click', (event) => {
    var current_point_latlng = turf.point([lng, lat])
    if (!map.pm.globalDrawModeEnabled() && !map.pm.globalEditModeEnabled() && !map.pm.globalCutModeEnabled() && !map.pm.globalRemovalModeEnabled() && !map.pm.globalRotateModeEnabled() && !map.pm.globalDragModeEnabled()) {


        sessionStorage['clicked_layers_list'] = ''

        var active_layers_list = get_active_overlay_layers_list()
//      console.log(active_layers_list)
        var clicked_layers_list = {}
        for (x in active_layers_list) {
            if (active_layers_list[x] == 'LayerDrawnByGeoman') {
            } else {
                clicked_layers_list[active_layers_list[x]] = get_geojsonlayer_from_point(active_layers_list[x], current_point_latlng);
            }

        }

        // console.log(clicked_layers_list)
        sessionStorage['clicked_layers_list'] = JSON.stringify(clicked_layers_list)
        if (active_layers_list) {
            show_info_container()
            set_info_select()
            map.fitBounds(map.getBounds())
        }
        if (marker) {
            map.removeLayer(marker);
        }
        var goldIcon = new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
        marker = new L.Marker([lat, lng], {icon: goldIcon, renderer: L.canvas({pane: 'Geoman'})}).addTo(map);
        var popup_content = `<table>
            <tr>
            <th style="font-weight:normal; text-align:left"><b>Широта: </b> ${lat}</th>
            <th><i class="fa fa-clone" id="copy_lat" aria-hidden="true" style="cursor: pointer; font-size:18px" onclick="copy_value('${lat.toFixed(6)}','copy_lat')"></i></th>
            </tr>.
            <tr>
            <th style="font-weight:normal; text-align:left"><b>Довгота: </b> ${lng}</th>
            <th><i class="fa fa-clone" id="copy_lng" aria-hidden="true" style="cursor: pointer; font-size:18px" onclick="copy_value('${lng.toFixed(6)}','copy_lng')"></i></th>
            </tr>
            </table>
            <p id="copy_lat_lng" style="cursor: pointer;" onclick="copy_value('${lat.toFixed(6) + ', ' + lng.toFixed(6)}','copy_lat_lng')"><b>Копіювати координати</b></p>
            `
        marker.bindPopup(popup_content);

        map.addLayer(marker);

    }
//     else if (getComputedStyle(select_layers_button.parentNode.nextSibling).display === 'block') {
//           if (sessionStorage['selected_layers']) {
// 
//                     var layer_id = JSON.parse(sessionStorage['selected_layers']).layer_id
//                     var selected_layers_id = get_geojsonlayer_from_point(layer_id, current_point_latlng);
//                     
//                     var select_color = '#bfffdf'
//                     var selected_layers_dict = JSON.parse(sessionStorage['selected_layers'])
//                     if (selected_layers_dict.layers_list === undefined) {
//                     selected_layers_dict.layers_list = new Array(0)
//                     }
//                     
//                     
//                     if (selected_layers_id !== undefined) {
//                         var select_layer = window[layer_id].getLayer(selected_layers_id[0])
//                         
//     //                     sessionStorage['last_clicked_layer'] = JSON.stringify(layer_json)
//     //                     console.log(select_layer.options.color)
//                         if (select_layer.options.color !== select_color) {
//                             var layer_json = {};
//                             layer_json['options'] = {};
//                             layer_json['options']['id'] = select_layer['options']['id']
//                             layer_json['options']['color'] = select_layer['options']['color']
//                             if (select_layer['options']['stripeColor']) {
//                                 layer_json['options']['stripeColor'] = select_layer['options']['stripeColor']
//                             }
//                             layer_json['leaflet_id'] = select_layer['_leaflet_id'];        
//                             selected_layers_dict.layers_list.push(layer_json)
//                             
//                             change_color_clicked_layer(select_layer, select_color)
//                         }
//                         else if (select_layer.options.color === select_color) {
//                         for (x in selected_layers_dict.layers_list) {
//                             if (selected_layers_dict.layers_list[x].leaflet_id === selected_layers_id[0]) {
//                                 
//                                 change_color_clicked_layer(select_layer, selected_layers_dict.layers_list[x].options.color)
//                                 selected_layers_dict.layers_list = selected_layers_dict.layers_list.filter(item => item.leaflet_id !== selected_layers_id[0]);
//                                 
//                                 break
// 
//                             }
//                         }
//                             
//                             
// //                             delete layer_list[selected_layers_id[0]]
//                         }
//                          console.log(selected_layers_dict.layers_list)
//                          
//                          selected_layers_dict.label = 'Обраний шар: ' + window[layer_id].options.layername + ' | Обрано об\'єктів: ' + selected_layers_dict.layers_list.length
//                         
//                         sessionStorage['selected_layers'] = JSON.stringify(selected_layers_dict)
// //                         console.log(JSON.parse(sessionStorage['selected_layers']).layers_list)
//                         
//                         
//                         
//                     }
//                     
// 
//             }
//             
//     }


})

function generate_streets_choices(streets_layer) {

var streets_choices = []

var streets_list = {};
   
   for (x in streets_layer._layers) {
        var props = streets_layer._layers[x].feature['properties'];
        var street_id =  props['str_id']
         streets_list[street_id] = JSON.stringify(streets_layer._layers[x].toGeoJSON())
    

   }

for (x in streets_list) {
    var street_row = {}
    if (JSON.parse(streets_list[x])['properties']['name_old'] != null) {
        street_row = {
            label: str_type[JSON.parse(streets_list[x])['properties']['str_type']] + ' ' + JSON.parse(streets_list[x])['properties']['str_name'] + ' (' + JSON.parse(streets_list[x])['properties']['name_old'] + ')',
            value: JSON.parse(streets_list[x])['properties']['str_id']
        }

    } else {
        street_row = {
            label: str_type[JSON.parse(streets_list[x])['properties']['str_type']] + ' ' + JSON.parse(streets_list[x])['properties']['str_name'],
            value: JSON.parse(streets_list[x])['properties']['str_id']
        }

    }
    streets_choices.push(street_row)
}
return streets_choices

}

function get_choices_buildings_on_street(str_id, buildings_layer) {
    

    var choices_buildings_on_street = []
    for (x in buildings_layer._layers) {

        let build_num = buildings_layer._layers[x].feature['properties']['build_num']
        if (buildings_layer._layers[x].feature['properties']['str_id'] == str_id && build_num != "0" && build_num != null && build_num != '0') {
            choices_buildings_on_street.push({
                label: buildings_layer._layers[x].feature['properties']['build_num'],
                value: buildings_layer._layers[x].feature['properties']['build_code']
            })
        }

    }
    return choices_buildings_on_street
}

function generate_settlement_choices(settlement_list_var) {
var settlement_choices = []
for (x in settlement_list_var) {
settlement_row = {label: settlement_list_var[x]['ua_name'], value: x}

settlement_choices.push(settlement_row)
}
return settlement_choices
}

function set_search_selects() {
    
    var settlement_search_select = new Choices('#demo-3', {
        allowSearch: true,
        position: 'bottom',
        noChoicesText: 'Значення для вибору відсутні'
    })
    settlement_search_select.setChoices(generate_settlement_choices(settlement_list))
    
    
    
    var streets_search_select = new Choices('#demo-1', {
        allowSearch: true,
        position: 'bottom',
        noChoicesText: 'Значення для вибору відсутні'
    })
    
    

    var buildings_search_select = new Choices('#demo-2', {
        allowHTML: true,
        position: 'bottom',
        noChoicesText: 'Значення для вибору відсутні'
    });
    
    settlement_search_select.passedElement.element.addEventListener('change', function (e) {

        streets_search_select.clearChoices();
        streets_search_select.clearStore();
        buildings_search_select.clearChoices();
        buildings_search_select.clearStore();
        streets_search_select.setChoices(generate_streets_choices(window[settlement_list[e.detail.value]['streets_layer']]))
    });
    
    streets_search_select.passedElement.element.addEventListener('change', function (e) {
        var select_element_settlement = document.getElementById('demo-3')
        buildings_search_select.clearChoices();
        buildings_search_select.clearStore();
        buildings_search_select.setChoices(get_choices_buildings_on_street(e.detail.value, window[settlement_list[select_element_settlement.value]['buildings_layer']]))
    });


}

function search_street() {
    var select_element = document.getElementById('demo-1')
    var select_element_settlement = document.getElementById('demo-3')
    streets_layer = window[settlement_list[select_element_settlement.value]['streets_layer']]
    for (x in streets_layer._layers) {
        var props = streets_layer._layers[x].feature['properties'];

        if (props['str_id'] == select_element.value) {
            lat = streets_layer._layers[x]._latlngs[0][1]['lat']
            lng = streets_layer._layers[x]._latlngs[0][1]['lng']
            map.fitBounds(streets_layer._layers[x].getBounds()) // access the zoom
            map.fireEvent('click', {latlng: [lat, lng]})
            close_popup_window()
        }
    }
}

function search_building() {
    var select_element = document.getElementById('demo-2')
    var select_element_settlement = document.getElementById('demo-3')
    buildings_layer = window[settlement_list[select_element_settlement.value]['buildings_layer']]
    for (x in buildings_layer._layers) {
        var props = buildings_layer._layers[x].feature['properties'];

        if (props['build_code'] == select_element.value) {
            point_in_layer = (randomPointInPoly(buildings_layer._layers[x]))
            lat = point_in_layer['geometry']['coordinates'][1]
            lng = point_in_layer['geometry']['coordinates'][0]

            map.fitBounds(buildings_layer._layers[x].getBounds())
            map.fireEvent('click', {latlng: [lat, lng]})
            close_popup_window()
        }
    }
}

function search_city() {
    var select_element = document.getElementById('demo-3')
    boundaries_layer = window[settlement_list[select_element.value]['boundaries_layer']]
    // console.log(select_element)
    for (x in boundaries_layer._layers) {
        var props = boundaries_layer._layers[x].feature['properties'];
     
        if (props['settlement_name'] == select_element.outerText) {
            centroid_layer = (turf.centroid(boundaries_layer._layers[x].feature['geometry']))
            lat = centroid_layer['geometry']['coordinates'][1]
            lng = centroid_layer['geometry']['coordinates'][0]
            map.fitBounds(boundaries_layer._layers[x].getBounds()) // access the zoom
            map.fireEvent('click', {latlng: [lat, lng]})
            close_popup_window()
        }
    }
}

function search_parcel_by_cadnum() {
    
var search_input = document.getElementById('search_cadnum_input')
// console.log("search_parcel_by_cadnum")
// console.log(Parcels)
for (x in Parcels._layers) {
        var props = Parcels._layers[x].feature['properties'];
     
        if (props['cadnum'] == search_input.value) {
            centroid_layer = (turf.centroid(Parcels._layers[x].feature['geometry']))
            lat = centroid_layer['geometry']['coordinates'][1]
            lng = centroid_layer['geometry']['coordinates'][0]
            map.fitBounds(Parcels._layers[x].getBounds()) // access the zoom
            map.fireEvent('click', {latlng: [lat, lng]})
            close_popup_window()
        }
    }
    // console.log("search_parcel_by_cadnum1")

}








function search_location_one_input() {
    var search_input = document.getElementById('search_location_one_input')
    if (search_input.value) {
        coordinates = search_input.value.split(',')
        lat = parseFloat(coordinates[0])
        lng = parseFloat(coordinates[1])
       
        map.fireEvent('click', {latlng: [lat, lng]})
         map.fitBounds([[lat-0.005, lng-0.005],
    [lat+0.005, lng+0.005]])
         console.log([lat, lng])
         
        // map.setZoom(17)
        close_popup_window()
    }
    
}


function search_location_two_inputs() {
    var longitude_input = document.getElementById('longitude_input')
    var latitude_input = document.getElementById('latitude_input')

        lat = parseFloat(latitude_input.value)
        lng = parseFloat(longitude_input.value)
 
        map.fireEvent('click', {latlng: [lat, lng]})
               map.fitBounds([[lat-0.005, lng-0.005],
    [lat+0.005, lng+0.005]])
        // map.setZoom(17)
        close_popup_window()
        

    
}
