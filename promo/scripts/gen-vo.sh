#!/bin/bash
# Voiceover via edge-tts (same engine/voices as democra-ai/ai-video-studio):
# Ava Multilingual (EN) / Xiaoxiao 晓晓 (ZH), both female.
# 7-scene script — framed as AI RESISTANCE (not replacement); researcher example.
set -e
OUT="/Users/tao.shen/democra-ai/air-quiz/promo/public/audio"
mkdir -p "$OUT"; cd "$OUT"
rm -f vo-*.mp3

EN_VOICE="en-US-AvaMultilingualNeural"; EN_RATE="+6%"
ZH_VOICE="zh-CN-XiaoxiaoNeural";       ZH_RATE="+10%"
PITCH="+0Hz"

ids=(s1 s2 s3 s4 s5 s6 s7)

en_s1="You know your MBTI. But do you know how well your job resists A.I.?"
en_s2="There are sixteen types — the Iron Fortress, the Healing Hand, the Taste Maker — each a different way of holding your ground against AI."
en_s3="It comes down to four things. Can a machine learn your work? Can good be measured? Can mistakes be undone? And does it have to be you? Usually two fall to AI, and two you can defend."
en_s4="Answer a handful of honest questions. It's free, and it takes about a minute."
en_s5="Say you're a researcher. You might come out E S R P, the Pressure Alchemist — the kind of work AI can assist, but can't be trusted to run."
en_s6="That's one way to hold the line. Yours is still empty, waiting. So, which one are you?"
en_s7="Find your type, free, at air dot democra dot ai. Then post it, and ask a friend if they'd hold up."

zh_s1="你知道你的 MBTI，那你的职业，扛不扛得住 AI？"
zh_s2="一共十六种——铁壁堡垒、疗愈之手、品味定义者……每一种，都是一种抵挡 AI 的方式。"
zh_s3="就看四件事：AI 学得会吗？好坏量得出吗？错得起吗？非你不可吗？通常，两样会被 AI 拿走，两样，你守得住。"
zh_s4="答几道题，免费，一分钟搞定。"
zh_s5="比如你是个研究人员，可能测出来是 E S R P，高压炼金师——AI 帮得上忙，却不敢把活儿全交给它。"
zh_s6="这只是其中一种抵挡方式。那你呢，是哪一种？"
zh_s7="去 air democra ai，免费测出你的类型，然后晒出来，问问朋友，扛不扛得住。"

dur() { ffprobe -v error -show_entries format=duration -of csv=p=0 "$1"; }
echo "{" > durations.json
n=${#ids[@]}
for i in "${!ids[@]}"; do
  id="${ids[$i]}"; en_var="en_${id}"; zh_var="zh_${id}"
  edge-tts --voice "$EN_VOICE" --rate "$EN_RATE" --pitch "$PITCH" --text "${!en_var}" --write-media "vo-en-${id}.mp3"
  edge-tts --voice "$ZH_VOICE" --rate "$ZH_RATE" --pitch "$PITCH" --text "${!zh_var}" --write-media "vo-zh-${id}.mp3"
  ed=$(dur "vo-en-${id}.mp3"); zd=$(dur "vo-zh-${id}.mp3")
  comma=","; [ "$i" -eq $((n-1)) ] && comma=""
  printf '  "%s": {"en": %s, "zh": %s}%s\n' "$id" "$ed" "$zd" "$comma" >> durations.json
done
echo "}" >> durations.json
echo "=== durations.json ==="; cat durations.json