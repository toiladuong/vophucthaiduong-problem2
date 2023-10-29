import { Box, Typography } from "@mui/material"
import SwapForm from "../components/SwapForm"
import { useRef, useEffect } from "react"
const words = ['easily', 'securely', 'instantly']
function MainPage() {
    const writterRef = useRef(null)
    const timeoutRef = useRef(null)

    const sleepTime = (time) => {
        return new Promise((resolve) => {
            timeoutRef.current = setTimeout(() => {
                resolve(true)
                clearTimeout(timeoutRef.current)
            }, time)
        })
    }
    useEffect(() => {
        if (writterRef.current) {
            const createWritterLoop = async () => {
                let index = 0
                // eslint-disable-next-line no-constant-condition
                while (true) {
                    let word = words[index]
                    for (let i = 0; i <= word.length; i++) {
                        writterRef.current.innerText = word.substring(0, i)
                        await sleepTime(150)
                    }
                    await sleepTime(1000)
                    for (let i = word.length; i >= 0; i--) {
                        writterRef.current.innerText = word.substring(0, i)
                        await sleepTime(50)
                    }
                    await sleepTime(150)

                    if (index === words.length - 1) {
                        index = 0
                    } else {
                        index++
                    }
                }
            }

            createWritterLoop()
        }
    }, [writterRef])

    return (
        <div className="main_page">
            <Box sx={{
                width: '100vw',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                zIndex: '9'
            }}>
                <Typography
                    variant='span'
                    sx={{
                        fontSize: { xs: '28px', sm: '42px', lg: '52px' },
                        fontWeight: '900',
                        color: '#f5a623',
                    }}
                >
                    Exchange any crypto <br />
                </Typography>
                <Box sx={{ minHeight: '60px' }}>
                    <Typography
                        variant='span'
                        sx={{
                            fontSize: { xs: '28px', sm: '42px', lg: '52px' },
                            lineHeight: { xs: '28px', sm: '42px', lg: '52px' },
                            fontWeight: '900',
                        }}
                        className="writter"
                        ref={writterRef}
                    ></Typography>
                </Box>
            </Box>
            <SwapForm />
            <Box sx={{ position: 'absolute', zIndex: '-1', top: { xs: '20%', sm: '20%', md: '25%', lg: '25%' }, left: { xs: '50%', sm: '50%', md: '12%', lg: '12%' }, transform: 'translate(-50%, -50%)' }}>
                <div className="pyramid-loader">
                    <div className="wrapper">
                        <span className="side side1"></span>
                        <span className="side side2"></span>
                        <span className="side side3"></span>
                        <span className="side side4"></span>
                        <span className="shadow"></span>
                    </div>
                </div>
            </Box>
        </div>)
}

export default MainPage