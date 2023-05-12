import React, { useRef } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardTitle,
  CCardText,
  CButton,
  CFormLabel,
  CFormInput,
} from '@coreui/react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Investors = () => {
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  const [Investor, setInvestor] = useState({
    name: '',
    email: '',
  })

  const handleChange = ({ currentTarget: input }) => {
    setInvestor({ ...Investor, [input.name]: input.value })
  }

  useEffect(() => {
    if (!token) {
      navigate('/')
    }
  }, [navigate, token])

  // useEffect(() => {
  //   fetchNewInvestor()
  // }, [])

  async function fetchNewInvestor(e) {
    e.preventDefault()
    try {
      const url = `${process.env.REACT_APP_API_URL}/api/admin/investor/new`
      const token = localStorage.getItem('token')
      if (!token) return

      const options = {
        headers: {
          Authorization: token,
        },
      }
      const res = await axios.post(url, Investor, options)
      toast.success('Successfully Created!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      })

      setInvestor(res.data)
    } catch (error) {
      toast.success('Oops! an error occurred!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      })
      console.error(error)
    }
  }

  return (
    <div style={{ marginLeft: '30%' }}>
      <ToastContainer />
      <CCard style={{ maxWidth: '27rem' }} className="">
        <CCardHeader>New Investor</CCardHeader>
        <CCardBody className="p-5">
          <form onSubmit={fetchNewInvestor}>
            <div className="mb-3">
              <CFormLabel className="text-left">Name</CFormLabel>
              <CFormInput
                type="text"
                name="name"
                value={Investor.name}
                onChange={handleChange}
                placeholder="Name"
              />
            </div>
            <div className="mb-3">
              <CFormLabel>Email address</CFormLabel>
              <CFormInput
                type="text"
                name="email"
                onChange={handleChange}
                placeholder="Example@hotmail.com"
                value={Investor.email}
              />
            </div>
            <CButton type="submit">Submit</CButton>
          </form>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default Investors
