import React, { useState } from "react";
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { VscLoading } from 'react-icons/vsc';

const GlobalStyle = createGlobalStyle`
  body {
    magin: 0;
    background-color: rgb(2, 108, 223);
    font-family: Averta, helvetica, arial, sans-serif;
    font-weight: 300;
  }
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
`

const FormWrapper = styled.div`
  background-color: white;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  margin: auto;

  h1 {
    text-align: center;
    font-size: 2.3rem;
    line-height: 1.4;
    color: #262626;
    margin: 0 0 20px;
  }

  p {
    text-align: center;

    &.error {
      color: red;
    }
    &.success {
      font-size: 20px;
    }
  }
`
const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
`

const StyledInput = styled.input`
  margin: 0px 0 10px;
  font-size: 20px;
`

const ButtonHolder = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`

const StyledButton = styled.button`
  width: 100%;
  margin-top: 10px;
  text-align: center;
  color: #fff;
  background-color: #026CDF;
  font-size: 20px;
  padding: 10px;
  cursor: pointer;
`

const SpinAni = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`

const Loader = styled(VscLoading)`
  width: 30px;
  height: 30px;
  animation: ${SpinAni} 1.7s infinite ease;
`

export default function IndexPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [ registered, setRegistered ] = useState([]);
  const [ showData, setShowData ] = useState(false);

  const onSubmit = async (event) => {
    const userData = {
      emailAddress: event.target.email.value,
      mobileNumber: event.target.tel.value
    }

    event.preventDefault()
    setSuccess(false)
    setLoading(true)
    setError(null)

    const res = await fetch('api/waiting-list', {
      body: JSON.stringify({
        emailAddress: event.target.email.value,
        mobileNumber: event.target.tel.value
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'post'
    })

    const result = await res.json()

    if (result.status === 'error') {
      setError(result.message)
    }
    if (result.status === 'success') {

      function add(arr, userData) {
        const found = arr.some(el => el.emailAddress === userData.emailAddress || el.mobileNumber === userData.mobileNumber );
        if (!found) {
          setSuccess(true)
          return setRegistered([...registered, userData]);
        } else {
          setError('Already added')
        }
      }
      add(registered, userData)
    }
    setLoading(false)

    setTimeout(() => {
      setSuccess(false)
    }, 4000)

  }
  return (
    <Wrapper>
      <GlobalStyle />
      <FormWrapper>
        <h1>Sign Up</h1>
        <StyledForm onSubmit={e => onSubmit(e)}>
          <label htmlFor='email'>Email</label>
          <StyledInput id='email' type="email" name="emailAddress" autoComplete='email' aria-label='email' required />
          <label htmlFor='tel'>Phone Number</label>
          <StyledInput id='tel' type="tel" name="mobileNumber" autoComplete='tel' aria-label='tel' required />
          <ButtonHolder>
            {loading ? 
              <Loader />
              :
              <StyledButton type='submit'>Join the waiting list</StyledButton>
            }
          </ButtonHolder>
        </StyledForm>
        <p className='error'>{error}</p>
        <p className='success'>
          {success && 'You have been added to the waiting list'}
        </p>
      </FormWrapper>
      <div>
        <button onClick={() => setShowData(!showData)}>Show Data</button>
        {showData && <pre>{JSON.stringify(registered, null, 2)}</pre>}
      </div>
    </Wrapper>
  );
}
