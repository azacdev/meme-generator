import { useState } from 'react';
import { useEffect } from 'react';
import IMG from './assets/images/Troll Face.png'
import './App.css'

const App = () => {
  const [meme, setMeme] = useState({
    topText: "",
    bottomText: "",
    randomImage: ""
  })

  const [allMeme, setAllMeme] =  useState([])
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const handleShowSuggestions = () => {
    setShowSuggestions(prevValue => !prevValue);
  };

  useEffect(()=> {
    fetch("https://api.imgflip.com/get_memes")
    .then(res => res.json())
    .then(data => setAllMeme(data.data.memes))
    .catch(error => console.log(error));
  }, [])
  
  const filteredMemes = allMeme.filter(meme => meme.name.toLowerCase().startsWith(searchInput.toLowerCase()));
  
  function getMemeImage(){
    const randomNumber = Math.floor(Math.random() * allMeme.length)
    const url = allMeme[randomNumber].url
    setMeme(prevMeme => ({
      ...prevMeme,
      randomImage: url})
    )
    setSearchInput("")
  }
  
  function handleChange(e) {
    const {name, value} = e.target
    setMeme(prevMeme => {
      return {
        ...prevMeme,
        [name] : value
      }
    })
  }

  return (
    <div className="App">
      <header>
        <h1>Meme Generator</h1>
        <img src={IMG} alt="troll-face"/>
      </header>
      <main >
        <section>
          <div className='form'>
            <input type="text" placeholder='Top text' className='form--input' name='topText' value={meme.topText} onChange={handleChange}/>
            <input type="text" placeholder='Bottom text' className='form--input' name='bottomText' value={meme.bottomText} onChange={handleChange}/>
          </div>

          <div className='meme'>
            {searchInput ? (
              <div>
                {filteredMemes.map(meme => (
                <img key={meme.id} src={meme.url} alt={meme.name} className='meme-image' /> 
                ))}
              </div>
            ) : <img src={meme.randomImage} className='meme-image'/> }
            
            <h2 className='meme--text top'>{meme.topText}</h2>
            <h2 className='meme--text bottom'>{meme.bottomText}</h2>
            
          </div>
                                                              
          <div className='button'>
            {showSuggestions && (
              <div>
                <h3 className='suggestion_header'>Suggestions</h3>

                <div className='suggestions__btn'>
                  <ul className='suggestion__list'>
                    {allMeme.map(meme => 
                      <li key={meme.id} onClick={() => setSearchInput(meme.name.toLowerCase())}>
                        <img src={meme.url} className="suggestions__image" title='Click To Add'/>
                        <p>{meme.name}</p>
                      </li> 
                    )}
                  </ul>
                </div>
              </div>
            )}
            <input type="text" value={searchInput} onChange={e => setSearchInput(e.target.value)} placeholder="Search Memes" className='search-memes' />

            <button onClick={handleShowSuggestions} className="suggestions__btn">
              {showSuggestions ? 
              "Hide Suggestuions" : 
              "Show Suggestions"}
            </button>

            <button className='btn' onClick={getMemeImage} >Get a random image 📷</button>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
