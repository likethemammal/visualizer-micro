For performance reasons, the volume modifier is only set internally when the audio source is loaded. If the audioSource's volume changes, it needs to be reset use setVolumeModifier, which expects a value 0 to 1.

Install

Setup

    load audio
    
    set volume
    
Usage

    getSpectrum

    getWaveform
    