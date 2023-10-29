import { useEffect, useRef, useState } from "react"
import axios from 'axios'

import Input from "./Input"

import { Alert, Box, Button, Snackbar, Stack, Typography } from "@mui/material"
import SwapHorizontalCircleRoundedIcon from '@mui/icons-material/SwapHorizontalCircleRounded'
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined'
import PriceChart from "./PriceChart"

function SwapForm() {
    const [currencyOptions, setCurrencyOptions] = useState([])
    const [fromCurrency, setFromCurrency] = useState(null)
    const [toCurrency, setToCurrency] = useState(null)
    const [amountFrom, setAmountFrom] = useState(0)
    const [amountTo, setAmountTo] = useState(0)
    const [error, setError] = useState(null)

    const [isHover, setIsHover] = useState(false)
    const [showToast, setShowToast] = useState(false)
    const [isConverting, setIsConverting] = useState(false)

    const leftCardRef = useRef(null)
    const rightCardRef = useRef(null)
    const timeoutRef = useRef(null)

    useEffect(() => {
        axios.get('https://interview.switcheo.com/prices.json')
            .then(res => {
                setCurrencyOptions(res.data)
                setFromCurrency(res.data[0])
                setToCurrency(res.data[4])
            })

            .catch(err => { throw Error(`${err}`) })

    }, [])

    useEffect(() => {
        if (amountFrom === 0) {
            setAmountTo(0)
            return
        }

        let newAmount = amountFrom * fromCurrency?.price / toCurrency?.price
        setAmountTo(newAmount.toFixed(newAmount.toFixed(8) > Math.floor(newAmount) ? 8 : 0))
    }, [fromCurrency?.currency])

    useEffect(() => {
        if (amountTo === 0) {
            setAmountFrom(0)
            return
        }

        let newAmount = amountTo * toCurrency?.price / fromCurrency?.price
        setAmountFrom(newAmount.toFixed(newAmount.toFixed(8) > Math.floor(newAmount) ? 8 : 0))
    }, [toCurrency?.currency])


    const handleChangeFromCurrency = (currency) => {
        setFromCurrency(currency)
    }

    const handleChangeToCurrency = (currency) => {
        setToCurrency(currency)
    }

    const handleChangeAmountFrom = (amount) => {
        if (amount < 0) {
            return
        }
        setError(null)
        setAmountFrom(amount)
        if (!toCurrency || !fromCurrency) return
        setAmountTo((amount * fromCurrency.price / toCurrency.price).toFixed(amount === 0 ? 0 : 8))
    }

    const handleChangeAmountTo = (amount) => {
        if (amount < 0) {
            return
        }
        setError(null)
        setAmountTo(amount)

        if (!toCurrency || !fromCurrency) return
        setAmountFrom((amount * toCurrency.price / fromCurrency.price).toFixed(amount === 0 ? 0 : 8))
    }

    const handleSwapSide = () => {
        leftCardRef.current.classList.add('firstCardSwap')
        rightCardRef.current.classList.add('secondCardSwap')
        let amountFromState = { token: fromCurrency, amount: amountFrom }
        let amountToState = { token: toCurrency, amount: amountTo }
        timeoutRef.current = setTimeout(() => {
            setAmountFrom(amountToState.amount)
            setAmountTo(amountFromState.amount)
            setFromCurrency(amountToState.token)
            setToCurrency(amountFromState.token)
            leftCardRef.current.classList.remove('firstCardSwap')
            rightCardRef.current.classList.remove('secondCardSwap')
            clearTimeout(timeoutRef.current)
        }, 900)
    }

    const handleSwapBtn = (isHover) => {
        setIsHover(isHover)
    }

    const handleCloseToast = () => {
        setShowToast(false)
    }

    const handleConvertCurrency = () => {
        if (amountFrom === 0) {
            setError({ message: 'Please enter!', slot: 'amountFrom' })
            return
        }
        setError(null)
        setIsConverting(true)
        const timeout = setTimeout(() => {
            setShowToast(true)
            setIsConverting(false)
            setAmountFrom(0)
            setAmountTo(0)
            clearTimeout(timeout)
        }, 3000)
    }

    return (
        <Box>
            <Box sx={{
                marginBottom: '26px',
                padding: { xs: '18px 12px', sm: '18px 12px', md: '38px 26px', lg: '46px 28px' },
                width: {
                    xs: '90vw', sm: '90vw', md: '85vw', lg: '70vw'
                },
                height: 'fit-content',
                borderRadius: '12px'
            }} className="form_wrapper">
                <Box sx={{ width: '100%', textAlign: 'center', marginBottom: '10px' }}>
                    {!fromCurrency || !toCurrency ? 'Loading' :
                        <Typography sx={{ color: '#f5a623', fontSize: '18px' }}>
                            1 {fromCurrency?.currency} = {`${(fromCurrency?.price / toCurrency?.price).toFixed(8)}`} {toCurrency?.currency}
                        </Typography>}
                </Box>
                <Stack direction={{ xs: 'column', sm: 'column', md: 'row', lg: 'row' }} sx={{
                    alignItems: 'center',
                    justifyContent: 'space-around',
                }} >
                    <div ref={leftCardRef}>
                        <Input
                            isDisabled={isConverting}
                            error={error}
                            currencies={currencyOptions}
                            selected={fromCurrency}
                            isFrom
                            initAmount={amountFrom.toString()}
                            onChangeAmount={handleChangeAmountFrom}
                            onChangeCurrency={handleChangeFromCurrency} />
                    </div>
                    <Box
                        sx={{
                            cursor: 'pointer',
                            borderRadius: '50%',
                            width: '50px !important',
                            height: '50px !important',
                            display: "flex",
                            justifyContent: 'center',
                            transform: { xs: 'rotate(90deg)', sm: 'rotate(90deg)', md: 'rotate(0deg)' }
                        }}
                        onClick={handleSwapSide}
                        onMouseEnter={() => handleSwapBtn(true)}
                        onMouseLeave={() => handleSwapBtn(false)}>
                        {!isHover ? <ArrowCircleRightOutlinedIcon className='swap' sx={{
                            fontSize: { xs: '40px', sm: '42px', md: '52px', lg: '56px' },
                            color: "#f5a623",
                            background: '#30185b',
                            position: 'absolute',
                            borderRadius: '50%'
                        }} /> :
                            <SwapHorizontalCircleRoundedIcon sx={{
                                fontSize: { xs: '40px', sm: '42px', md: '52px', lg: '56px' },
                                color: "#f5a623",
                                background: '#30185b',
                                position: 'absolute',
                                borderRadius: '50%'
                            }} />}
                    </Box>
                    <div ref={rightCardRef}>
                        <Input
                            isDisabled={isConverting}
                            error={error}
                            currencies={currencyOptions}
                            selected={toCurrency}
                            initAmount={amountTo.toString()}
                            onChangeAmount={handleChangeAmountTo}
                            onChangeCurrency={handleChangeToCurrency} />
                    </div>
                </Stack>
                <Box sx={{ marginTop: '26px', width: '100%', display: "flex", justifyContent: 'center' }}>
                    {!isConverting ? <Button
                        variant="contained"
                        size="large"
                        sx={{
                            fontSize: '22px',
                            backgroundColor: '#f5a623 !important',
                            minWidth: '200px',
                            color: '#30185b',
                            fontWeight: '700',
                            padding: '6px 22px',
                            ':hover': {
                                background: 'linear-gradient(94deg,#a93eff,#5e40de 51%,#00b3ff)',
                                color: '#f5a623'
                            }
                        }} onClick={handleConvertCurrency}>
                        Trade
                    </Button> : <Button
                        disabled
                        variant="contained"
                        size="large"
                        sx={{
                            fontSize: '22px',
                            backgroundColor: '#30185b !important',
                            minWidth: '200px',
                            color: '#30185b',
                            fontWeight: '700',
                            padding: '6px 22px',
                            ':hover': {
                                background: 'linear-gradient(94deg,#a93eff,#5e40de 51%,#00b3ff)',
                                color: '#f5a623'
                            }
                        }}>
                        <div className="converter"></div>
                    </Button>}
                </Box>
            </Box>
            <PriceChart from={fromCurrency} to={toCurrency} />
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={showToast} autoHideDuration={5000} onClose={handleCloseToast}>
                <Alert onClose={handleCloseToast} severity="success" sx={{ width: '100%' }}>
                    Trade successfully!
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default SwapForm