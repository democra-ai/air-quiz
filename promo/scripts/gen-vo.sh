#!/bin/bash
# Voiceover via edge-tts (same engine/voices as democra-ai/ai-video-studio):
# Ava Multilingual (EN) / Xiaoxiao 晓晓 (ZH), both female.
# 7-scene "MBTI-for-AI / which-one-are-you" script. Outputs vo-<lang>-s<n>.mp3 + durations.json.
set -e
OUT="/Users/tao.shen/democra-ai/air-quiz/promo/public/audio"
mkdir -p "$OUT"; cd "$OUT"
rm -f vo-*.mp3

EN_VOICE="en-US-AvaMultilingualNeural"; EN_RATE="+6%"
ZH_VOICE="zh-CN-XiaoxiaoNeural";       ZH_RATE="+10%"
PITCH="+0Hz"

ids=(s1 s2 s3 s4 s5 s6 s7)

en_s1="You know your MBTI. But do you know your A.I. type?"
en_s2="Sixteen types, like the personality test you love — except these don't measure who you are. They measure whether AI can do your job."
en_s3="It comes down to four questions. Can a machine learn your work? Can good be measured, or is it taste? Do mistakes cost everything? And does anyone need it to be you?"
en_s4="Answer a handful of honest questions. It's free, and it takes about a minute. That's it."
en_s5="Take a software developer. They come out E S F P, the Taste Maker. 45% replaceable, somewhere around 2038. Specific — and a little unsettling."
en_s6="That's one person's type. Yours is still sitting there, empty, waiting. So, which one are you?"
en_s7="Find out for yourself, free, at air dot democra dot ai. Then post your type, and make a friend guess theirs."

zh_s1="你知道你的 MBTI，那你的「AI 抗替代型」，又是哪种？"
zh_s2="一样是十六种人格，但这一套，测的是 AI 能不能取代你。"
zh_s3="就四个问题——AI 学得会吗？好坏量得出吗？错得起吗？还有，非你不可吗？"
zh_s4="答几道题，免费，一分钟搞定。"
zh_s5="比如一个程序员，测出来是 E S F P，品味定义者——四成五会被替代，大概在 2038 年。"
zh_s6="这只是其中一种。那你呢，是哪一种？"
zh_s7="去 air democra ai，免费测出你的类型，然后，记得晒出来。"

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