#!/bin/bash
# Voiceover via edge-tts (Microsoft Azure neural voices) — same engine/voices as
# the democra-ai/ai-video-studio pipeline: Ava Multilingual (EN) / Xiaoxiao 晓晓 (ZH),
# both female. Outputs vo-<lang>-s<n>.mp3 + durations.json.
set -e
OUT="/Users/tao.shen/democra-ai/air-video/public/audio"
mkdir -p "$OUT"; cd "$OUT"

EN_VOICE="en-US-AvaMultilingualNeural"; EN_RATE="+6%"
ZH_VOICE="zh-CN-XiaoxiaoNeural";       ZH_RATE="+10%"
PITCH="+0Hz"

ids=(s1 s2 s3 s4 s5 s6 s7 s8)

en_s1="There's a kind of person AI just can't replace. The real question is — are you one of them?"
en_s2="Think of it as a personality test, but for how AI-proof your work really is."
en_s3="It runs on four simple axes, and they snap together into a single four-letter code."
en_s4="Sixteen quick questions. One click to pick, one to keep moving. That's it."
en_s5="Say you take it as a software developer. Let's see what comes back."
en_s6="You're the Taste Maker. Forty-five percent replaceable, holding out till around twenty thirty-eight."
en_s7="Nearly a quarter of all work can already be done by A.I. So — where do you stand?"
en_s8="Find your archetype, free, in about four minutes, at air dot democra dot ai."

zh_s1="有一种人，AI 替不掉。"
zh_s2="这是一场性格测试，测的是你这份职业，到底有多抗 AI。"
zh_s3="四个维度，各分两端，组合成一组四字母代码，就是你的职业原型。"
zh_s4="十六道题，点一下选，再点一下走，几分钟就完。"
zh_s5="比如，你是个软件工程师，测出来是 E S F P，品味定义者。"
zh_s6="可替代性 45%，大概 2038 年。AI 能生成一千个方案，但知道哪个对的，是你。"
zh_s7="而此刻，已经有 24.7% 的工作能被 AI 接手了。你呢？"
zh_s8="来 air democra ai，免费测出你的原型。"

dur() { ffprobe -v error -show_entries format=duration -of csv=p=0 "$1"; }

echo "{" > durations.json
n=${#ids[@]}
for i in "${!ids[@]}"; do
  id="${ids[$i]}"
  en_var="en_${id}"; zh_var="zh_${id}"
  edge-tts --voice "$EN_VOICE" --rate "$EN_RATE" --pitch "$PITCH" --text "${!en_var}" --write-media "vo-en-${id}.mp3"
  edge-tts --voice "$ZH_VOICE" --rate "$ZH_RATE" --pitch "$PITCH" --text "${!zh_var}" --write-media "vo-zh-${id}.mp3"
  ed=$(dur "vo-en-${id}.mp3"); zd=$(dur "vo-zh-${id}.mp3")
  comma=","; [ "$i" -eq $((n-1)) ] && comma=""
  printf '  "%s": {"en": %s, "zh": %s}%s\n' "$id" "$ed" "$zd" "$comma" >> durations.json
done
echo "}" >> durations.json
echo "=== durations.json ==="; cat durations.json
