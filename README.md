# VisualizerMicro

A JS micro library that simplifies getting Spectrum and Waveform data from an audio source using the HTML5 Web Audio API.

**(No dependencies, yay!)**

Inspired by [Dancer.js](https://github.com/jsantell/dancer.js/), and its `getSpectrum` and `getWaveform` methods.

## Install

VisualizerMicro supports the UMD, meaning it supports install/usage through CommonJS, AMD, and globals.

##### CommonJS

```js

var VisualizerMicro = require('visualizer-micro');
var vm = new VisualizerMicro();

```

##### AMD

```js
define(['visualizer-micro'], function(VisualizerMicro) {
	var vm = new VisualizerMicro();
});

```

##### Globals

```html

<script src="/js/libs/visualizer-micro.js"></script>
<script>
	var vm = new VisualizerMicro();
</script>

```

## Setup

### Check for browser support

Before getting any visualization data from the library, browser support should be checked to make sure visualization is possible.

```js
if (vm.isSupported()) {
    //load audio and get visualizer data
}
```

### Load an audio source

The library needs a source to retrieve audio data from. This can be an `<audio>` element **or** an instance of the HTML5 `Audio()` class.

The 2nd parameter expected is a callback, to be called after the audio source has been loaded 

```js
//audio element
var audioEl = document.getElementById('some-audio-el');
var onLoad = function() {
    //do some after the audio source has be loaded
};

vm.load(audioEl, onLoad);
```

```js
//Audio class
var audio = new Audio();

vm.load(audio, onLoad);

```

`load()` only needs to be called once per audio source. It is not necessary to call it again if `audio.src` is changed.

### Unloading an audio source

When that audio source is no longer needed, call `unload()` **before** the audio source has been destroyed.

```js
//before deleting or garbage collecting audio source

vm.unload();

```
        
## Usage

### getSpectrum and getWaveform

These methods retrieve the actual visualization data from the audio source. They each return arrays. They can be called anytime after an audio source is loaded, but in most use cases they'll only be called if the audio source isn't `paused`. They would also normally only be called inside an animation loop to capture the change in audio data.

```js

//inside an animation loop..

if (!audio.paused) {
    var spectrum = vm.getSpectrum();
    
    //and/or
    
    var waveform = vm.getWaveform();
    
    //loop over spectrum and/or waveform array, parsing visualization data..
}
```
    
### setVolumeModifier

The data retrieved from the Web Audio API is linked to the audio source's volume. This means, to return consistent, normalized data, the library needs to know the audio source's volume at all times. Internally this is represented as the `volumeModifier`.

For performance reasons, the volume modifier is only set internally **once** when the audio source is loaded. If the audio source's volume changes, it needs to be set in VisualizerMicro using `setVolumeModifier()`, which expects a value from 0 to 1.

```js
//on change of the audio source's volume

var newVolume = audioEl.volume;

vm.setVolumeModifier(newVolume);

```