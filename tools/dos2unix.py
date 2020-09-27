#!/usr/bin/env python
import re,sys
with open(sys.argv[1], "rb") as f:
  data = f.read().split(b"\n")
with open(sys.argv[1], "wb") as fw:
  for index, line in enumerate(data):
    if index == len(data) -1 and not line:
      break
    fw.write(line.rstrip(b'\r'))
    fw.write(b'\n')
