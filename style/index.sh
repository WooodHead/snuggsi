#!/usr/bin/env bash

echo "💅 ✨ snuggsiツ styles"

echo "Styling component $1"


export ENTRY="$1/index.sss"
export CONFIG=./style/config.es
export OUTPUT=./public/style.css

postcss      \
  --no-map                       \
  --config $CONFIG               \
  --parser sugarss               \
  --use postcss-easy-import      \
  --use postcss-nested           \
  --use autoprefixer             \
  --use postcss-discard-comments \
  -- $ENTRY
# --output $OUTPUT               \

