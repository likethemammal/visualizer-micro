# visualizer-micro

**zero dependencies**

A JS micro library for creating audio visualizers.

Simplifies the use of the HTML5 Web Audio API for retrieving audio data from an audio source. 


Inspired by [Dancer.js](https://github.com/jsantell/dancer.js/), and the `getSpectrum` and `getWaveform` methods.

## Example / Demo

An example of basic install and setup can be found [in the source](https://github.com/likethemammal/visualizer-micro/blob/master/example.html) of the [Live Demo](http://likethemammal.github.io/visualizer-micro/example.html).

## Install

visualizer-micro supports the UMD, meaning it supports install/usage through ES6 modules, CommonJS, AMD, and script tag globals.

Check out the `dist/` directory for the [minified](dist/visualizer-micro.min.js) and [unminified](dist/visualizer-micro.js) production scripts.

```
npm install -d visualizer-micro
```

## Setup

```
import VisualizerMicro from 'visualizer-micro'

var vm = new VisualizerMicro()
```

### Check for browser support

Before getting any visualization data, check for browser support to make sure visualization is possible.

```js

if (vm.isSupported()) {
    // load audio and get visualizer data
}

```

### Load an audio source

**Before you can call load(), the user has to click something**. Read more about why [here](https://developers.google.com/web/updates/2017/09/autoplay-policy-changes).

First parameter is the source for audio data. This can be an `<audio>` element **or** an instance of the HTML5 `Audio()` class.

Second parameter is a callback, that will be called once the audio source has been loaded for visualization.

```js

// <audio> element
var audioEl = document.getElementById('some-audio-el')
var onLoad = function() {
    // do something after the audio source has be loaded
}

vm.load(audioEl, onLoad)

```

```js

// Audio class
var audio = new Audio()

vm.load(audio, onLoad)

```

`load()` only needs to be called once per audio source. It is not necessary to call it again if `audio.src` is changed.

### Unloading an audio source

When the audio source is no longer needed, call `unload()` **before** the audio source has been destroyed/remove/collected.

```js

// before deleting or garbage collecting audio source

vm.unload();

```
        
## Usage

### getSpectrum and getWaveform

These methods retrieve the actual visualization data from the audio source. They each return arrays of numbers. They can be called anytime after an audio source is loaded, but in most cases they'll only be called if the audio source isn't `paused`. Generally they're only called inside an animation loop to capture the **change** in audio data.

```js

// inside an animation loop..

if (!audio.paused) {
    var spectrum = vm.getSpectrum();
    
    // and/or
    
    var waveform = vm.getWaveform();
    
    // ...loop over spectrum and/or waveform array, parsing visualization numbers..
}

```
