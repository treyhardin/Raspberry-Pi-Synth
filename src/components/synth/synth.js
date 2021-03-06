import { useEffect, useState, useRef } from 'react'
import { effectsSettings, midiMapping } from '../../midi-config'
import { midiNoteToFrequency, getColorFromNote, getNameFromNoteNumber, getOctaveFromNoteNumber, normalize } from '../../helpers/helpers'
import Input from '../input/input'
import Landing from '../landing/landing'
import './synth.css'
import SettingsWidget from '../settings-widget/settings-widget'


export default function Synth(props) {

    // Synth Active State
    const [ synthActive, setSynthActive ] = useState(false)
    let synthActiveRef = useRef()
    synthActiveRef.current = synthActive

    // Audio Content State
    const [ audioContext, setAudioContext ] = useState(null)
    let audioContextRef = useRef()
    audioContextRef.current = audioContext

    // Hacky State to Force Rerender on Input Change
    const [ inputStatus, setInputStatus ] = useState(false)

    // Input Source State
    const [ inputType, setInputType ] = useState('qwerty')
    let inputTypeRef = useRef()
    inputTypeRef.current = inputType

    // On-Screen Keyboard State
    const [ virtualKeyboard, setVirtualKeyboard ] = useState(null)
    let virtualKeyboardRef = useRef()
    virtualKeyboardRef.current = virtualKeyboard

    /*-- Synth States --*/

    // All API Supported Waveshapes
    let waveTypes = ['Sine', 'Sawtooth', 'Square', 'Triangle']

    // Active Notes State
    const [ activeNotes, setActiveNotes ] = useState({})

    // VCO Wave Type State
    const [ VCOType, setVCOType ] = useState(null)
    const VCOTypeRef = useRef()
    VCOTypeRef.current = VCOType

    // VCA Wave State
    const [ VCAGain, setVCAGain ] = useState(null)
    const VCAGainRef = useRef()
    VCAGainRef.current = VCAGain

    // LFO State
    const [ LFO, setLFO ] = useState(null)
    const LFORef = useRef()
    LFORef.current = LFO

    // LFO Wave Type State
    const [ LFOType, setLFOType ] = useState(null)
    const LFOTypeRef = useRef()
    LFOTypeRef.current = LFOType

    // LFO Frequency State
    const [ LFOFrequency, setLFOFrequency ] = useState(null)
    const LFOFrequencyRef = useRef()
    LFOFrequencyRef.current = LFOFrequency

    // LFO Gain State
    const [ LFOGain, setLFOGain ] = useState(null)
    const LFOGainRef = useRef()
    LFOGainRef.current = LFOGain

    // Available VCF Types - Enable More if You Want
    let VCFTypes = ['Lowpass', 'Highpass'] // 'Bandpass', 'Lowshelf', 'Highshelf', 'Peaking', 'Notch', 'Allpass'

    // VCF Type State
    const [ VCFType, setVCFType ] = useState(null)
    const VCFTypeRef = useRef()
    VCFTypeRef.current = VCFType

    // VCF Frequency State
    const [ VCFFrequency, setVCFFrequency ] = useState(null)
    const VCFFrequencyRef = useRef()
    VCFFrequencyRef.current = VCFFrequency

    // VCF Q State
    const [ VCFQ, setVCFQ ] = useState(null)
    const VCFQRef = useRef()
    VCFQRef.current = VCFQ

    // VCF Gain State
    const [ VCFGain, setVCFGain ] = useState(null)
    const VCFGainRef = useRef()
    VCFGainRef.current = VCFGain

    // VCF Gain State
    const [ outputGain, setOutputGain ] = useState(null)
    const outputGainRef = useRef()
    outputGainRef.current = outputGain


    /*-- Set Initial States --*/

    // Initialize Audio Context
    window.AudioContext = window.AudioContext || window.webkitAudioContext

    
    useEffect(() => {

        // Set Synth Defaults
        setVCOType(effectsSettings.VCOTypeDefault)
        setVCAGain(effectsSettings.VCAGainDefault)
        setLFOType(effectsSettings.LFOTypeDefault)
        setLFOGain(effectsSettings.LFOGainDefault)
        setVCFType(effectsSettings.VCFTypeDefault)
        setVCFFrequency(effectsSettings.VCFFrequencyDefault)
        setVCFQ(effectsSettings.VCFQDefault)
        setVCFGain(effectsSettings.VCFGainDefault)
        setOutputGain(effectsSettings.outputGainDefault)
        
        // Create Audio Context
        if(synthActiveRef.current && !audioContext) {
            setAudioContext(new AudioContext())
        }

        // Create Global LFO
        if (audioContextRef.current) {
            let newLFO = audioContext.createOscillator()
            newLFO.type = LFOTypeRef.current.toLowerCase()
            newLFO.frequency.value = effectsSettings.LFOFrequencyDefault
            setLFOFrequency(newLFO.frequency.value)
            setLFO(newLFO)
            newLFO.start()
        }

        if (virtualKeyboardRef.current) {
            console.log('virtual keys')
            let virtualKeys = virtualKeyboardRef.current.querySelectorAll('.keyboard-note')
            virtualKeys.forEach((virtualKey) => {
                virtualKey.addEventListener('mousedown', virtualKeyDownHandler)
                virtualKey.addEventListener('mouseup', virtualKeyUpHandler)
            })
        }
        
    }, [synthActive, audioContext, virtualKeyboard])

    /*-- Handle Inputs --*/

    const keyDownHandler = (input) => {

        // Console.log the input here and look for the 2nd item in the array to find your controller's input values
        // console.log(input)

        let note = input.data[1]
        let velocity = input.data[2]

        // Create VCO (Base Tone Oscillator)
        let VCO = audioContextRef.current.createOscillator()
        VCO.type = VCOTypeRef.current.toLowerCase()
        VCO.frequency.value = midiNoteToFrequency(note)
        VCO.start(audioContextRef.current.currentTime)

        // Create VCA (Base Tone Gain)
        let VCA = audioContextRef.current.createGain()
        VCA.gain.value = (VCAGainRef.current / 127) * velocity;
        VCO.VCA = VCA

        // Create LFO Gain
        let LFOGain = audioContextRef.current.createGain()
        LFOGain.gain.value = LFOGainRef.current;
        LFORef.current.connect(LFOGain)
        LFORef.current.LFOGain = LFOGain

        // Add LFO to Object
        LFORef.current.LFOGain.gain.value = LFOGainRef.current
        LFORef.current.type = LFOTypeRef.current.toLowerCase()
        VCO.LFO = LFORef.current

        // Create VCF
        let VCF = new BiquadFilterNode(audioContextRef.current, {
            type: VCFTypeRef.current.toLowerCase(),
            q: VCFQRef.current,
            frequency: VCFFrequencyRef.current,
            gain: VCFGainRef.current
        })
        VCO.VCF = VCF
        
        // Create Output Gain
        let output = audioContextRef.current.createGain()
        output.gain.value = outputGainRef.current
        VCO.output = output

        // Connect Modules
        LFORef.current.LFOGain.connect(VCA.gain)
        VCO.connect(VCA)
        VCA.connect(VCF)
        VCF.connect(output)
        output.connect(audioContextRef.current.destination)

        // Update Active Notes
        let newActiveNotes = activeNotes
        newActiveNotes[note] = VCO
        VCO.note = note
        setActiveNotes(newActiveNotes)

        // Force Re-Render
        setInputStatus(inputStatus => !inputStatus)

    }

    const keyUpHandler = (input) => {

        // console.log(activeNotes)

        let note = input.data[1]
        const currentOscillator = activeNotes[note]

        // Fade Out VCA Gain
        let fadeOut = 0.03;

        const currentOutputGain = currentOscillator.output
        currentOutputGain.gain.setValueAtTime(currentOutputGain.gain.value, audioContextRef.current.currentTime)
        currentOutputGain.gain.exponentialRampToValueAtTime(0.00001, audioContextRef.current.currentTime + fadeOut)

        setTimeout(() => {
            currentOscillator.stop()
            currentOscillator.disconnect()
        }, fadeOut + 20)

        // Remove From Active Notes
        let newActiveNotes = activeNotes
        delete newActiveNotes[note]
        setActiveNotes(newActiveNotes)

        // Force Re-Render
        setInputStatus(inputStatus => !inputStatus)

    }

    const rangeHandler = (input) => {

        // Console.log the input here and look for the 2nd item in the array to find your controller's input values
        // console.log(input)

        let inputNumber = input.data[1]
        let inputValue = input.data[2]

        let waveToggleStepSize = 127 / (waveTypes.length - 1)
        let VCFToggleStepSize = 127 / (VCFTypes.length - 1)

        switch (inputNumber) {

            case midiMapping.VCOTypeInput:
                let VCOWaveTypeIndex = Math.round(inputValue / waveToggleStepSize)
                setVCOType(waveTypes[VCOWaveTypeIndex])
                Object.entries(activeNotes).map(([key, value]) => {
                    return value['type'] = waveTypes[VCOWaveTypeIndex].toLowerCase()
                })
                break

            case midiMapping.VCAGainInput:
                let normalizedVCAGain = normalize(inputValue, 127, effectsSettings.VCAGainMin, effectsSettings.VCAGainMax)
                setVCAGain(normalizedVCAGain)
                Object.entries(activeNotes).map(([key, value]) => {
                    return value['VCA']['gain']['value'] = normalizedVCAGain
                })
                break

            case midiMapping.LFOWaveTypeInput:
                let LFOWaveTypeIndex = Math.floor(inputValue / waveToggleStepSize)
                setLFOType(waveTypes[LFOWaveTypeIndex])

                Object.entries(activeNotes).map(([key, value]) => {
                    return value['LFO']['type'] = waveTypes[LFOWaveTypeIndex].toLowerCase()
                })
                break

            case midiMapping.LFOFrequencyInput:
                let normalizedLFOFrequency = normalize(inputValue, 127, effectsSettings.LFOFrequencyMin, effectsSettings.LFOFrequencyMax)
                setLFOFrequency(normalizedLFOFrequency)

                Object.entries(activeNotes).map(([key, value]) => {
                    return value['LFO']['frequency']['value'] = normalizedLFOFrequency
                })
                break

            case midiMapping.LFOGainInput:
                let normalizedLFOGain = normalize(inputValue, 127, effectsSettings.LFOGainMin, effectsSettings.LFOGainMax)
                setLFOGain(normalizedLFOGain)
                Object.entries(activeNotes).map(([key, value]) => {
                    return value['LFO']['LFOGain']['gain']['value'] = normalizedLFOGain
                })
                break

            case midiMapping.VCFTypeInput:
                let VCFTypeIndex = Math.round(inputValue / VCFToggleStepSize)
                setVCFType(VCFTypes[VCFTypeIndex])
                Object.entries(activeNotes).map(([key, value]) => {
                    return value['VCF']['type'] = VCFTypes[VCFTypeIndex].toLowerCase()
                })
                break

            case midiMapping.VCFQInput:
                let normalizedVCFQ = normalize(inputValue, 127, effectsSettings.VCFQMin, effectsSettings.VCFQMax)
                setVCFQ(normalizedVCFQ)
                Object.entries(activeNotes).map(([key, value]) => {
                    return value['VCF']['q'] = normalizedVCFQ
                })
                break

            case midiMapping.VCFFrequencyInput:
                let normalizedVCFFrequency = normalize(inputValue, 127, effectsSettings.VCFFrequencyMin, effectsSettings.VCFFrequencyMax)
                setVCFFrequency(normalizedVCFFrequency)
                Object.entries(activeNotes).map(([key, value]) => {
                    return value['VCF']['frequency']['value'] = normalizedVCFFrequency
                })
                break

            case midiMapping.VCFGainInput:
                let normalizedVCFGain = normalize(inputValue, 127, effectsSettings.VCFGainMin, effectsSettings.VCFGainMax)
                setVCFGain(normalizedVCFGain)
                Object.entries(activeNotes).map(([key, value]) => {
                    return value['VCF']['gain']['value'] = normalizedVCFGain
                })
                break

            case midiMapping.outputGainInput:
                let normalizedOutputGain = normalize(inputValue, 127, effectsSettings.outputGainMin, effectsSettings.outputGainMax)
                setOutputGain(normalizedOutputGain)
                Object.entries(activeNotes).map(([key, value]) => {
                    // console.log(value)
                    return value['output']['gain']['value'] = normalizedOutputGain
                })
                break
            default:
                break

        }
    }

    const padDownHandler = (input) => {
        console.log("Pad Down")
    }

    const padUpHandler = (input) => {
        console.log("Pad Up")
    }

    const aftertouchHandler = (input) => {
        console.log("Aftertouch")
    }

    const pitchBendHandler = (input) => {

        let inputValue = input.data[2] - 127 / 2
        let pitchBendStrength = 13.082 / 63.5 * 2

        Object.entries(activeNotes).map(([key, value]) => {
            let originalFrequency = midiNoteToFrequency(key)
            return value.frequency.value = originalFrequency + inputValue * pitchBendStrength
        })
    }

    let currentVirtualKey;

    // virtualKeyboardRef.current

    const virtualKeyDownHandler = (e, keyDownData) => {

        // console.log(keyDownData)

        if (inputTypeRef.current === 'qwerty') {
            

            let virtualKey
            let virtualKeyNote
            let virtualKeyLabel

            if (keyDownData) {
                virtualKeyNote = keyDownData.data[1]
                virtualKey = document.querySelector(`[data-key-note='${virtualKeyNote}']`)
            } else {
                virtualKey = e.target
                virtualKeyLabel = virtualKey.dataset.keyLabel
                virtualKeyNote = virtualKey.dataset.keyNote
            }

            // console.log(virtualKeyNote)
            currentVirtualKey = virtualKey

            virtualKey.classList.add('pressed')
            keyDownHandler({data: [144, virtualKeyNote, 0]})


        }
    }

    const virtualKeyUpHandler = (e, keyUpData) => {

        if (inputTypeRef.current === 'qwerty') {

            let virtualKey
            let virtualKeyNote
            let virtualKeyLabel

            if (keyUpData) {
                virtualKeyNote = keyUpData.data[1]
                virtualKey = document.querySelector(`[data-key-note='${virtualKeyNote}']`)
            } else {
                virtualKey = e.target
                virtualKeyLabel = virtualKey.dataset.keyLabel
                virtualKeyNote = virtualKey.dataset.keyNote
            }

            // console.log(keyUpData)
            keyUpHandler({data: [144, virtualKeyNote, 0]})
            virtualKey.classList.remove('pressed')

        }
    }

    const setNewInputType = (type) => {
        setInputType(type)
    }

    

    
    return (
        <div className='synth-wrapper'>
        <Landing 
            // activateSynth={activateSynth} 
            synthActive={synthActiveRef.current} 
            setAudioContext={setAudioContext}
            setSynthActive={setSynthActive} 
            setNewInputType={setNewInputType}
        />
        <Input 
            keyDown={keyDownHandler} 
            keyUp={keyUpHandler}
            range={rangeHandler}
            padDown={padDownHandler}
            padUp={padUpHandler}
            aftertouch={aftertouchHandler}
            pitchBend={pitchBendHandler}
            synthActive={synthActiveRef.current}
            virtualKeyDown={virtualKeyDownHandler}
            virtualKeyUp={virtualKeyUpHandler}
            // inputType={inputType}
        />
        <section className='oscillator-wrapper'>
            <SettingsWidget 
                label="VCO" 
                waveType={VCOTypeRef.current}
                icon={true}
                info={{'gain': VCAGainRef.current}}
                // gain={vcaGainRef.current}
            />
            <SettingsWidget 
                label="LFO" 
                waveType={LFOTypeRef.current}
                icon={true}
                info={{
                    'freq': LFOFrequencyRef.current,
                    'gain': LFOGainRef.current
                }}
                // gain={vcaGainRef.current}
            />
        </section>
        <section className='notes-wrapper'>
        
            {inputType === 'midi' ?
                Object.entries(activeNotes).length <= 0 ? 
                    <p className='note-card note-placeholder'>????</p> :
                    Object.entries(activeNotes).map(([key, value]) => {
                        return (
                            // <p key={key}>{value.note}</p>
                            <div key={key} className="note-card" style={getColorFromNote(key)}>
                                <h3 className="note-name">{getNameFromNoteNumber(key)}</h3>
                                <p className="note-octave label">{getOctaveFromNoteNumber(key)}</p>
                            </div>
                        )
                    }) : null
            }

            {inputType === 'qwerty' ?
                <div className='keyboard-wrapper' ref={virtualKeyboardRef}>
                    <span data-key-label='a' data-key-note='48' className='keyboard-note label'>a</span>
                    <span data-key-label='w' data-key-note='49' className='keyboard-note black-note label'>w</span>
                    <span data-key-label='s' data-key-note='50' className='keyboard-note label'>s</span>
                    <span data-key-label='e' data-key-note='51' className='keyboard-note label black-note label'>e</span>
                    <span data-key-label='d' data-key-note='52' className='keyboard-note label'>d</span>
                    <span data-key-label='f' data-key-note='53' className='keyboard-note label'>f</span>
                    <span data-key-label='t' data-key-note='54' className='keyboard-note label black-note label'>t</span>
                    <span data-key-label='g' data-key-note='55' className='keyboard-note label'>g</span>
                    <span data-key-label='y' data-key-note='56' className='keyboard-note label black-note label'>y</span>
                    <span data-key-label='h' data-key-note='57' className='keyboard-note label'>h</span>
                    <span data-key-label='u' data-key-note='58' className='keyboard-note label black-note label'>u</span>
                    <span data-key-label='j' data-key-note='59' className='keyboard-note label'>j</span>

                    <span data-key-label='k' data-key-note='60' className='keyboard-note label'>k</span>
                    <span data-key-label='o' data-key-note='61' className='keyboard-note label black-note label'>o</span>
                    <span data-key-label='l' data-key-note='62' className='keyboard-note label'>l</span>
                    <span data-key-label='p' data-key-note='63' className='keyboard-note label black-note label'>p</span>
                    <span data-key-label=';' data-key-note='64' className='keyboard-note label'>;</span>
                </div>
                : null
            }


            
        </section>
        <section className='LFO-wrapper'>
            <span className='text-setting'>
                <p>{VCFTypeRef.current}</p>
            </span>
            
            <SettingsWidget 
                // label={VCFTypeRef.current}
                waveType={LFOTypeRef.current}
                icon={false}
                info={{
                    // 'type': VCFTypeRef.current,
                    'freq': VCFFrequencyRef.current,
                    // 'Q': VCFQRef.current,
                    'Gain': VCFGainRef.current
                }}
                // gain={vcaGainRef.current}
            />
        </section>
        
        </div>
    )
}