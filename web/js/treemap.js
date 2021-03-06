'use strict';

function render() {

  // console.log("render() - start");

  var width = $("#id-treemap").parent().width();
  var height = $("#id-navigation").height() / 2;

  // console.log("width: " + width + " height: " + height);

  var spec = {

    "$schema": "https://vega.github.io/schema/vega/v3.0.json",
    "width": width,
    "height": height,
    "padding": 2.5,
    "autosize": "none",

    "signals": [
      {
        "name": "layout", "value": "squarify",
        "bind": {
          "input": "select",
          "options": [
            "squarify",
            "binary",
            "slicedice"
          ]
        }
      },
      {
        "name": "aspectRatio", "value": 1.0,
        "bind": {"input": "range", "min": 0.2, "max": 5, "step": 0.1}
      }
    ],

    "data": [
      {
        "name": "tree",
        "url": "assets/data/ring-system.json",
        "transform": [
          {
            "type": "stratify",
            "key": "id",
            "parentKey": "parent"
          },
          {
            "type": "treemap",
            "field": "size",
            "sort": {"field": "value"},
            "round": true,
            "method": {"signal": "layout"},
            "ratio": {"signal": "aspectRatio"},
            "size": [{"signal": "width"}, {"signal": "height"}]
          }
        ]
      },
      {
        "name": "nodes",
        "source": "tree",
        "transform": [{ "type": "filter", "expr": "datum.children" }]
      },
      {
        "name": "leaves",
        "source": "tree",
        "transform": [{ "type": "filter", "expr": "!datum.children" }]
      }
    ],

    "scales": [
      {
        "name": "color",
        "type": "ordinal",
        "range": [
          "#3182bd", "#6baed6", "#9ecae1", "#c6dbef", "#e6550d",
          "#fd8d3c", "#fdae6b", "#fdd0a2", "#31a354", "#74c476",
          "#a1d99b", "#c7e9c0", "#756bb1", "#9e9ac8", "#bcbddc",
          "#dadaeb", "#636363", "#969696", "#bdbdbd", "#d9d9d9"
        ]
      },
      {
        "name": "size",
        "type": "ordinal",
        "domain": [0, 1, 2, 3],
        "range": [256, 28, 20, 14]
      },
      {
        "name": "opacity",
        "type": "ordinal",
        "domain": [0, 1, 2, 3],
        "range": [0.15, 0.5, 0.8, 1.0]
      }
    ],

    "marks": [
      {
        "type": "rect",
        "from": {"data": "nodes"},
        "interactive": false,
        "encode": {
          "enter": {
            "fill": {"scale": "color", "field": "name"}
          },
          "update": {
            "x": {"field": "x0"},
            "y": {"field": "y0"},
            "x2": {"field": "x1"},
            "y2": {"field": "y1"}
          }
        }
      },
      {
        "type": "rect",
        "from": {"data": "leaves"},
        "encode": {
          "enter": {
            "stroke": {"value": "#fff"}
          },
          "update": {
            "x": {"field": "x0"},
            "y": {"field": "y0"},
            "x2": {"field": "x1"},
            "y2": {"field": "y1"},
            "fill": {"value": "transparent"}
          },
          "hover": {
            "fill": {"value": "red"}
          }
        }
      },
      {
        "type": "text",
        "from": {"data": "nodes"},
        "interactive": false,
        "encode": {
          "enter": {
            "font": {"value": "Helvetica Neue, Arial"},
            "align": {"value": "center"},
            "baseline": {"value": "middle"},
            "fill": {"value": "#000"},
            "text": {"field": "name"},
            "fontSize": {"scale": "size", "field": "depth"},
            "fillOpacity": {"scale": "opacity", "field": "depth"}
          },
          "update": {
            "x": {"signal": "0.5 * (datum.x0 + datum.x1)"},
            "y": {"signal": "0.5 * (datum.y0 + datum.y1)"}
          }
        }
      }
    ]
  };

  window.view = new vega.View(vega.parse(spec), {
    // loader: vega.loader({baseURL: 'https://tentpole-events.github.io/website/'}),
    // loader: vega.loader({baseURL: 'http://localhost:8000/'}),
    loader: vega.loader({baseURL: 'https://tentpole-events.github.io/website/'}),
    logLevel: vega.Warn,
    renderer: 'svg'
  }).initialize('#id-treemap').hover().run();

  // console.log("render() - end");
}

function image(view, type) {
  return function(event) {
    event.preventDefault();
    view.toImageURL(type).then(function(url) {
      var link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('target', '_blank');
      link.setAttribute('download', 'treemap.' + type);
      link.dispatchEvent(new MouseEvent('click'));
    }).catch(function(error) { console.error(error); });
  };
}

function update() {

  // console.log("update() - start");

  var width = $("#id-treemap").parent().width();
  var height = $("#id-navigation").height() / 2;

  // console.log("width: " + width + " height: " + height);

  // window.view.width(width).height(height).renderer("svg").update();
  // window.view.update();

  $("#id-treemap svg").css("width", width).css("height", height);
  window.view.width(width).height(height);

  // console.log("view width: " + window.view.width() + " window height: " + window.view.height());
  // console.log("update() - end");
}