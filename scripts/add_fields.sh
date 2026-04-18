#!/bin/bash

# Target file path (relative to repo root)
FILE="src/data/models.js"
TEMP_FILE="src/data/models.js.tmp"

# Difficulty/RealWorld Map
# Pattern to match -> [Difficulty, RealWorld]
declare -A DATA
DATA["Sliding window averaging"]="beginner|Weather smoothing, sales trend analysis, stock charting"
DATA["Weighted average with decay"]="beginner|Demand forecasting, inventory planning, weather services"
DATA["Regression on own past values"]="beginner|Economic forecasting, signal processing, simple predictions"
DATA["AR + Differencing + MA"]="intermediate|GDP forecasting, stock analysis, supply chain planning"
DATA["ARIMA + Seasonal components"]="intermediate|Airline passenger forecasting, retail sales, energy demand"
DATA["Hidden state estimation from noisy observations"]="intermediate|GPS navigation, rocket guidance, autonomous vehicles, robotics"
DATA["Modeling changing volatility over time"]="advanced|Financial risk management, options pricing, portfolio optimization"
DATA["Multivariate AR - variables predict each other"]="intermediate|Macroeconomic policy, multi-asset portfolio analysis"
DATA["Hidden state memory loop"]="intermediate|Early NLP, simple sequence predictions, signal processing"
DATA["Gates control memory flow"]="intermediate|Speech recognition, machine translation, time series forecasting"
DATA["Epsilon-insensitive tube fitting"]="intermediate|Load forecasting, financial prediction, anomaly detection"
DATA["Ensemble of trees on lag features"]="beginner|Kaggle competitions, quick baselines, tabular time series"
DATA["Systematic exponential smoothing framework"]="intermediate|Automated forecasting pipelines, retail demand, R forecast package"
DATA["Random reservoir + trained readout"]="advanced|Chaotic system modeling, real-time signal processing"
DATA["Sequential error correction with trees"]="intermediate|Kaggle competitions, sales forecasting, click-through prediction"
DATA["Simplified LSTM with 2 gates"]="intermediate|NLP, machine translation, faster alternative to LSTM"
DATA["Encoder reads   Context   Decoder writes"]="advanced|Machine translation, multi-step forecasting, chatbots"
DATA["Dilated causal convolutions"]="advanced|Audio generation, speech synthesis (Google DeepMind)"
DATA["Self-attention mechanism"]="advanced|ChatGPT backbone, machine translation, all modern AI"
DATA["Probabilistic autoregressive forecasting"]="advanced|Amazon demand forecasting, probabilistic planning"
DATA["y(t) = trend + seasonality + holidays"]="beginner|Business forecasting, social media trends, quick prototyping"
DATA["Stack of fully-connected blocks with residual learning"]="advanced|M4 competition winner, interpretable forecasting"
DATA["Optimized gradient boosting with regularization"]="intermediate|Kaggle top solutions, retail, finance, any tabular + time data"
DATA["Faster boosting via histograms + leaf-wise growth"]="intermediate|Large-scale forecasting, Microsoft, click prediction"
DATA["CNN + RNN + Skip connections"]="advanced|Multivariate forecasting, traffic flow, sensor networks"
DATA["Causal dilated convolutions beat RNNs"]="advanced|Sequence modeling, audio processing, probabilistic forecasting"
DATA["Variable selection + attention + multi-horizon"]="advanced|Google retail forecasting, multi-horizon planning, energy grids"
DATA["Patches + channel independence"]="advanced|Long-term forecasting, weather prediction, energy markets"
DATA["Tokenize time series   Language model"]="advanced|Amazon zero-shot forecasting, any domain without training"
DATA["Decoder-only foundation model"]="advanced|Google zero-shot forecasting, enterprise analytics"
DATA["Auto-correlation + progressive decomposition"]="advanced|Long-term weather, energy, traffic forecasting"
DATA["ProbSparse attention for long sequences"]="advanced|AAAI 2021 best paper, long sequence time series forecasting"
DATA["Frequency-enhanced attention + decomposition"]="advanced|Weather prediction, long-term energy forecasting"
DATA["Hierarchical interpolation on N-BEATS"]="advanced|Multi-scale forecasting, electricity, traffic, weather"
DATA["ETS decomposition + Transformer attention"]="advanced|Combining classical ETS wisdom with modern Transformers"
DATA["Simple linear models challenge Transformers"]="intermediate|Efficient long-term forecasting, proving simplicity can win"
DATA["2D variation modeling via period reshaping"]="advanced|Multi-task: forecasting, classification, anomaly, imputation"
DATA["Attention on variables, not time"]="advanced|Multivariate forecasting, outperforms standard Transformers"
DATA["First TS foundation model for zero-shot forecasting"]="beginner|Any forecasting task via API call, zero ML expertise needed"
DATA["LLM-style probabilistic TS forecasting"]="advanced|Probabilistic forecasting across domains without training"
DATA["Universal forecaster for any TS task"]="advanced|Universal forecasting for any frequency or variate count"
DATA["General-purpose TS foundation model"]="advanced|Multi-task TS analysis, anomaly detection, classification"
DATA["Mixture-of-Experts for time series"]="advanced|Scalable forecasting with billions of parameters"

# Process file line by line
i=0
while IFS= read -r line || [ -n "$line" ]; do
    echo "$line" >> "$TEMP_FILE"
    
    # Check if line contains keyIdea
    if [[ "$line" =~ keyIdea:\ \'([^\']+)\' ]]; then
        idea="${BASH_REMATCH[1]}"
        if [[ -n "${DATA[$idea]}" ]]; then
            IFS='|' read -r diff rw <<< "${DATA[$idea]}"
            echo "    difficulty: '$diff'," >> "$TEMP_FILE"
            echo "    realWorld: '$rw'," >> "$TEMP_FILE"
            ((i++))
        fi
    fi
done < "$FILE"

mv "$TEMP_FILE" "$FILE"
echo "Done! Processed $i models."
