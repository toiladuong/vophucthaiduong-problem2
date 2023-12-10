import { useEffect, useRef, useState } from "react"
import { Alert, Box, Button, Snackbar, Stack, Typography } from "@mui/material"
import SwapHorizontalCircleRoundedIcon from '@mui/icons-material/SwapHorizontalCircleRounded'
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined'
import axios from 'axios'

import Input from "./Input"
import PriceChart from "./PriceChart"


function SwapForm() {
    const [error, setError] = useState(null)
    const [currencyOptions, setCurrencyOptions] = useState([])
    const [choosenCurrencies, setChoosenCurrencies] = useState({
        fromCurrency: null,
        toCurrency: null
    })
    const [selectedAmount, setSelectedAmount] = useState({
        fromAmount: 0,
        toAmount: 0
    })

    const [isHover, setIsHover] = useState(false)
    const [isSwapped, setIsSwapped] = useState(false)
    const [showToast, setShowToast] = useState(false)
    const [isConverting, setIsConverting] = useState(false)

    const leftCardRef = useRef(null)
    const rightCardRef = useRef(null)
    const timeoutRef = useRef(null)

    //we can also create useCurrency hook if it can re-use in other places
    useEffect(() => {
        axios.get('https://interview.switcheo.com/prices.json')
            .then(res => {
                setCurrencyOptions(res.data)
                setChoosenCurrencies({
                    fromCurrency: res.data[0],
                    toCurrency: res.data[4]
                })
            })

            .catch(err => { throw Error(`${err}`) })

    }, [])

    useEffect(() => {
        isSwapped ? setIsSwapped(false) : handleChangeAmount('fromAmount')(selectedAmount.fromAmount)
    }, [choosenCurrencies.fromCurrency?.currency])

    useEffect(() => {
        isSwapped ? setIsSwapped(false) : handleChangeAmount('toAmount')(selectedAmount.toAmount)
    }, [choosenCurrencies.toCurrency?.currency])

    //currying function
    const handleChangeChoosenCurrencies = (currencyKey) => (currencyData) => {
        setChoosenCurrencies(prev => ({
            ...prev,
            [currencyKey]: currencyData
        }))
    }

    const handleChangeAmount = (amountKey) => (amount) => {
        if (amount < 0) {
            return
        }
        setError(null)
        if (!choosenCurrencies.toCurrency || !choosenCurrencies.fromCurrency) return
        if (amountKey === 'fromAmount') {
            setSelectedAmount(({
                [amountKey]: amount,
                toAmount: parseFloat((amount * choosenCurrencies.fromCurrency.price / choosenCurrencies.toCurrency.price).toFixed(amount === 0 ? 0 : 8)),
            }))
        } else {
            setSelectedAmount(({
                fromAmount: parseFloat((amount * choosenCurrencies.toCurrency.price / choosenCurrencies.fromCurrency.price).toFixed(amount === 0 ? 0 : 8)),
                [amountKey]: amount
            }))
        }
    }

    const handleSwapSide = () => {
        setIsSwapped(true)
        leftCardRef.current.classList.add('firstCardSwap')
        rightCardRef.current.classList.add('secondCardSwap')
        timeoutRef.current = setTimeout(() => {
            setSelectedAmount(prev => ({
                fromAmount: prev.toAmount,
                toAmount: prev.fromAmount
            }))
            setChoosenCurrencies(prev => ({
                fromCurrency: prev.toCurrency,
                toCurrency: prev.fromCurrency
            }))
            leftCardRef.current.classList.remove('firstCardSwap')
            rightCardRef.current.classList.remove('secondCardSwap')
            clearTimeout(timeoutRef.current)
        }, 900)
    }

    const handleConvertCurrency = () => {
        if (selectedAmount.fromAmount === 0) {
            setError({ message: 'Please enter!', slot: 'amountFrom' })
            return
        }
        setError(null)
        setIsConverting(true)
        const timeout = setTimeout(() => {
            setShowToast(true)
            setSelectedAmount({
                fromAmount: 0,
                toAmount: 0
            })
            setIsConverting(false)
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
                    {!choosenCurrencies.fromCurrency || !choosenCurrencies.toCurrency ? 'Loading' :
                        <Typography sx={{ color: '#f5a623', fontSize: '18px' }}>
                            1 {choosenCurrencies.fromCurrency?.currency} = {`${(choosenCurrencies.fromCurrency?.price / choosenCurrencies.toCurrency?.price).toFixed(8)}`} {choosenCurrencies.toCurrency?.currency}
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
                            selected={choosenCurrencies.fromCurrency}
                            isFrom
                            initAmount={selectedAmount.fromAmount}
                            onChangeAmount={handleChangeAmount('fromAmount')}
                            onChangeCurrency={handleChangeChoosenCurrencies('fromCurrency')} />
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
                        onMouseEnter={() => setIsHover(true)}
                        onMouseLeave={() => setIsHover(false)}>
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
                            selected={choosenCurrencies.toCurrency}
                            initAmount={selectedAmount.toAmount}
                            onChangeAmount={handleChangeAmount('toAmount')}
                            onChangeCurrency={handleChangeChoosenCurrencies('toCurrency')} />
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
            <PriceChart from={choosenCurrencies.fromCurrency} to={choosenCurrencies.toCurrency} />
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={showToast} autoHideDuration={5000} onClose={() => setShowToast(false)}>
                <Alert onClose={() => setShowToast(false)} severity="success" sx={{ width: '100%' }}>
                    Trade successfully!
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default SwapForm