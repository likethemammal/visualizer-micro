var VisualizerMicro;

(function(){

    var AudioContext = window.AudioContext || window.webkitAudioContext,
        _warnNotSupported,
        _warnAudioLoaded,
        _onLoad,
        load,
        unload,
        isSupported,
        getSpectrum,
        getWaveform,
        setVolumeModifier,
        logPrefix = 'VisualizerMicro: ',
        loadEventString = 'canplaythrough',
        prototype;

    VisualizerMicro = function () {
        if (!isSupported()) {
            _warnNotSupported();
            return;
        }

        this.alreadyLoaded = false;
        this.context = new AudioContext();
        this.analyser = this.context.createAnalyser();
        this.binCount = false;
        this.loadEventListenerCreated = false;
        this.loadedCallback = false;
        this.audioSource = false;
        this.dataArray = [];
        this.volumeModifier = 1;
    };

    _warnNotSupported = function () {
        console.warn(logPrefix + 'Audio visualization is not supported in this browser');
    };

    _warnAudioLoaded = function () {
        console.warn(logPrefix + "An audio source must be loaded using load() before audio data can be retrieved.");
    };

    _onLoad = function () {

        if (this.alreadyLoaded) {
            return;
        }

        var source = this.context.createMediaElementSource(this.audioSource);

        source.connect(this.analyser);

        this.analyser.connect(this.context.destination);
        this.binCount = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.binCount);

        setVolumeModifier(this.audioSource.volume);

        this.alreadyLoaded = true;
        this.loadedCallback();
    };

    load = function (audio, callback) {

        if (!isSupported()) {
            _warnNotSupported();
            return;
        }

        if (!audio) {
            console.warn(logPrefix + 'An audio source must be supplied to load().');
            return;
        }

        if (!callback) {
            console.warn(logPrefix + 'A callback must be supplied to load().');
            return;
        }

        if (this.audioSource === audio) {
            console.log(logPrefix + 'This audio source has already been loaded, no need to call load() with it again.');
            return;
        }

        if (this.loadEventListenerCreated && this.alreadyLoaded) {
            //remove old audio source so new one can be attached
            unload();
        }

        this.audioSource = audio;
        this.loadEventListenerCreated = true;
        this.loadedCallback = callback;
        this.audioSource.addEventListener(loadEventString, _onLoad.bind(this))
    };

    unload = function () {

        if (!this.audioSource) {
            console.log(logPrefix + "Audio source doesn't exist. This may mean it was destoryed prematurely and could cause a memory leak.");
        } else {
            this.audioSource.removeEventListener(loadEventString, _onLoad);
        }

        this.alreadyLoaded = false;
        this.loadedCallback = false;
        this.loadEventListenerCreated = false;
    };

    isSupported = function () {
        return !!AudioContext;
    };

    getSpectrum = function () {

        if (!isSupported()) {
            _warnNotSupported();
            return;
        }

        if (!this.alreadyLoaded) {
            _warnAudioLoaded();
            return;
        }

        var spectrum = [],
            spectrumLength,
            value;

        this.analyser.getByteFrequencyData(this.dataArray);

        spectrumLength = this.dataArray.length;

        for (var i = 0; i < spectrumLength; i++) {
            value = this.dataArray[i];

            value = (value / this.volumeModifier) / (this.binCount * 4);

            spectrum.push(value);
        }

        return spectrum;
    };

    getWaveform = function () {

        if (!isSupported()) {
            _warnNotSupported();
            return;
        }

        if (!this.alreadyLoaded) {
            _warnAudioLoaded();
            return;
        }

        var spectrum = [],
            waveformLength,
            value;

        this.analyser.getByteTimeDomainData(this.dataArray);

        waveformLength = this.dataArray.length;

        for (var i = 0; i < waveformLength; i++) {
            value = this.dataArray[i];

            value = value - 128;
            value = value / 128;

            spectrum.push(value);
        }

        return spectrum;

    };

    setVolumeModifier = function (volume) {
        this.volumeModifier = (1 / volume);
    };

    //set to prototype
    prototype = VisualizerMicro.prototype;
    prototype._onLoad = _onLoad;
    prototype.load = load;
    prototype.unload = unload;
    prototype.isSupported = isSupported;
    prototype.getSpectrum = getSpectrum;
    prototype.getWaveform = getWaveform;
    prototype.setVolumeModifier = setVolumeModifier;

})();

module.exports = VisualizerMicro;