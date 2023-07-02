import { useState, useReducer, useEffect } from 'react'
import axios from 'axios';
import Div from './Div';

const initialState = {
  error: null,
  greeting: null,
}

function greetingReducer(state: any, action: any) {
  switch (action.type) {
    case 'SUCCESS': {
      return {
        error: null,
        greeting: action.greeting,
      }
    }
    case 'ERROR': {
      return {
        error: action.error,
        greeting: null,
      }
    }
    default: {
      return state
    }
  }
}

export default function App({ url }: { url: string }) {
  const [{ error, greeting }, dispatch] = useReducer(
    greetingReducer,
    initialState,
  )

  /**
   * 为了覆盖而写代码没必要哈
   */
  useEffect(() => {
    dispatch('default');
  }, []);

  const [buttonClicked, setButtonClicked] = useState(false)

  const fetchGreeting = async (url: string) =>
    axios.get(url)
      .then(response => {
        const { data } = response
        const { greeting } = data;
        dispatch({ type: 'SUCCESS', greeting })
        setButtonClicked(true)
      })
      .catch(error => {
        dispatch({ type: 'ERROR', error })
      })

  const buttonText = buttonClicked ? 'Ok' : 'Load Greeting'

  return (
    <Div>
      <button onClick={() => fetchGreeting(url)} disabled={buttonClicked}>
        {buttonText}
      </button>
      {greeting && <h1>{greeting}</h1>}
      {error && <p role="alert">Oops, failed to fetch!</p>}
    </Div>
  )
}