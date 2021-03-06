# WebSynth.io

A simple React-based synthesizer built on the [Web MIDI API](https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API) and [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API). Originally built for Raspberry Pi with a mini display, but compatible with any Chromium browser. 

![GIF of Welcome Screen and Notes Playing In-App](https://websynth.io/WebSynth_Demo.gif)

### [Live Demo](https://websynth.io/)

### Updates
In the latest release, I've refactored the code to be way more readable and just generally better. Input has been separated to its own components (for easy updating), and re-renders have been optimized for better performance. The beginnings of computer keyboard input have been added but it's buggy as hell right now, so don't test it lol.

### Compatibility
The [Web MIDI API](https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API) is not currently supported in Safari or Firefox. Because of this, the synth will only work in Chrome with a MIDI device connected.

## Get Started

### `npm install`
You know the drill. Install project dependencies. There aren't a ton, pretty much just standard React stuff.

### `npm run startHTTPS`

Run to start a localhost server with HTTPS enabled. This is currently required by most browsers to enable the MIDI API. Runs on [https://localhost:3000](https://localhost:3000).

This should also have live reload enabled, but it can be finicky so ya know, just refresh every now and then.

### `Have Fun 🎉`

Set up is pretty easy, so at this point you should be jamming on your MIDI keyboard. 

## MIDI Configuration

The MIDI mappings were originally set up for the [Arturia Minilab Mk II](https://www.arturia.com/products/hybrid-synths/minilab-mkii/overview) but can easily be configured for other devices. All core settings can be accessed via `src/midi-config.js`. See comments in `keyDownHandler` and `rangeHandler` for instructions - basically, just `console.log` the input parameter to see your input data. It'll output an array with the following values `[status code, note, velocity]`. The `note` value is what you'll wanna plug in to `midi-config.js`. I'll probably add a MIDI configuration step in the frontend at some point but, but 🤷‍♂️.

## Coming Soon

Up next, I'll probably be adding computer keyboard support, mobile inputs, and more.
