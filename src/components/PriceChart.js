import { useMemo } from 'react'
import ReactApexCharts from 'react-apexcharts'

function PriceChart({ from, to }) {
    const getMockData = (originalPrice) => {
        if (!originalPrice) return
        let dataArr = []
        for (let i = 0; i <= 49; i++) {
            dataArr.push(Math.max(Math.random(), Math.max(Math.random(), 0.5)) * originalPrice)
        }
        dataArr.push(originalPrice)

        return dataArr
    }
    const fromCurrencyData = useMemo(() => {
        if (!from) return
        return getMockData(from.price)
    }, [from?.price])
    const toCurrencyData = useMemo(() => {
        if (!to) return

        return getMockData(to.price)
    }, [to?.price])

    return (
        <ReactApexCharts
            options={{
                chart: {
                    type: 'area',
                    stacked: false,
                    height: 350,
                    zoom: {
                        type: 'x',
                        enabled: true,
                        autoScaleYaxis: true
                    },
                    toolbar: {
                        autoSelected: 'zoom'
                    }
                },
                title: {
                    text: `Market Price: ${from?.currency} and ${to?.currency}`,
                    align: 'left',
                    style: {
                        color: '#f5a623'
                    }
                },
                yaxis: {
                    show: false
                },
                xaxis: {
                    labels: {
                        style: {
                            colors: 'white'
                        }
                    }
                },
                legend: {
                    labels: {
                        colors: 'white'
                    }
                }

            }}
            width='100%'
            height={500}
            series={[
                {
                    data: fromCurrencyData,
                    name: `${from?.currency}`,
                    color: '#f5a623'
                },
                {
                    data: toCurrencyData,
                    name: `${to?.currency}`,
                    color: '#6a29d2'

                },
            ]}
        />)
}

export default PriceChart