const moment = require('moment');
const svgToImg = require("svg-to-img");
const echarts = require('echarts');
import { TokenOHLCV, SimpleCandle } from '../types/customTypes';
import { timestampToMMDDHHMM } from './../utils/dataUtils';
import fs from 'fs/promises';
import path from 'path';

function getYVals(candles: SimpleCandle[]): [number[][], number, number] {
    let toRet: number[][] = [];
    let minVal = Number.MAX_SAFE_INTEGER;
    let maxVal = 0;
    candles.forEach(candle => {
        let val: number[] = [
            candle.close,
            candle.open,
            candle.low,
            candle.high
        ];

        if (maxVal < candle.high) {
            maxVal = candle.high;
        }

        if (minVal > candle.low) {
            minVal = candle.low;
        }

        toRet.push(val);
    });

    return [toRet, Number(minVal), Number(maxVal)];
}

function getXVals(candles: SimpleCandle[]): string[] {
    let toRet: string[] = []
    candles.forEach(candle => {
        toRet.push(timestampToMMDDHHMM(candle.unixTime));
    });

    return toRet;
}

export function genChart(data: TokenOHLCV, path: string) {

    console.log(path);

    let candles: SimpleCandle[] = data.candles;

    let xVals = getXVals(candles);
    let [yVals, maxy, miny] = getYVals(candles);

    let offset = maxy - miny;

    console.log(maxy, miny, offset);

    // close, open, min, max
    //xVals.pop();


    const chart = echarts.init(null, null, {
        renderer: 'svg', // must use SVG rendering mode
        ssr: true, // enable SSR
        width: 400, // need to specify height and width
        height: 300
    });

    // use setOption as normal
    chart.setOption({
        xAxis: {
            data: xVals,
        },
        yAxis: {
            min: miny - offset * 0.2,
            max: maxy + offset * 0.2,
            boundaryGap: false,
            axisLabel: {
                formatter: function (value: number) {
                    // Se il valore è inferiore a 0.001, visualizzalo in notazione scientifica
                    if (Math.abs(value) < 0.001) {
                        return value.toExponential(2); // Notazione scientifica con 2 decimali
                    } else {
                        return value.toFixed(3); // Altrimenti, visualizzalo con 2 decimali
                    }
                }
            }
        },
        series: [
            {
                type: 'candlestick',
                data: yVals
            }
        ],
        backgroundColor: '#000',
        textStyle: {
            color: '#fff'
        }
    });

    // Output a string
    const svgStr = chart.renderToSVGString();

    // If chart is no longer useful, consider dispose it to release memory.

    (async () => {
        const image = await svgToImg.from(svgStr).toPng({
            encoding: "base64",
            path: path
        });
    })();

    chart.dispose();

}


export async function deleteFilesInDirectory(directoryPath: string): Promise<void> {
    try {
        // Ottieni un elenco dei file nella cartella
        const files = await fs.readdir(directoryPath);

        // Elimina ciascun file nella cartella
        for (const file of files) {
            const filePath = path.join(directoryPath, file);

            // Verifica se è un file
            const stats = await fs.stat(filePath);
            if (stats.isFile()) {
                // Elimina il file
                await fs.unlink(filePath);
                console.log('File eliminato con successo:', filePath);
            }
        }
    } catch (err) {
        console.error('Si è verificato un errore:', err);
    }
}


