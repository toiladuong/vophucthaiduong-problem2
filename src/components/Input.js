import { useEffect, useMemo, useRef, useState } from "react"
import { Autocomplete, Box, InputAdornment, Stack, TextField } from "@mui/material"

function Input({ isDisabled, error, currencies, selected, initAmount, onChangeAmount, isFrom, onChangeCurrency }) {
    const [inputError, setInputError] = useState(null)
    const [inputValue, setInputValue] = useState(initAmount)

    const debounceRef = useRef(null)

    useEffect(() => {
        setInputValue(initAmount)
    }, [initAmount])

    useEffect(() => {
        setInputError(error)
    }, [JSON.stringify(error)])

    const options = useMemo(() => {
        const arrayWithoutDuplicate = currencies?.filter((value, index, originalArr) =>
            index === originalArr.findIndex((t) => (
                t.currency === value.currency
            )))
        return arrayWithoutDuplicate
    }, [JSON.stringify(currencies)])

    const getTokenIconPath = (currency) => {
        try {
            return require(`../assets/tokens/${currency}.svg`)
        } catch (err) {
            console.log(err)
        }
    }

    const handleChangeAmountDebounce = (value) => {
        if (debounceRef.current) clearTimeout(debounceRef.current)

        let amount = parseFloat(value || 0)
        if (amount < 0) {
            setInputError({ message: 'Invalid input' })
            return
        } else setInputError(null)
        setInputValue(amount.toString())

        debounceRef.current = setTimeout(() => {
            onChangeAmount(amount)
        }, 500)
    }
    return (
        <Stack
            direction={{ xs: 'column-reverse', sm: 'column-reverse', md: 'row', lg: 'row' }}
            sx={{
                height: { xs: '180px', sm: '200px', md: '220px', lg: '230px' },
                borderRadius: '12px',
                alignItems: {
                    xs: 'flex-start', sm: 'flex-start', md: 'center', lg: 'center'
                },
                justifyContent: 'center'
            }}
            className="input_wrapper">
            <div className="priceInput_wrapper">
                <TextField
                    disabled={isDisabled}
                    error={!!inputError}
                    helperText={inputError?.message}
                    id="standard-basic"
                    label={isFrom ? 'You want to swap' : 'You will get'}
                    value={inputValue}
                    onChange={(e) => handleChangeAmountDebounce(e.target.value)}
                    type="number"
                    variant="standard" />
            </div>
            {!options?.length ? 'loading ' :
                <Autocomplete
                    disabled={isDisabled}
                    disablePortal
                    disableClearable
                    value={selected}
                    isOptionEqualToValue={(option, value) => option.currency === value.currency}
                    onChange={(e, newValue) => onChangeCurrency(newValue)}
                    id="combo-box-demo"
                    options={options}
                    sx={{
                        width: 160,
                        margin: {
                            xs: '0 0 10px 0', sm: '0 0 10px 0', md: '0 0 0 10px', lg: '0 0 0 10px'
                        }
                    }}
                    renderInput={(params) =>
                        <TextField
                            {...params}
                            InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <img
                                            loading="lazy"
                                            width="20"
                                            src={getTokenIconPath(selected.currency)}
                                            alt="currency icon"
                                        />
                                    </InputAdornment>)
                            }}

                            label="Currency" />
                    }
                    getOptionLabel={(option) => option.currency}
                    renderOption={(props, option) => (
                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                            <img
                                loading="lazy"
                                width="20"
                                src={getTokenIconPath(option.currency)}
                                alt="currency icon"
                            />
                            {option.currency}
                        </Box>
                    )} />}
        </Stack>
    )
}

export default Input