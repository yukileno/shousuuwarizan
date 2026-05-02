/**
 * 🌟 AIスワップ用ファイル 🌟
 * このファイルは、教科書の画像がアップロードされた際にAIが書き換える「問題生成ロジック」専用ファイルです。
 * 常に `window.ProblemGenerator` として機能を提供します。
 */
window.ProblemGenerator = {
    // 先生に表示する「今日のドリル」のタイトル
    topicName: "小数の掛け算",

    // 問題を生成して { questionText, answerText, params } を返す関数
    generate: function() {
        const r = Math.random();
        let n1, n2;
        if (r < 0.4) {
            // X.X * Y.Y (e.g., 2.8 * 5.6, 1.4 * 0.6)
            n1 = (Math.floor(Math.random() * 90) + 10) / 10;
            n2 = (Math.floor(Math.random() * 90) + 10) / 10;
            if (Math.random() < 0.2) n2 = (Math.floor(Math.random() * 9) + 1) / 10;
        } else if (r < 0.7) {
            // 0.XX * Y.Y or X.X * 0.XX
            if (Math.random() < 0.5) {
                n1 = (Math.floor(Math.random() * 90) + 10) / 100;
                n2 = (Math.floor(Math.random() * 90) + 10) / 10;
            } else {
                n1 = (Math.floor(Math.random() * 90) + 10) / 10;
                n2 = (Math.floor(Math.random() * 90) + 10) / 100;
            }
        } else if (r < 0.85) {
            // XX * X.XX
            n1 = Math.floor(Math.random() * 90) + 10;
            n2 = (Math.floor(Math.random() * 900) + 100) / 100;
        } else {
            // 0.0X * X.XX
            n1 = (Math.floor(Math.random() * 9) + 1) / 100;
            n2 = (Math.floor(Math.random() * 900) + 100) / 100;
        }

        const countDecimals = function(num) {
            if (Math.floor(num) === num) return 0;
            return num.toString().split(".")[1].length || 0; 
        }
        const dec1 = countDecimals(n1);
        const dec2 = countDecimals(n2);
        
        const int1 = Math.round(n1 * Math.pow(10, dec1));
        const int2 = Math.round(n2 * Math.pow(10, dec2));
        
        const ansInt = int1 * int2;
        const ansStr = (ansInt / Math.pow(10, dec1 + dec2)).toString();

        return {
            questionText: `${n1} × ${n2}`,
            answerText: ansStr,
            params: null
        };
    }
};
