import { toJpeg, toPng } from 'html-to-image'
import { useCallback, useEffect, useRef, useState } from 'react'
import translate from 'translate'

export const Sections = () => {
  const nameRef = useRef(null)
  const stampRef = useRef(null)
  const [nameText, setNameText] = useState('')
  const [stampText, setStampText] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const stampStyleArr = [
    'stamp-style-red-text-white-bg',
    'stamp-style-white-text-red-bg',
    'stamp-style-red-text-white-bg-circle',
    'stamp-style-white-text-red-bg-circle',
  ]

  const mainStampFontSizeArr = ['28rem', '15rem', '10rem']
  const optionsSquareStampFontSizeArr = ['6.3rem', '3.2rem', '2.2rem']
  const optionsCircleStampFontSizeArr = ['5.3rem', '2.8rem', '1.8rem']

  // Get translator api
  translate.engine = 'deepl'
  translate.key = 'cc4fe8e2-b262-427c-b656-da337634f593:fx' // Free only if 500,000 character request per month

  // Manage input
  const onChange = (e) => {
    setNameText(e.target.value)
  }

  const handleSubmitClick = () => {
    // if (!/^[a-zA-Z\s]+$/.test(nameText)) return

    // alphabet letters only
    const fetchData = async () => {
      // requst translate through api
      const text = await translate(`name"${nameText}"`, 'ko') // sending string looks like: name"sohyun"
      // extract only name
      const matches = text.match(/"([^"]*)"/)
      const extractedName = matches ? matches[1].replace(/\s/g, '') : null
      // check name result
      checkNameLength(extractedName)
    }
    fetchData()
  }

  // Manage results
  const handleSelectClick = (_index) => {
    console.log('clicked', _index)
    setSelectedIndex(_index)
  }

  // Reset name
  const onReset = (e) => {
    setNameText('')
    setStampText('')
  }

  // Download image
  const htmlToImageConvert = useCallback(() => {
    if (stampRef.current === null && nameRef.current === null) {
      return
    }

    toPng(stampRef.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement('a')
        link.download = 'my-stamp.png'
        link.href = dataUrl
        link.click()
      })
      .catch((err) => {
        console.log(err)
      })
  }, [stampRef])

  // Utils
  const checkNameLength = (_text) => {
    if (/^[a-zA-Z]+$/.test(_text)) {
      alert('Oops! Falied to translate into Korean name..')
      return
    }

    // max length
    if (_text.length > 9) {
      alert('Oops! Ouput Korean was more than 9 characters')
      onReset()
    }
    // set main stamp font size
    if (_text.length == 1) {
      setMainSquareFontSize('28rem')
      setMainCircleFontSize('22rem')
    } else if (_text.length >= 3 && _text.length <= 4) {
      setMainSquareFontSize('15rem')
      setMainCircleFontSize('11.5rem')
    } else if (_text.length > 4) {
      setMainSquareFontSize('10rem')
    }

    // set text
    setStampText(_text)
  }

  return (
    <div className='sections'>
      <section className='editor-section'>
        <p>Name</p>
        <input
          ref={nameRef}
          type='text'
          placeholder='Type your name...'
          value={nameText}
          onChange={onChange}
        />
        <button onClick={handleSubmitClick}>Submit</button>
      </section>
      <section className='result-section'>
        <div ref={stampRef} className='stamps'>
          {/* <img className='stamp-texture' src='/images/stamp-texture.png'></img> */}
          <div className={`overlay ${stampStyleArr[selectedIndex]}`}>
            <p
              id='result-text'
              style={{
                fontSize:
                  stampText.length == 1
                    ? mainStampFontSizeArr[0]
                    : stampText.length >= 2 && stampText.length <= 4
                    ? mainStampFontSizeArr[1]
                    : mainStampFontSizeArr[2],
              }}
            >
              {stampText}
            </p>
          </div>
        </div>
        <div className='options-container'>
          {stampStyleArr.map((className, index) => (
            <div
              key={index}
              className={className}
              onClick={() => handleSelectClick(index)}
            >
              <p
                id={`result-text-${index}`}
                style={{
                  fontSize:
                    stampText.length === 1 && index <= 1
                      ? optionsSquareStampFontSizeArr[0]
                      : stampText.length >= 2 && stampText.length <= 4 && index <= 1
                      ? optionsSquareStampFontSizeArr[1]
                      : index <= 1
                      ? optionsSquareStampFontSizeArr[2]
                      : stampText.length === 1 && index > 1
                      ? optionsCircleStampFontSizeArr[0]
                      : stampText.length >= 2 && stampText.length <= 4 && index > 1
                      ? optionsCircleStampFontSizeArr[1]
                      : optionsCircleStampFontSizeArr[2],
                }}
              >
                {stampText}
              </p>
            </div>
          ))}
        </div>
        <div className='buttons-container'>
          <button onClick={onReset}>Reset</button>
          <button onClick={htmlToImageConvert}>Download</button>
        </div>
      </section>
    </div>
  )
}
