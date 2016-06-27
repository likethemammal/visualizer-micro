var AudioContext = window.AudioContext || window.webkitAudioContext;

var alreadyLoaded = false;
var context;
var analyser;
var binCount;
var dataArray;
var audioSource;
var loadEventListenerCreated;

var isSupported = function () {
    return !!AudioContext;
};

var _warnNotSupported = function () {
    //error: audio visualization is not supported in this browser
};

var setVolumeModifier = function (volume) {
    volumeModifier = (1 / volume);
};


var VisualizerMicro = function () {

    if (!isSupported()) {
        _warnNotSupported();
        return;
    }

    context = new AudioContext();
    analyser = context.createAnalyser();
};

var getSpectrum = function () {

    if (!isSupported()) {
        _warnNotSupported();
        return;
    }

    var spectrum = [];
    var spectrumLength = dataArray.length;
    var value;

    analyser.getByteFrequencyData(dataArray);

    for (var i = 0; i < spectrumLength; i++) {
        value = dataArray[i];

        value = (value / volumeModifier) / (binCount * 4);

        spectrum.push(value);
    }

    return spectrum;
};

var getWaveform = function () {

    if (!isSupported()) {
        _warnNotSupported();
        return;
    }

    var spectrum = [];
    var waveformLength = dataArray.length;
    var value;

    analyser.getByteTimeDomainData(dataArray);

    for (var i = 0; i < waveformLength; i++) {
        value = dataArray[i];

        value = value - 128;
        value = value / 128;

        spectrum.push(value);
    }

    return spectrum;

};

var _onLoad = function () {

    if (alreadyLoaded) {
        return;
    }

    var source = context.createMediaElementSource(audioSource);

    source.connect(analyser);
    analyser.connect(context.destination);
    
    binCount = analyser.frequencyBinCount;
    dataArray = new Uint8Array(binCount);

    setVolumeModifier(audioSource.volume);

    alreadyLoaded = true;

};

var load = function (audio) {

    if (!isSupported()) {
        _warnNotSupported();
        return;
    }

    if (audioSource === audio) {
        //warn: this audio source has already be loaded, no need to call load with it again
    }

    if (loadEventListenerCreated) {
        unload();
    }
    
    audioSource = audio;
    loadEventListenerCreated = true;
    audioSource.addEventListener('canplaythrough', _onLoad)
};

var unload = function () {
    audioSource.removeEventListener('canplaythrough', _onLoad);
    alreadyLoaded = false;
    loadEventListenerCreated = false;
};

module.exports = VisualizerMicro;