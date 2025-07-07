#!/bin/bash
cd /home/kavia/workspace/code-generation/notenest-121069-b2a63b32/notes_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

