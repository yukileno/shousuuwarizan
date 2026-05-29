/**
 * 🌟 AIスワップ用ファイル 🌟
 * このファイルは、教科書の画像がアップロードされた際にAIが書き換える「問題生成ロジック」専用ファイルです。
 * 常に `window.ProblemGenerator` として機能を提供します。
 */
window.ProblemGenerator = {
    // 先生に表示する「今日のドリル」のタイトル
    topicName: "小数の割り算",

    // 現在のモード ("normal": わりきれる, "remain": あまりあり)
    mode: "normal",

    // 問題を生成して { questionText, answerText, params } を返す関数
    generate: function() {
        if (this.mode === "remain") {
            return this.generateRemainProblem();
        }
        if (this.mode === "approx") {
            return this.generateApproxProblem();
        }

        const cleanFormat = (val, dec) => {
            let str = val.toFixed(dec);
            if (str.indexOf('.') !== -1) {
                str = str.replace(/0+$/, '').replace(/\.$/, '');
            }
            return str;
        };

        let A, B, C;
        let attempts = 0;
        while (attempts < 1000) {
            attempts++;
            // A (商): 0: 整数, 1: 小数第一位, 2: 小数第二位, 3: 簡単な小数第三位
            // B (割る数): 0: 整数, 1: 小数第一位, 2: 小数第二位
            let typeA = Math.floor(Math.random() * 4);
            let typeB = Math.floor(Math.random() * 3);

            let intA, decA;
            if (typeA === 0) {
                intA = Math.floor(Math.random() * 49) + 2; // 2-50
                decA = 0;
            } else if (typeA === 1) {
                intA = Math.floor(Math.random() * 89) + 11; // 11-99
                while (intA % 10 === 0) intA = Math.floor(Math.random() * 89) + 11;
                decA = 1;
            } else if (typeA === 2) {
                intA = Math.floor(Math.random() * 89) + 11; // 11-99
                while (intA % 10 === 0) intA = Math.floor(Math.random() * 89) + 11;
                decA = 2;
            } else {
                // 簡単な小数第三位 (2.525や0.125など)
                const targets = [125, 250, 375, 500, 625, 750, 875, 2525, 1125];
                intA = targets[Math.floor(Math.random() * targets.length)];
                decA = 3;
            }

            let intB, decB;
            if (typeB === 0) {
                intB = Math.floor(Math.random() * 8) + 2; // 2-9
                decB = 0;
            } else if (typeB === 1) {
                intB = Math.floor(Math.random() * 14) + 2; // 2-15 (0.2-1.5)
                while (intB % 10 === 0) intB = Math.floor(Math.random() * 14) + 2;
                decB = 1;
            } else {
                const listB = [4, 5, 8, 25, 75]; // 0.04, 0.05, 0.08, 0.25, 0.75
                intB = listB[Math.floor(Math.random() * listB.length)];
                decB = 2;
            }

            // C = A * B
            const intC = intA * intB;
            const totalDec = decA + decB;
            
            const valA = intA / Math.pow(10, decA);
            const valB = intB / Math.pow(10, decB);
            const valC = intC / Math.pow(10, totalDec);

            const strA = cleanFormat(valA, decA);
            const strB = cleanFormat(valB, decB);
            const strC = cleanFormat(valC, totalDec);

            // フィルタ
            if (parseFloat(strC) === 0 || parseFloat(strB) === 1) continue;
            
            const decCountC = (strC.split('.')[1] || '').length;
            const decCountA = (strA.split('.')[1] || '').length;
            const decCountB = (strB.split('.')[1] || '').length;

            if (decCountC > 3 || decCountA > 3 || decCountB > 2) continue;

            // 簡単すぎる整数どうしの割り算を除外（例：Cが整数、Bが整数、Aが整数の場合）
            if (decCountC === 0 && decCountB === 0 && decCountA === 0) {
                if (Math.random() > 0.1) continue; // 90%の確率でスキップ
            }

            return {
                questionText: `${strC} ÷ ${strB}`,
                answerText: strA,
                params: null
            };
        }
        
        // フォールバック
        return {
            questionText: "2.02 ÷ 0.8",
            answerText: "2.525",
            params: null
        };
    },

    // あまりが出る割り算問題を生成する関数
    generateRemainProblem: function() {
        const cleanFormat = (val, dec) => {
            let str = val.toFixed(dec);
            if (str.indexOf('.') !== -1) {
                str = str.replace(/0+$/, '').replace(/\.$/, '');
            }
            return str;
        };

        let attempts = 0;
        while (attempts < 1000) {
            attempts++;
            // C (被除数) と B (除数) を生成
            // C: 小数第一位 (1.1 - 19.9) または 小数第二位 (0.11 - 1.99)
            // B: 整数 (2 - 9) または 小数第一位 (0.2 - 1.5)
            let decC = Math.random() < 0.5 ? 1 : 2;
            let decB = Math.random() < 0.5 ? 0 : 1;

            let intC, intB;
            if (decC === 1) {
                intC = Math.floor(Math.random() * 189) + 11; // 11-199 (1.1 - 19.9)
            } else {
                intC = Math.floor(Math.random() * 189) + 11; // 11-199 (0.11 - 1.99)
            }

            if (decB === 0) {
                intB = Math.floor(Math.random() * 8) + 2; // 2-9
            } else {
                intB = Math.floor(Math.random() * 14) + 2; // 2-15 (0.2-1.5)
                while (intB % 10 === 0) intB = Math.floor(Math.random() * 14) + 2;
            }

            // 小数桁数を最大のものに合わせる
            const maxDec = Math.max(decC, decB);
            const scaleC = Math.pow(10, maxDec - decC);
            const scaleB = Math.pow(10, maxDec - decB);

            const alignC = intC * scaleC;
            const alignB = intB * scaleB;

            // 商 A (整数)
            const A = Math.floor(alignC / alignB);
            // あまりの整数値 (被除数と同じスケール)
            const alignR = alignC - A * alignB;

            if (alignR === 0 || A === 0) continue; // 割り切れるもの、または商が0になるものは避ける

            // あまり R を小数に戻す（被除数 C と同じ小数点位置になる）
            const valR = alignR / Math.pow(10, maxDec);
            const valC = intC / Math.pow(10, decC);
            const valB = intB / Math.pow(10, decB);

            const strC = cleanFormat(valC, decC);
            const strB = cleanFormat(valB, decB);
            const strR = cleanFormat(valR, maxDec);
            const strA = A.toString();

            return {
                questionText: `${strC} ÷ ${strB} (商は整数)`,
                answerText: `${strA}あ${strR}`,
                params: null
            };
        }
        
        // フォールバック
        return {
            questionText: "2.3 ÷ 0.7 (商は整数)",
            answerText: "3あ0.2",
            params: null
        };
    },

    // 割り切れない割り算問題を生成し、商を四捨五入して1/10の位までの概数で表す
    generateApproxProblem: function() {
        const cleanFormat = (val, dec) => {
            let str = val.toFixed(dec);
            if (str.indexOf('.') !== -1) {
                str = str.replace(/0+$/, '').replace(/\.$/, '');
            }
            return str;
        };

        let attempts = 0;
        while (attempts < 1000) {
            attempts++;
            
            // 被除数 C: 1.1 - 9.9 (小数第一位) または 0.11 - 1.99 (小数第二位) 
            let decC = Math.random() < 0.6 ? 1 : 2;
            let valC = 0;
            if (decC === 1) {
                valC = (Math.floor(Math.random() * 89) + 11) / 10;
            } else {
                valC = (Math.floor(Math.random() * 189) + 11) / 100;
            }
            
            // 除数 B: 3, 6, 7, 8, 9 または 小数 0.3, 0.6, 0.7, 0.9 (割り切れなくなりやすい値)
            let valB = 0;
            const bIntList = [3, 6, 7, 8, 9];
            const bDecList = [0.3, 0.6, 0.7, 0.9];
            if (Math.random() < 0.6) {
                valB = bIntList[Math.floor(Math.random() * bIntList.length)];
            } else {
                valB = bDecList[Math.floor(Math.random() * bDecList.length)];
            }
            
            // 商の正確な値
            const rawQuotient = valC / valB;
            
            // 小数第二位で割り切れる（または小数第一位で終わる）ものは除外する
            // 1/10の位（小数第一位）までの概数を四捨五入で求める問題のため、小数第二位以下も数値が続く（割り切れない）必要がある。
            const scaled = rawQuotient * 100;
            if (Math.abs(scaled - Math.round(scaled)) < 1e-9) {
                continue;
            }
            
            // 商を四捨五入して小数第一位までにする
            const ansVal = Math.round(rawQuotient * 10) / 10;
            
            // スコアが極端に小さい、あるいは0.0になるものは避ける
            if (ansVal < 0.1) {
                continue;
            }
            
            const strC = cleanFormat(valC, decC);
            // 除数が整数のときは小数点をつけず、小数のときは小数表示にする
            const strB = valB % 1 === 0 ? valB.toString() : cleanFormat(valB, 1);
            
            const answerText = ansVal.toFixed(1); // 例: "1.7", "2.0"
            
            return {
                questionText: `${strC} ÷ ${strB} (四捨五入して1/10の位まで)`,
                answerText: answerText,
                params: null
            };
        }
        
        // フォールバック
        return {
            questionText: "5.5 ÷ 3 (四捨五入して1/10の位まで)",
            answerText: "1.8",
            params: null
        };
    }
};
