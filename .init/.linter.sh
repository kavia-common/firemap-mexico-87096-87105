#!/bin/bash
cd /home/kavia/workspace/code-generation/firemap-mexico-87096-87105/frontend_vue_app
npm run lint
ESLINT_EXIT_CODE=$?
npm run build
BUILD_EXIT_CODE=$?
if [ $ESLINT_EXIT_CODE -ne 0 ] || [ $BUILD_EXIT_CODE -ne 0 ]; then
   exit 1
fi

