import { useState, useRef, useEffect } from 'react'
import './landing.css'

export default function Landing(props) {

  // const [ isMIDIReady, setIsMIDIReady ] = useState()
  // let isMIDIReadyRef = useRef()
  // isMIDIReadyRef.current = isMIDIReady

  const [ MIDIDevices, setMIDIDevices ] = useState(null)
  let MIDIDevicesRef = useRef()
  MIDIDevicesRef.current = MIDIDevices

  let hasMIDISupport = "requestMIDIAccess" in navigator

  useEffect(() => {
      // Check Browser Support
      if (navigator.requestMIDIAccess && hasMIDISupport) {
          navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure)
      } else {
          console.log('Your Browser Does Not Support  MIDI. Switching to Computer Keyboard')
      }
  }, [])

  // Handle MIDI Success
  const onMIDISuccess = (midiAccess) => {

      // Detect Device Change
      midiAccess.addEventListener('stateChange', updateDevices)

      // Get Compatible Inputs
      const inputs = midiAccess.inputs;

      // Get Available Devices
      if (inputs.size > 0) {

        let newDevices = []

        inputs.forEach((input) => {
          console.log(input)
          if (input.state === 'connected') {
            newDevices.push(input.name)
          }
        })

        if (newDevices.length <= 0) newDevices = null
        // newDevices.push(inputs[0])
        // console.log(inputs)
        setMIDIDevices(newDevices)
      }

      props.setNewInputType('midi')
  }

  // Handle Device List Update
  const updateDevices = (devices) => {
      console.log("MIDI Device change")
  }

  // Handle MIDI Failure
  const onMIDIFailure = () => {
    console.log('Could Not Connect to MIDI Cevice.')
  }

  if (!props.synthActive) {
    return (
      <section className="landing-screen">
        <div className='landing-title-wrapper'>
          <svg className='title-text' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 788 91">
            <mask id="i" fill="#fff">
              <path d="M15.406 87.232.816 3.21h33.399l6.094 48.808h2.812L52.38 3.21h25.547l9.258 48.808h2.812L96.09 3.21h33.398l-14.59 84.023H70.484L66.5 55.24h-2.695L59.82 87.232H15.406Zm118.887 0V3.21h78.984v26.133h-46.054v5.566h44.297V55.65h-44.297v5.508h46.054v26.074h-78.984ZM298.18 44.459c3.984 2.343 7.011 5.02 9.082 8.027 2.07 2.969 3.105 6.66 3.105 11.074 0 7.188-2.91 12.93-8.73 17.227-5.782 4.297-15.098 6.445-27.949 6.445h-54.434V3.21h56.601c6.25 0 11.602.683 16.055 2.05 4.492 1.329 7.891 3.145 10.195 5.45 2.305 2.265 3.946 4.648 4.922 7.148.977 2.5 1.465 5.235 1.465 8.203 0 3.086-.566 5.782-1.699 8.086-1.133 2.266-2.305 3.906-3.516 4.922-1.211.977-2.91 2.168-5.097 3.574v1.817ZM272.047 28.11h-19.863v8.613h19.863c1.406 0 2.519-.312 3.34-.937.859-.625 1.347-1.192 1.465-1.7a5.357 5.357 0 0 0 .234-1.581c-.039-2.93-1.719-4.395-5.039-4.395Zm.293 34.102c1.406 0 2.5-.352 3.281-1.055.781-.703 1.231-1.309 1.348-1.816a7.315 7.315 0 0 0 .176-1.524 6.28 6.28 0 0 0-.176-1.523c-.117-.508-.567-1.094-1.348-1.758-.781-.664-1.875-.996-3.281-.996h-20.156v8.672h20.156Zm85.019 27.833c-15.859-.079-27.304-2.618-34.336-7.618-6.992-5-10.214-13.222-9.668-24.668h29.532c0 4.454 4.824 6.72 14.472 6.797 4.219.079 7.344-.273 9.375-1.054 2.032-.782 3.047-1.778 3.047-2.989v-.586c0-.078-.019-.214-.058-.41a1.309 1.309 0 0 0-.176-.469c-.039-.156-.137-.331-.293-.527a1.695 1.695 0 0 0-.527-.527 7.689 7.689 0 0 0-.821-.469 4.14 4.14 0 0 0-1.113-.469c-.43-.156-.938-.293-1.523-.41a8.418 8.418 0 0 0-1.817-.293l-11.074-1.699a223.484 223.484 0 0 1-4.863-.645 271.601 271.601 0 0 1-5.157-.761 272.96 272.96 0 0 1-5.039-.88c-2.109-.429-3.789-.839-5.039-1.23-1.211-.39-2.715-.957-4.511-1.699-1.758-.742-3.145-1.543-4.161-2.402a55.405 55.405 0 0 1-3.339-3.106c-1.211-1.25-2.149-2.617-2.813-4.101-.664-1.485-1.211-3.203-1.641-5.157-.429-1.953-.644-4.101-.644-6.445 0-8.789 3.535-15.605 10.605-20.449 7.11-4.883 17.696-7.324 31.758-7.324 6.875 0 12.774.469 17.695 1.406 4.961.898 9.434 2.5 13.418 4.805 4.024 2.304 6.973 5.605 8.848 9.902 1.914 4.297 2.774 9.61 2.578 15.938h-29.297c-.859-4.454-5.507-6.68-13.945-6.68-6.719 0-10.078 1.367-10.078 4.101 0 .352.019.625.058.82.04.196.176.567.411 1.114.234.508.703.937 1.406 1.29.742.312 1.68.546 2.812.702l8.789 1.407c1.602.273 3.829.585 6.68.937 2.891.351 5.293.645 7.207.879 1.953.234 4.258.664 6.914 1.289 2.696.586 4.961 1.23 6.797 1.933 1.836.704 3.75 1.7 5.742 2.989s3.575 2.754 4.746 4.394c1.211 1.641 2.207 3.672 2.989 6.094.781 2.422 1.172 5.137 1.172 8.145 0 9.648-3.711 16.777-11.133 21.386-7.383 4.61-18.711 6.856-33.985 6.739ZM496.871 3.209l-34.219 58.535v25.488H429.84V61.451L395.738 3.209h34.453l15 27.597h2.286L462.594 3.21h34.277Zm2.461 84.023V3.21h37.617l20.508 38.027h2.871V3.209h31.992v84.023h-36.679l-21.27-38.027h-3.047v38.027h-31.992ZM689.469 3.209v27.304h-29.414v56.72h-32.813v-56.72h-29.355V3.21h91.582Zm64.863 0h32.871v84.023h-32.871V59.048h-26.484v28.184h-32.93V3.21h32.93v28.24h26.484V3.209Z"/>
            </mask>
            <path fill="url(#a)" d="M15.406 87.232.816 3.21h33.399l6.094 48.808h2.812L52.38 3.21h25.547l9.258 48.808h2.812L96.09 3.21h33.398l-14.59 84.023H70.484L66.5 55.24h-2.695L59.82 87.232H15.406Z"/>
            <path fill="url(#b)" d="M134.293 87.232V3.21h78.984v26.133h-46.054v5.566h44.297V55.65h-44.297v5.508h46.054v26.074h-78.984Z"/>
            <path fill="url(#c)" d="M298.18 44.459c3.984 2.343 7.011 5.02 9.082 8.027 2.07 2.969 3.105 6.66 3.105 11.074 0 7.188-2.91 12.93-8.73 17.227-5.782 4.297-15.098 6.445-27.949 6.445h-54.434V3.21h56.601c6.25 0 11.602.683 16.055 2.05 4.492 1.329 7.891 3.145 10.195 5.45 2.305 2.265 3.946 4.648 4.922 7.148.977 2.5 1.465 5.235 1.465 8.203 0 3.086-.566 5.782-1.699 8.086-1.133 2.266-2.305 3.906-3.516 4.922-1.211.977-2.91 2.168-5.097 3.574v1.817ZM272.047 28.11h-19.863v8.613h19.863c1.406 0 2.519-.312 3.34-.937.859-.625 1.347-1.192 1.465-1.7a5.357 5.357 0 0 0 .234-1.581c-.039-2.93-1.719-4.395-5.039-4.395Zm.293 34.102c1.406 0 2.5-.352 3.281-1.055.781-.703 1.231-1.309 1.348-1.816a7.315 7.315 0 0 0 .176-1.524 6.28 6.28 0 0 0-.176-1.523c-.117-.508-.567-1.094-1.348-1.758-.781-.664-1.875-.996-3.281-.996h-20.156v8.672h20.156Z"/>
            <path fill="url(#d)" d="M357.359 90.045c-15.859-.079-27.304-2.618-34.336-7.618-6.992-5-10.214-13.222-9.668-24.668h29.532c0 4.454 4.824 6.72 14.472 6.797 4.219.079 7.344-.273 9.375-1.054 2.032-.782 3.047-1.778 3.047-2.989v-.586c0-.078-.019-.214-.058-.41a1.309 1.309 0 0 0-.176-.469c-.039-.156-.137-.331-.293-.527a1.695 1.695 0 0 0-.527-.527 7.689 7.689 0 0 0-.821-.469 4.14 4.14 0 0 0-1.113-.469c-.43-.156-.938-.293-1.523-.41a8.418 8.418 0 0 0-1.817-.293l-11.074-1.699a223.484 223.484 0 0 1-4.863-.645 271.601 271.601 0 0 1-5.157-.761 272.96 272.96 0 0 1-5.039-.88c-2.109-.429-3.789-.839-5.039-1.23-1.211-.39-2.715-.957-4.511-1.699-1.758-.742-3.145-1.543-4.161-2.402a55.405 55.405 0 0 1-3.339-3.106c-1.211-1.25-2.149-2.617-2.813-4.101-.664-1.485-1.211-3.203-1.641-5.157-.429-1.953-.644-4.101-.644-6.445 0-8.789 3.535-15.605 10.605-20.449 7.11-4.883 17.696-7.324 31.758-7.324 6.875 0 12.774.469 17.695 1.406 4.961.898 9.434 2.5 13.418 4.805 4.024 2.304 6.973 5.605 8.848 9.902 1.914 4.297 2.774 9.61 2.578 15.938h-29.297c-.859-4.454-5.507-6.68-13.945-6.68-6.719 0-10.078 1.367-10.078 4.101 0 .352.019.625.058.82.04.196.176.567.411 1.114.234.508.703.937 1.406 1.29.742.312 1.68.546 2.812.702l8.789 1.407c1.602.273 3.829.585 6.68.937 2.891.351 5.293.645 7.207.879 1.953.234 4.258.664 6.914 1.289 2.696.586 4.961 1.23 6.797 1.933 1.836.704 3.75 1.7 5.742 2.989s3.575 2.754 4.746 4.394c1.211 1.641 2.207 3.672 2.989 6.094.781 2.422 1.172 5.137 1.172 8.145 0 9.648-3.711 16.777-11.133 21.386-7.383 4.61-18.711 6.856-33.985 6.739Z"/>
            <path fill="url(#e)" d="m496.871 3.209-34.219 58.535v25.488H429.84V61.451L395.738 3.209h34.453l15 27.597h2.286L462.594 3.21h34.277Z"/>
            <path fill="url(#f)" d="M499.332 87.232V3.21h37.617l20.508 38.027h2.871V3.209h31.992v84.023h-36.679l-21.27-38.027h-3.047v38.027h-31.992Z"/>
            <path fill="url(#g)" d="M689.469 3.209v27.304h-29.414v56.72h-32.813v-56.72h-29.355V3.21h91.582Z"/>
            <path fill="url(#h)" d="M754.332 3.209h32.871v84.023h-32.871V59.048h-26.484v28.184h-32.93V3.21h32.93v28.24h26.484V3.209Z"/>
            <path stroke="#fff" strokeWidth="10" d="M15.406 87.232.816 3.21h33.399l6.094 48.808h2.812L52.38 3.21h25.547l9.258 48.808h2.812L96.09 3.21h33.398l-14.59 84.023H70.484L66.5 55.24h-2.695L59.82 87.232H15.406Zm118.887 0V3.21h78.984v26.133h-46.054v5.566h44.297V55.65h-44.297v5.508h46.054v26.074h-78.984ZM298.18 44.459c3.984 2.343 7.011 5.02 9.082 8.027 2.07 2.969 3.105 6.66 3.105 11.074 0 7.188-2.91 12.93-8.73 17.227-5.782 4.297-15.098 6.445-27.949 6.445h-54.434V3.21h56.601c6.25 0 11.602.683 16.055 2.05 4.492 1.329 7.891 3.145 10.195 5.45 2.305 2.265 3.946 4.648 4.922 7.148.977 2.5 1.465 5.235 1.465 8.203 0 3.086-.566 5.782-1.699 8.086-1.133 2.266-2.305 3.906-3.516 4.922-1.211.977-2.91 2.168-5.097 3.574v1.817ZM272.047 28.11h-19.863v8.613h19.863c1.406 0 2.519-.312 3.34-.937.859-.625 1.347-1.192 1.465-1.7a5.357 5.357 0 0 0 .234-1.581c-.039-2.93-1.719-4.395-5.039-4.395Zm.293 34.102c1.406 0 2.5-.352 3.281-1.055.781-.703 1.231-1.309 1.348-1.816a7.315 7.315 0 0 0 .176-1.524 6.28 6.28 0 0 0-.176-1.523c-.117-.508-.567-1.094-1.348-1.758-.781-.664-1.875-.996-3.281-.996h-20.156v8.672h20.156Zm85.019 27.833c-15.859-.079-27.304-2.618-34.336-7.618-6.992-5-10.214-13.222-9.668-24.668h29.532c0 4.454 4.824 6.72 14.472 6.797 4.219.079 7.344-.273 9.375-1.054 2.032-.782 3.047-1.778 3.047-2.989v-.586c0-.078-.019-.214-.058-.41a1.309 1.309 0 0 0-.176-.469c-.039-.156-.137-.331-.293-.527a1.695 1.695 0 0 0-.527-.527 7.689 7.689 0 0 0-.821-.469 4.14 4.14 0 0 0-1.113-.469c-.43-.156-.938-.293-1.523-.41a8.418 8.418 0 0 0-1.817-.293l-11.074-1.699a223.484 223.484 0 0 1-4.863-.645 271.601 271.601 0 0 1-5.157-.761 272.96 272.96 0 0 1-5.039-.88c-2.109-.429-3.789-.839-5.039-1.23-1.211-.39-2.715-.957-4.511-1.699-1.758-.742-3.145-1.543-4.161-2.402a55.405 55.405 0 0 1-3.339-3.106c-1.211-1.25-2.149-2.617-2.813-4.101-.664-1.485-1.211-3.203-1.641-5.157-.429-1.953-.644-4.101-.644-6.445 0-8.789 3.535-15.605 10.605-20.449 7.11-4.883 17.696-7.324 31.758-7.324 6.875 0 12.774.469 17.695 1.406 4.961.898 9.434 2.5 13.418 4.805 4.024 2.304 6.973 5.605 8.848 9.902 1.914 4.297 2.774 9.61 2.578 15.938h-29.297c-.859-4.454-5.507-6.68-13.945-6.68-6.719 0-10.078 1.367-10.078 4.101 0 .352.019.625.058.82.04.196.176.567.411 1.114.234.508.703.937 1.406 1.29.742.312 1.68.546 2.812.702l8.789 1.407c1.602.273 3.829.585 6.68.937 2.891.351 5.293.645 7.207.879 1.953.234 4.258.664 6.914 1.289 2.696.586 4.961 1.23 6.797 1.933 1.836.704 3.75 1.7 5.742 2.989s3.575 2.754 4.746 4.394c1.211 1.641 2.207 3.672 2.989 6.094.781 2.422 1.172 5.137 1.172 8.145 0 9.648-3.711 16.777-11.133 21.386-7.383 4.61-18.711 6.856-33.985 6.739ZM496.871 3.209l-34.219 58.535v25.488H429.84V61.451L395.738 3.209h34.453l15 27.597h2.286L462.594 3.21h34.277Zm2.461 84.023V3.21h37.617l20.508 38.027h2.871V3.209h31.992v84.023h-36.679l-21.27-38.027h-3.047v38.027h-31.992ZM689.469 3.209v27.304h-29.414v56.72h-32.813v-56.72h-29.355V3.21h91.582Zm64.863 0h32.871v84.023h-32.871V59.048h-26.484v28.184h-32.93V3.21h32.93v28.24h26.484V3.209Z" mask="url(#i)"/>
            <defs>
              <linearGradient id="a" x1="395" x2="395" y1="-3.51" y2="87.232" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00FFD1"/>
                <stop offset="0" stopColor="#fff"/>
                <stop offset=".135" stopColor="#A6AFFF"/>
                <stop offset=".443" stopColor="#fff"/>
                <stop offset=".578" stopColor="#F5B376"/>
                <stop offset="1" stopColor="#FFFA7A"/>
              </linearGradient>
              <linearGradient id="b" x1="395" x2="395" y1="-3.51" y2="87.232" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00FFD1"/>
                <stop offset="0" stopColor="#fff"/>
                <stop offset=".135" stopColor="#A6AFFF"/>
                <stop offset=".443" stopColor="#fff"/>
                <stop offset=".578" stopColor="#F5B376"/>
                <stop offset="1" stopColor="#FFFA7A"/>
              </linearGradient>
              <linearGradient id="c" x1="395" x2="395" y1="-3.51" y2="87.232" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00FFD1"/>
                <stop offset="0" stopColor="#fff"/>
                <stop offset=".135" stopColor="#A6AFFF"/>
                <stop offset=".443" stopColor="#fff"/>
                <stop offset=".578" stopColor="#F5B376"/>
                <stop offset="1" stopColor="#FFFA7A"/>
              </linearGradient>
              <linearGradient id="d" x1="395" x2="395" y1="-3.51" y2="87.232" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00FFD1"/>
                <stop offset="0" stopColor="#fff"/>
                <stop offset=".135" stopColor="#A6AFFF"/>
                <stop offset=".443" stopColor="#fff"/>
                <stop offset=".578" stopColor="#F5B376"/>
                <stop offset="1" stopColor="#FFFA7A"/>
              </linearGradient>
              <linearGradient id="e" x1="395" x2="395" y1="-3.51" y2="87.232" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00FFD1"/>
                <stop offset="0" stopColor="#fff"/>
                <stop offset=".135" stopColor="#A6AFFF"/>
                <stop offset=".443" stopColor="#fff"/>
                <stop offset=".578" stopColor="#F5B376"/>
                <stop offset="1" stopColor="#FFFA7A"/>
              </linearGradient>
              <linearGradient id="f" x1="395" x2="395" y1="-3.51" y2="87.232" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00FFD1"/>
                <stop offset="0" stopColor="#fff"/>
                <stop offset=".135" stopColor="#A6AFFF"/>
                <stop offset=".443" stopColor="#fff"/>
                <stop offset=".578" stopColor="#F5B376"/>
                <stop offset="1" stopColor="#FFFA7A"/>
              </linearGradient>
              <linearGradient id="g" x1="395" x2="395" y1="-3.51" y2="87.232" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00FFD1"/>
                <stop offset="0" stopColor="#fff"/>
                <stop offset=".135" stopColor="#A6AFFF"/>
                <stop offset=".443" stopColor="#fff"/>
                <stop offset=".578" stopColor="#F5B376"/>
                <stop offset="1" stopColor="#FFFA7A"/>
              </linearGradient>
              <linearGradient id="h" x1="395" x2="395" y1="-3.51" y2="87.232" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00FFD1"/>
                <stop offset="0" stopColor="#fff"/>
                <stop offset=".135" stopColor="#A6AFFF"/>
                <stop offset=".443" stopColor="#fff"/>
                <stop offset=".578" stopColor="#F5B376"/>
                <stop offset="1" stopColor="#FFFA7A"/>
              </linearGradient>
            </defs>
          </svg>
          <p>MIDI FM Synthesizer</p>
          <div className='title-gradient'></div>

        </div>

        <svg className='title-graphic' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 399 399">
          <path d="m199.477.286 172.347 298.515H27.129L199.477.286Z"/>
          <defs>
          </defs>
        </svg>





        {/* <h1>WebSynth</h1> */}
        <div className='landing-footer'>
          {MIDIDevicesRef.current ? 
            MIDIDevicesRef.current.map((device, i) => {
              return <p key={'device-' + i} className='label'>{device}</p>
            }) : <p className='label'>Computer Keyboard</p>
          }
          <button onClick={() => props.setSynthActive(true)}>Play Now!</button>
          
          <p className='label'>A Project by <a href='https://www.treyhardin.com' target="_blank" rel="noreferrer">Trey Hardin</a></p>
          <div className='background-grid'>
            <span className='grid-cell'></span>
            <span className='grid-cell'></span>
            <span className='grid-cell'></span>
            <span className='grid-cell'></span>
            <span className='grid-cell'></span>
            <span className='grid-cell'></span>
            <span className='grid-cell'></span>
            <span className='grid-cell'></span>
            <span className='grid-cell'></span>
            <span className='grid-cell'></span>
            <span className='grid-cell'></span>
            <span className='grid-cell'></span>
            <span className='grid-cell'></span>
            <span className='grid-cell'></span>
            <span className='grid-cell'></span>
            <span className='grid-cell'></span>
            <span className='grid-cell'></span>
            <span className='grid-cell'></span>
            <span className='grid-cell'></span>
            <span className='grid-cell'></span>
            <span className='grid-cell'></span>
            <span className='grid-cell'></span>
            <span className='grid-cell'></span>
            <span className='grid-cell'></span>
            <span className='grid-cell'></span>
            <span className='grid-cell'></span>
            <span className='grid-cell'></span>
            <span className='grid-cell'></span>
            <span className='grid-cell'></span>
            <span className='grid-cell'></span>
            <span className='grid-cell'></span>
            <span className='grid-cell'></span>
            <span className='grid-cell'></span>
            <span className='grid-cell'></span>
            <span className='grid-cell'></span>
            <span className='grid-cell'></span>
            <span className='grid-cell'></span>
            <span className='grid-cell'></span>
            <span className='grid-cell'></span>
            <span className='grid-cell'></span>
            <span className='grid-cell'></span>
            <span className='grid-cell'></span>
            <span className='grid-cell'></span>
            <span className='grid-cell'></span>
            <span className='grid-cell'></span>
            <span className='grid-cell'></span>
            <span className='grid-cell'></span>
            <span className='grid-cell'></span>
          </div>
        </div>
      </section>
    )
  }


  
}