let testData: TokenOHLCV = {
    address: '6145HDdn9NZ5bgMnzeeUb4jCqmBD5LCKpSBisYZLvp1e',
    type: '2H',
    candles: [
        {
            open: 0.0000383183,
            high: 0.0000383182950,
            low: 0.0000383183,
            close: 0.0000383183,
            volume: 0.00000000000000000000,
            unixTime: 1708848000
        },
        {
            open: 0.0000383183,
            high: 0.0000383182950,
            low: 0.0000383183,
            close: 0.0000383183,
            volume: 0.00000000000000000000,
            unixTime: 1708855200
        },
        {
            open: 0.0000383183,
            high: 0.0000383182950,
            low: 0.0000383183,
            close: 0.0000383183,
            volume: 0.00000000000000000000,
            unixTime: 1708862400
        },
        {
            open: 0.0000383183,
            high: 0.0000383182950,
            low: 0.0000383183,
            close: 0.0000383183,
            volume: 0.00000000000000000000,
            unixTime: 1708869600
        },
        {
            open: 0.0000383183,
            high: 0.0000383182950,
            low: 0.0000383183,
            close: 0.0000383183,
            volume: 0.00000000000000000000,
            unixTime: 1708876800
        },
        {
            open: 0.0000383183,
            high: 0.0000383182950,
            low: 0.0000383183,
            close: 0.0000383183,
            volume: 0.00000000000000000000,
            unixTime: 1708884000
        },
        {
            open: 0.0000383183,
            high: 0.0000383182950,
            low: 0.0000383183,
            close: 0.0000383183,
            volume: 0.00000000000000000000,
            unixTime: 1708891200
        },
        {
            open: 0.0000383183,
            high: 0.0000383182950,
            low: 0.0000383183,
            close: 0.0000383183,
            volume: 0.00000000000000000000,
            unixTime: 1708898400
        },
        {
            open: 0.0000383183,
            high: 0.0000383182950,
            low: 0.0000383183,
            close: 0.0000383183,
            volume: 0.00000000000000000000,
            unixTime: 1708905600
        },
        {
            open: 0.0000383183,
            high: 0.0000383182950,
            low: 0.0000383183,
            close: 0.0000383183,
            volume: 0.00000000000000000000,
            unixTime: 1708912800
        },
        {
            open: 0.0000383183,
            high: 0.0000383182950,
            low: 0.0000383183,
            close: 0.0000383183,
            volume: 0.00000000000000000000,
            unixTime: 1708920000
        },
        {
            open: 0.0000383183,
            high: 0.0000383182950,
            low: 0.0000383183,
            close: 0.0000383183,
            volume: 0.00000000000000000000,
            unixTime: 1708927200
        },
        {
            open: 0.0000383183,
            high: 0.0000383182950,
            low: 0.0000383183,
            close: 0.0000383183,
            volume: 0.00000000000000000000,
            unixTime: 1708934400
        },
        {
            open: 0.0000383183,
            high: 0.0000383182950,
            low: 0.0000383183,
            close: 0.0000383183,
            volume: 0.00000000000000000000,
            unixTime: 1708941600
        },
        {
            open: 0.0000383183,
            high: 0.0000383182950,
            low: 0.0000383183,
            close: 0.0000383183,
            volume: 0.00000000000000000000,
            unixTime: 1708948800
        },
        {
            open: 0.0000383183,
            high: 0.0000383182950,
            low: 0.0000383183,
            close: 0.0000383183,
            volume: 0.00000000000000000000,
            unixTime: 1708956000
        },
        {
            open: 0.0000383183,
            high: 0.0000383182950,
            low: 0.0000383183,
            close: 0.0000383183,
            volume: 0.00000000000000000000,
            unixTime: 1708963200
        },
        {
            open: 0.0000383183,
            high: 0.0000399406091,
            low: 0.0000390932,
            close: 0.0000399406,
            volume: 114297.13624000000000000000,
            unixTime: 1708970400
        },
        {
            open: 0.0000399406,
            high: 0.0000399406091,
            low: 0.0000399406,
            close: 0.0000399406,
            volume: 0.00000000000000000000,
            unixTime: 1708977600
        },
        {
            open: 0.0000399406,
            high: 0.0000399406091,
            low: 0.0000399406,
            close: 0.0000399406,
            volume: 0.00000000000000000000,
            unixTime: 1708984800
        }
    ]
}

//genChart(testData, "./assets/charts/test.png")
